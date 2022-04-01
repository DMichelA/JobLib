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
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, query, where, updateDoc } from 'firebase/firestore/lite';

import { useHistory } from "react-router";
import { error } from "console";

const VistaEmpleo: React.FC = () => {
    console.log(firebase);
    let db = getFirestore();
    var history = useHistory();
    let data = history.location.state;
    let decodifyDatas = Object(JSON.parse(JSON.stringify(data))['detail']);
    console.log(decodifyDatas);
    aplicado()
    if (console.error.length != 0) {
        window.location.reload()
    }
    async function trabajosTodos() {
        let col = collection(db, 'trabajo');
        let datos = getDocs(col);
        let values;
        let qall = await datos.then(res => {
            values = res.docs.map(doc => doc.data())
            return values;
        });
        return qall;
    }
    async function empleadoresexistentes() {
        let col = collection(db, "empleador");
        let datos = await getDocs(col);
        let datoss = datos.docs.map(doc => doc.data())
        return datoss;

    }
    function redireccion(ruta: any, datos: any) {
        let data = datos;

        history.push({
            pathname: ruta,
            state: { detail: data }
        })
    }

    async function getContratos() {
        let col = collection(db, "contrato");
        let docs = await getDocs(col);
        let qs = docs.docs.map(doc => doc.data())
        return qs;
    }

    async function aplicado() {
        let col = collection(db, "contrato");
        let q = query(col, where("empleado_id", "==", decodifyDatas['empleado_id']), where("trabajo_id", "==", decodifyDatas['trabajo']['trabajo_id']));
        let querySnapshot = await getDocs(q);
        let qs = querySnapshot.docs.map(doc => doc.data())
        console.log(qs[0]);
        if (qs[0]['status'] == "PENDIENTE") {
            document.getElementById("aplicar")!.innerText = "NO ESTOY INTERESADO YA"
        }
        else if (qs[0]['status'] == "CANCELADA") {
            document.getElementById("aplicar")!.innerText = "ESTOY INTERESADO"

        }
        else if (qs[0]['status'] == "RECHAZADA") {
            document.getElementById("aplicar")!.innerText = "ESTOY INTERESADO"
        }
    }



    return (
        <IonPage>
            <IonRow className="ion-text-center ion-justify-content-center">
                <IonCol style={{ backgroundColor: "#1538BF" }}>
                    <h1>Vista empleo</h1>
                </IonCol>
            </IonRow>
            <IonContent >
                <Card data={decodifyDatas} />
                <IonButton id="aplicar" onClick={async () => {
                    if (document.getElementById("aplicar")?.innerText == "ESTOY INTERESADO") {
                        document.getElementById("aplicar")!.innerText = "NO ESTOY INTERESADO YA"
                    }
                    else {
                        document.getElementById("aplicar")!.innerText = "ESTOY INTERESADO"
                    }


                    if (document.getElementById("aplicar")?.innerText == "ESTOY INTERESADO") {
                        let todoContratos = await getContratos();
                        console.log(todoContratos);
                        for (let i = 0; i < todoContratos.length; i++) {
                            console.log(todoContratos[i])
                            if (todoContratos[i]['empleado_id'] == decodifyDatas['empleado_id'] && todoContratos[i]['trabajo_id'] == decodifyDatas['trabajo']['trabajo_id']) {
                                const update = doc(db, "contrato", todoContratos[i]['contrato_id']);
                                await updateDoc(update, {
                                    status: 'CANCELADA'
                                });
                            }
                            
                        }
                        
                    }
                    else {
                        let todoContratos = await getContratos();
                        console.log(todoContratos);
                        let insercion = 0;
                        for (let i = 0; i < todoContratos.length; i++) {
                            console.log(todoContratos[i])
                            if (todoContratos[i]['empleado_id'] == decodifyDatas['empleado_id'] && todoContratos[i]['trabajo_id'] == decodifyDatas['trabajo']['trabajo_id']) {
                                const update = doc(db, "contrato", todoContratos[i]['contrato_id']);
                                await updateDoc(update, {
                                    status: 'PENDIENTE'
                                });
                                insercion++;
                            }
                            
                        }
                        if (insercion == 0) {
                            await setDoc(doc(db, "contrato", (todoContratos.length + 1).toString()), {
                                contrato_id: (todoContratos.length + 1).toString(),
                                empleado_id: decodifyDatas['empleado_id'],
                                empleador_id: decodifyDatas['trabajo']['empleador_id'],
                                trabajo_id: decodifyDatas['trabajo']['trabajo_id'],
                                status: 'PENDIENTE'
                            });
                        }


                    }
                    window.location.reload();
                }}>ESTOY INTERESADO</IonButton>
                <IonRow style={{ backgroundColor: "red", alignContent: "flex-end" }}>
                    <IonButton onClick={async () => {
                        history.goBack();
                        let datosTrabajo = trabajosTodos();
                        let empleadores = await empleadoresexistentes();
                        console.log(empleadores)
                        datosTrabajo.then(res => {
                            let diccionarioEnviar = {
                                datosTrabajos: res,
                                datosUser: { tipopersona: "empleado", idtipopersona: decodifyDatas['empleado_id'] },
                                empleadores: empleadores
                            }
                            console.log(diccionarioEnviar);

                            redireccion("/inicioempleado", diccionarioEnviar);
                            window.location.reload();
                        })


                    }} style={{ float: "right" }} >Regresar</IonButton>
                </IonRow>


            </IonContent>
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

    let empleadoress = props.data.empleadores;
    for (let i = 0; i < empleadoress.length; i++) {
        if (empleadoress[i]["empleador_id"] == props.data.trabajo.empleador_id) {
            empleadoress = empleadoress[i]
        }
    }
    console.log(empleadoress);

    return <IonCard id={props.data.trabajo.trabajo_id} onClick={function () {

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
        <IonRow >
            <IonCardContent >
                <IonRow style={{ justifyContent: "left" }}>
                    Horario<br></br>
                    Entrada:{props.data.trabajo.trabajo_horaInicio}     Salida:{props.data.trabajo.trabajo_horaFin}<br></br>
                    Requisitos<br />
                    Experiencia:{props.data.trabajo.trabajo_experiencia}<br />
                    Escolaridad:{props.data.trabajo.trabajo_escolaridad}<br />
                    Edad:{props.data.trabajo.trabajo_edad} <br />
                    Prestaciones<br />
                    {props.data.trabajo.trabajo_prestaciones}
                </IonRow>
                <IonRow style={{ justifyContent: "center" }}>
                    Datos de Contacto <br />
                    Nombre Completo:{empleadoress.empleador_nombre} {empleadoress.empleador_apellidoPaterno} {empleadoress.empleador_apellidoMaterno} <br />
                    Numero de Celular: {empleadoress.empleador_numcel} <br />
                    <IonButton>Contactar por mensaje</IonButton>

                </IonRow>

            </IonCardContent>
        </IonRow>

    </IonCard>

}

export default VistaEmpleo;



