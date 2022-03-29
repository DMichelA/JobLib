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
    IonSelectOption


} from "@ionic/react";
import React, { useState } from "react";
import { logoGoogle, personAdd } from "ionicons/icons";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebase from "../database/Firebase";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc,query, where,updateDoc } from 'firebase/firestore/lite';
import { useIonAlert } from '@ionic/react';
import { useHistory } from "react-router";

const PerfilEmpleador: React.FC = () => {
    console.log(firebase);
    var history = useHistory();
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);
    const db=getFirestore();
    let data = history.location.state;
    let mapaDatos=Object(JSON.parse(JSON.stringify(data))['detail'])
    console.log(mapaDatos);
    
    llenarCamposUsuario();

    async function updateProfile(nombre:any, apell1:any, apell2:any, dom:any, fecnac:any,numcel:any){
        let col=collection(db,"empleador");
        let quer=query(col,where("empleador_id","==",mapaDatos['datosUser']["idtipopersona"]))
        const user = await getDocs(quer);
        const listaDatos = user.docs.map(doc => doc.data());
        console.log(listaDatos);
        const updateprofile = doc(db, "empleador", mapaDatos['datosUser']["idtipopersona"]);

        // Set the "capital" field of the city 'DC'
        await updateDoc(updateprofile, {
            empleador_nombre:nombre,
            empleador_apellidoPaterno:apell1,
            empleador_apellidoMaterno:apell2,
            empleador_domicilio:dom,
            empleador_fechaNac:fecnac,
            empleador_numcel:numcel
        
        });
        window.location.reload();
    }

    async function llenarCamposUsuario(){
        let col=collection(db,"empleador");
        let quer=query(col,where("empleador_id","==",mapaDatos['datosUser']["idtipopersona"]))
        const user = await getDocs(quer);
        const listaDatos = user.docs.map(doc => doc.data());
        console.log(listaDatos[0]['empleador_apellidoPaterno']);
        (document.getElementById("nombre") as HTMLInputElement)!.value=listaDatos[0]['empleador_nombre'];
        (document.getElementById("apellido1") as HTMLInputElement)!.value=listaDatos[0]['empleador_apellidoPaterno'];
        (document.getElementById("apellido2") as HTMLInputElement)!.value=listaDatos[0]['empleador_apellidoMaterno'];
        (document.getElementById("domicilio") as HTMLInputElement)!.value=listaDatos[0]['empleador_domicilio'];
        (document.getElementById("borndate") as HTMLInputElement)!.value=listaDatos[0]['empleador_fechaNac'];
        (document.getElementById("numcel") as HTMLInputElement)!.value=listaDatos[0]['empleador_numcel'];
    }

    
    

    return (

        <IonPage>
            <IonContent fullscreen>

                <IonRow className="ion-text-center ion-justify-content-center">
                    <IonCol style={{ backgroundColor: "#1538BF" }}>
                        <h1>Perfil</h1>
                    </IonCol>
                </IonRow>

                <IonItem>
                    <IonLabel position="floating">Nombre:</IonLabel>
                    <IonInput id="nombre" />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Primer Apellido:</IonLabel>
                    <IonInput id="apellido1" />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Segundo apelldo:</IonLabel>
                    <IonInput id="apellido2" />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Domicilio</IonLabel>
                    <IonInput id="domicilio" />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked" >Fecha Nacimiento:</IonLabel>
                    <IonInput id="borndate" type="date" />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Numero celular:</IonLabel>
                    <IonInput id="numcel" max="10" />
                </IonItem>
                <IonButton onClick={function () {
                    let nombre = (document.getElementById("nombre") as HTMLInputElement)?.value;
                    let apell1 = (document.getElementById("apellido1") as HTMLInputElement)?.value;
                    let apell2 = (document.getElementById("apellido2") as HTMLInputElement)?.value;
                    let dom = (document.getElementById("domicilio") as HTMLInputElement)?.value;
                    let fecnac = (document.getElementById("borndate") as HTMLInputElement)?.value;
                    let numcel = (document.getElementById("numcel") as HTMLInputElement)?.value;
                    
                    if (nombre == "" || nombre == null || apell1 == "" || apell1 == null || apell2 == "" || apell2 == null || dom == "" || dom == null || fecnac == "" || fecnac == null
                        || numcel == "" || numcel == null ) {
                        alert("Todos los campos son requeridos");

                    }
                    else {
                        updateProfile(nombre, apell1, apell2, dom, fecnac, numcel);
                    }

                }} className="ion-margin-top" expand="block">
                    Actualizar
                </IonButton>
                <IonRow>
                <IonButton onClick={function(){
                        history.goBack();

                    }}>Regresar</IonButton>
            </IonRow>

            </IonContent>
        </IonPage>
    );
};



export default PerfilEmpleador;



