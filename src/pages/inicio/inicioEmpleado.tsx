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
    IonCardTitle


} from "@ionic/react";
import React, { useState } from "react";
import { logoGoogle, personAdd } from "ionicons/icons";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebase from "../database/Firebase";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, query, where } from 'firebase/firestore/lite';

import { useHistory } from "react-router";
import { resolve } from "path";

const InicioEmpleado: React.FC = () => {
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
        let q = query(col, where("empleado_id", "==", decodifyData['idtipopersona']))
        let qs = await getDocs(q);
        let td = qs.docs.map(doc => doc.data());
        return td;

    }


    return (
        <IonPage>
            <IonRow style={{ flex: 1 }} className="ion-text-center ion-justify-content-center">
                <IonCol style={{ flex: 1 }}>
                    <i ><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAclBMVEX///8AAADLy8sQEBDw8PA1NTX6+vpQUFBiYmIICAheXl4jIyPk5OTs7Oy9vb0wMDAWFhbU1NS1tbU6Ojp0dHT09PSioqKTk5NKSkonJycbGxuEhIRnZ2eKioo9PT1TU1PGxsagoKCvr694eHja2tpDQ0N7djjzAAACyUlEQVR4nO2b25KCMAyGKyetlDNFEUVEff9XXLUFdafOdCmEcTb/le5F820aahMSQlAo1KscllgTK2H8k/UgXWV+bE+s2M/2YaAwzw4RXQCJupvfCF7rQlmXCKn3tve5DWr/Jvv8EgvBGsz7T9FVvw3OGt78XXvpA+/c///Ur4+rSXWs/ae1g4iDNO7+cEwZ9yYWZ+myQ4jDRwDU8mvZfjwixhVvS2ly69y+niSPa8GYv8uKpM/bWwRexWcf0D4hjS9dwEkjIoAWkPYJ2Qi/xxbJBcrVgQUIMmF3Q+QRfIK1T8hB7gHZCVck0ACJ2PodEXtRMmgAJh5FSoQnIuAQuD198kmUAC48gIsACIAACIAAegDexTwdVWWCugBsvTNPR7NwMIA3TspSXoYCXHajAKjuW3oASfx50b9oMxQgGCdpp4og0AzCdow9oLki5dIE8KxqbapcmfLpH0TG6ah62a85CREAARAAARAAARAAARLzK9k+VV2KNAFSWVQ2ksGltKvoGsoefC2fPTGZPTXzjqPY9xWlcM0gvBxtaqwoVays+xg6VmiqRlmJ/5qDCAEQAAEQAAEQAAEQgDjMVIGyWKsJwKvIN1W5VrVnaN6Kz6N0uWWKW6EeABsjM7upHQowe2bEys+L/kF0sAe6hidDbRWvLnVf2bTbyFRZpcpMtM8BHphKvfT3nIQIgAAI8F8AZmxonL2lU5QibdC25rssMdGwI7IaDN7WWwm7S3IWH2plt9F06rpTNsSSrd3ALjj0rd28a25vIO03sgq+5IQU8tYVAcZh07X336vIXX//wi+gBhxO3W3/MeBAwn7E41pAjHgU137Eo3kAedXLkEu2XU6qbfYy5NKlC3y/mEXPd1nBfo5Bp/zl98ep4Ee9Dm8h76XjvKDTFa3D31WD4OTCjftlherkD8Kqhhh4rKvm4w8Pn3XkE4X6p/oBUCxUVpQhVWIAAAAASUVORK5CYII="></img></i>
                </IonCol>
                <IonCol style={{ backgroundColor: "#1538BF", flex: 22 }}>
                    <h1>Inicio</h1>
                </IonCol>
            </IonRow>
            <IonRow style={{ flex: 1 }}>
                <IonCol style={{ flex: 17 }} >
                    <IonInput placeholder="Buscar un empleo"></IonInput>
                </IonCol>
                <IonCol style={{ flex: 1 }}>
                    <a className="btn btn-primary"><img src="https://e7.pngegg.com/pngimages/404/688/png-clipart-computer-icons-macintosh-electronic-filter-filter-drawing-icon-miscellaneous-angle.png"></img></a>
                </IonCol>

            </IonRow >
            <IonRow>
                <IonCol style={{ flex: 17 }} >
                    <IonButton onClick={function () {
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

                    <IonButton onClick={function () {
                        console.log(decodifyData);
                        redireccionTotal("/perfilempleado", decodifyData);
                        window.location.reload();
                    }}>Perfil</IonButton>
                    <IonButton onClick={async function () {
                        let todtrab = await traerTrabajosEmpleado();//todos los trabajos existentes
                        console.log(todtrab);
                        let trabapli = await traerTrabajosAplicados();//trabajos a los que el usuario ha aplicado
                        console.log(trabapli);
                        let trabajosQueHaAplicadoEsteUsuario = [];
                        for (let i = 0; i < trabapli.length; i++) {
                            console.log(trabapli[i]['trabajo_id']);
                            let trabaj = await buscarTrabajoPorId(trabapli[i]['trabajo_id']);
                            trabajosQueHaAplicadoEsteUsuario.push(trabaj[0]);

                        }
                        let diccionarioEnviar = {
                            datosTrabajos: todtrab,
                            datosUser: decodifyData,
                            empleadores: empleadoresexistentes,
                            trabajosaplicados: trabajosQueHaAplicadoEsteUsuario

                        }
                        console.log(diccionarioEnviar)
                        redireccionTotal("/trabajosaplicados", diccionarioEnviar);
                        window.location.reload();


                    }}>Empleos aplicados</IonButton>

                </IonCol>
            </IonRow>
            <IonRow style={{ flex: 1, backgroundColor: "#1538BF" }} className="">
                <h1>Empleos publicados</h1>


            </IonRow>

            <IonRow id="todo" style={{ flex: 18 }}>
                <IonContent>
                    {trabajos.map((trabajo: any) =>
                        <Card data={{ trabajo: trabajo, empleadores: empleadoresexistentes, empleado_id: decodifyData['idtipopersona'] }} />

                    )}
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

        //redireccionTotal("/vistaempleo", props.data)
        //window.location.reload();
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
                <IonCardSubtitle>Descripcion:<br></br>
                    {props.data.trabajo.trabajo_descripcion}</IonCardSubtitle>
                <IonCardSubtitle>Funciones:<br></br>
                    {props.data.trabajo.trabajo_funciones}</IonCardSubtitle>
            </IonCardHeader>
        </IonRow>
    </IonCard>

}


export default InicioEmpleado;



