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
    IonMenu,IonList,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonRouterOutlet


} from "@ionic/react";
import React, { useState } from "react";
import { arrowBackCircle } from "ionicons/icons";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebase from "../database/Firebase";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore/lite';

import { useHistory } from "react-router";

const TrabajosAplicados: React.FC = () => {
    
    console.log(firebase);
    var history = useHistory();
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);
    var history = useHistory();
    let data = history.location.state;
    let decodifyDatas=Object(JSON.parse(JSON.stringify(data))['detail']);
    console.log(decodifyDatas);
    let decodifyData=decodifyDatas["datosUser"]
    let trabajostodos=decodifyDatas["datosTrabajos"]
    let trabajos=decodifyDatas["trabajosaplicados"]
    let empleadoresexistentes=decodifyDatas["empleadores"]
    function redireccion(ruta: any, datos: any) {
        let data = datos;

        history.push({
            pathname: ruta,
            state: { detail: data }
        })
    }

    return (
        <IonPage>
            <IonRow style={{flex:1}} className="ion-text-center ion-justify-content-center">
                <IonCol style={{ backgroundColor: "#4a90e2", flex:18, color: "white"}}>
                    <h1>Trabajos Aplicados</h1>
                </IonCol>
            </IonRow>
            
            <IonRow style={{flex:18}}>
                <IonContent >
                    {trabajos.length!=0?trabajos.map((trabajo:any) => 
                        <Card  data={{contratosDatos:decodifyDatas.contratosDatos,trabajo:trabajo,empleadores:empleadoresexistentes,empleado_id:decodifyData['idtipopersona']}} />
                        
                    ):<p style={{ color: "red", fontSize: 20 }}>No hay trabajos aplicados</p>}
                
                    

                </IonContent>
            </IonRow>
        
                <IonButton onClick={async () => {
                    history.goBack();
                    let diccionarioEnviar = {
                        datosTrabajos: trabajostodos,
                        datosUser: { tipopersona: "empleado", idtipopersona: decodifyData['empleado_id'] },
                        empleadores: empleadoresexistentes
                    }
                    console.log(diccionarioEnviar);

                    redireccion("/inicioempleado", diccionarioEnviar);
                    window.location.reload();

                    
                }}><IonIcon icon={arrowBackCircle}/>Regresar</IonButton>
                    
        </IonPage>





    );
};


const Card = (props:any) => {
    var history = useHistory();
    function redireccionTotal(ruta: any, datos: any) {
        let data =datos;

        history.push({
            pathname: ruta,
            state: { detail: data }
        })
    }
    console.log(props.data)
    let id=props.data.trabajo.trabajo_id;
    let contratos=props.data.contratosDatos;
    console.log(contratos);
    let datosDeContrato=[];
    for(let i=0;i<contratos.length;i++){
        if(contratos[i].trabajo_id==id){
            console.log(contratos[i]);
            datosDeContrato.push(contratos[i]);
            break;
        }
    }
    
    return <IonCard id={props.data.trabajo_id} onClick={async function(){
        
        redireccionTotal("/vistaempleo",props.data)
        window.location.reload();
        
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
            <IonCardContent>
                <b>Descripcion:</b> {props.data.trabajo.trabajo_descripcion}<br></br>
                <b>Funciones:</b> {props.data.trabajo.trabajo_funciones}<br></br>
                <b>Status:</b> {datosDeContrato[0].status}<br></br>
            </IonCardContent>
        </IonRow>
    </IonCard>

}
export default TrabajosAplicados;



