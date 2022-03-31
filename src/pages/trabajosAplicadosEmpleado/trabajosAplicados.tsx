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
import { logoGoogle, personAdd } from "ionicons/icons";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebase from "../database/Firebase";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore/lite';

import { useHistory } from "react-router";

const TrabajosAplicados: React.FC = () => {
    function onDeviceReady() {
        document.addEventListener("backbutton", function (e) {
          e.preventDefault();
          console.log("hello");
        }, false);
      }
      
    document.onload = function () {
    document.addEventListener("deviceready", onDeviceReady, false);
    };
    //BLOQUEAR TECLA RETROCESO EN EL NAVEGADOR
    window.location.hash="no-back-button";
    window.location.hash="Again-No-back-button";//esta linea es necesaria para chrome
    window.onhashchange=function(){window.location.hash="no-back-button";}
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
                <IonCol style={{ backgroundColor: "#1538BF" ,flex:2}}>
                    <IonButton>
                        menu
                    </IonButton>
                    
                </IonCol>
                <IonCol style={{ backgroundColor: "#1538BF" ,flex:18}}>
                    <h1>Trabajos Aplicados</h1>
                </IonCol>
            </IonRow>
            
            <IonRow style={{flex:18}}>
                <IonContent >
                    {trabajos.length!=0?trabajos.map((trabajo:any) => 
                        <Card  data={{trabajo:trabajo,empleadores:empleadoresexistentes,empleado_id:decodifyData['idtipopersona']}} />
                        
                    ):<p>No hay trabajos aplicados</p>}
                
                    

                </IonContent>
            </IonRow>
            
            <IonRow style={{ backgroundColor: "red", alignContent: "flex-end" }}>
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


                    }} style={{ float: "right" }} >Regresar</IonButton>
            </IonRow>
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
            <IonCardHeader>
                <IonCardSubtitle>Descripcion:<br></br>
                    {props.data.trabajo.trabajo_descripcion}</IonCardSubtitle>
                <IonCardSubtitle>Funciones:<br></br>
                    {props.data.trabajo.trabajo_funciones}</IonCardSubtitle>
            </IonCardHeader>
        </IonRow>
    </IonCard>

}
export default TrabajosAplicados;



