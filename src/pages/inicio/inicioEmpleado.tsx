import {
    IonContent,
    IonGrid,
    IonPage,
    IonRow,
    IonCol,
    IonImg,
    IonButton,
    IonIcon,
    IonItem,
    IonInput,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonCardContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonMenuButton,


} from "@ionic/react";
import React, { useState } from "react";
import { logOut } from "ionicons/icons";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebase from "../database/Firebase";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, query, where } from 'firebase/firestore/lite';

import { useHistory } from "react-router";
import { resolve } from "path";

const InicioEmpleado: React.FC = () => {
    document.addEventListener('ionBackButton', ( ev:any) => {
        ev.detail.register(10, () => {
            window.location.reload();
        });
      });
    console.log(firebase);
    const db = getFirestore();
    var history = useHistory();
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);
    let data = history.location.state;
    let decodifyDatas = Object(JSON.parse(JSON.stringify(data))['detail'])
    console.log(decodifyDatas);
    let decodifyData = decodifyDatas["datosUser"]
    let trabajos = decodifyDatas["datosTrabajos"]
    let empleadoresexistentes = decodifyDatas["empleadores"]
    console.log(empleadoresexistentes);
    console.log(decodifyData);
    console.log(trabajos);


    async function traerTrabajosEmpleado() {
        let col = collection(db, 'trabajo');
        let datos = getDocs(col);
        let values;
        let qall = await datos.then(res => {
            values = res.docs.map(doc => doc.data())
            return values;
        });
        console.log(qall)
        /*
        for(let i=0;i<qall.length;i++){
            if(contador<qall.length){
                insertarCard(qall[i]['trabajo_id'],qall[i]['trabajo_titulo'],qall[i]['trabajo_descripcion'],qall[i]['trabajo_funciones'],qall[i]['trabajo_horaInicio'],
                qall[i]['trabajo_horaFin'],qall[i]['trabajo_prestaciones'],qall[i]['trabajo_sueldo'],qall[i]['trabajo_ubicacion'],qall[i]['empleador_id']);
               
            } 
        }
        */
        return qall;

    }


    async function TraerDatosDeUsuario(tipoUser: any, idUser: any) {
        let db = getFirestore();
        let qs;
        console.log(tipoUser);
        console.log(idUser);
        if (tipoUser == "empleado") {
            let col = collection(db, "empleado");
            let q = query(col, where("empleado_id", "==", idUser))
            qs = await getDocs(q);
        }
        else {
            let col = collection(db, "empleador");
            let q = query(col, where("empleador_id", "==", idUser))
            qs = await getDocs(q);// qs query snapshot
        }

        let qsr = qs.docs.map(doc => doc.data());
        console.log(qsr[0]);
        return qsr[0];//qsr querysnapshotresult
    }

    function redireccionTotal(ruta: any, datos: any) {
        let data = datos;

        history.push({
            pathname: ruta,
            state: { detail: data }
        })
    }

    async function buscarTrabajoPorId(ID: any) {
        let q = query(collection(db, "trabajo"), where("trabajo_id", "==", ID.toString()));
        let qs = await getDocs(q);
        let result = qs.docs.map(doc => doc.data());
        console.log(result);
        return result;
    }


    async function traerTrabajosAplicados() {
        let col = collection(db, "contrato");
        console.log(decodifyData['idtipopersona'])
        let q = query(col, where("empleado_id", "==", decodifyData['idtipopersona']));
        let qs = await getDocs(q);
        let td = qs.docs.map(doc => doc.data());
        console.log(td);
        return td;

    }


    return (
        <IonPage>
            <IonRow style={{ flex: 1 }} className="ion-text-center ion-justify-content-center">
                <IonCol style={{ backgroundColor: "#4a90e2", flex: 22, color: "white" }}>
                    <h1>Inicio</h1>
                </IonCol>
            </IonRow>

            <IonRow>
                <IonCol style={{ flex: 17 }} >
                    <IonButton color="warning" onClick={function () {
                        //window.location.reload();
                        let todtrab = traerTrabajosEmpleado();
                        console.log(todtrab);
                        todtrab.then(res => {
                            console.log(res);
                            let diccionarioEnviar = {
                                datosTrabajos: res,
                                datosUser: decodifyData,
                                empleadores: empleadoresexistentes

                            }

                            redireccionTotal("/inicioempleado", diccionarioEnviar);
                        })

                    }}>Recargar trabajos</IonButton>
                    <IonButton color="secondary" onClick={async function () {
                        let todtrab = await traerTrabajosEmpleado();//todos los trabajos existentes
                        console.log(todtrab);
                        let trabapli = await traerTrabajosAplicados();//trabajos a los que el usuario ha aplicado
                        console.log(trabapli);
                        let trabajosQueHaAplicadoEsteUsuario = [];
                        for (let i = 0; i < trabapli.length; i++) {
                            console.log(trabapli[i]['trabajo_id']);
                            let trabaj = await buscarTrabajoPorId(trabapli[i]['trabajo_id']);
                            console.log(trabaj);
                            trabajosQueHaAplicadoEsteUsuario.push(trabaj[0]);

                        }
                        let diccionarioEnviar = {
                            datosTrabajos: todtrab,
                            datosUser: decodifyData,
                            empleadores: empleadoresexistentes,
                            trabajosaplicados: trabajosQueHaAplicadoEsteUsuario,
                            contratosDatos:trabapli

                        }
                        console.log(diccionarioEnviar)
                        redireccionTotal("/trabajosaplicados", diccionarioEnviar);
                        


                    }}>Empleos aplicados</IonButton>
                    <IonRow>
                        <IonButton onClick={function () {
                            console.log(decodifyData);
                            redireccionTotal("/perfilempleado", decodifyData);
                            window.location.reload();
                        }}>Perfil</IonButton>
                    </IonRow>
                    <IonButton color="danger" onClick={()=>{
                        window.location.href= "/";
                    }}><IonIcon icon={logOut}/>
                        Cerrar sesion
                    </IonButton>


                </IonCol>
            </IonRow>
            <IonRow style={{ flex: 1, backgroundColor: "#4a90e2", color: "white" }} className="">
                <h1>Empleos publicados</h1>


            </IonRow>

            <IonRow id="todo" style={{ flex: 18 }}>
                <IonContent>
                    {trabajos!=undefined?trabajos.length!=0?trabajos.map((trabajo: any) =>
                        <Card data={{ trabajo: trabajo, empleadores: empleadoresexistentes, empleado_id: decodifyData['idtipopersona'] }} />
                    ):<p style={{ color: "red", fontSize: 20 }}>No hay trabajos disponibles</p>:null}
                </IonContent>
            </IonRow>




        </IonPage>





    );
};

const Card = (props: any) => {
    var history = useHistory();
    function redireccionTotal(ruta: any, datos: any) {
        let data = datos;

        history.push({
            pathname: ruta,
            state: { detail: data }
        })
    }

    return <IonCard id={props.data.trabajo_id} onClick={async function () {

        redireccionTotal("/vistaempleo", props.data)
        window.location.reload();
        console.log(props.data)

    }}>
        <IonRow style={{ justifyContent: "center" }}>
            <IonCardHeader>
                <IonCardTitle>{props.data.trabajo.trabajo_titulo}</IonCardTitle>
            </IonCardHeader>
        </IonRow>
        <IonRow style={{ justifyContent: "center" }}>
            <img src="https://i.blogs.es/e1feab/google-fotos/450_1000.jpg" />
        </IonRow>
        <IonRow style={{ justifyContent: "center" }}>
            <IonCardHeader>
                <b>Descripcion:</b> {props.data.trabajo.trabajo_descripcion}<br></br>
                <b>Funciones:</b> {props.data.trabajo.trabajo_funciones}<br></br>
            </IonCardHeader>
        </IonRow>
    </IonCard>

}


export default InicioEmpleado;



