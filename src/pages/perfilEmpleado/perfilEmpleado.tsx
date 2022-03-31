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
import { getFirestore, collection, getDocs,  doc, updateDoc ,query, where } from 'firebase/firestore/lite';
import { useHistory } from "react-router";

const PerfilEmpleado: React.FC = () => {
    
    console.log(firebase);
    var history = useHistory();
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);
    const db=getFirestore();
    let data = history.location.state;
    console.log(data);
    let mapaDatos=Object(JSON.parse(JSON.stringify(data))['detail'])
    
    console.log(mapaDatos);
    
    llenarCamposUsuario();
    async function updateProfile(nombre:any, apell1:any, apell2:any, dom:any, fecnac:any,numcel:any,sueldo:any){
        let col=collection(db,"empleado");
        let quer=query(col,where("empleado_id","==",mapaDatos["idtipopersona"]))
        const user = await getDocs(quer);
        const listaDatos = user.docs.map(doc => doc.data());
        console.log(listaDatos);
        const updateprofile = doc(db, "empleado", mapaDatos["idtipopersona"]);

        await updateDoc(updateprofile, {
            empleado_nombre:nombre,
            empleado_apellidoPaterno:apell1,
            empleado_apellidoMaterno:apell2,
            empleado_domicilio:dom,
            empleado_fechaNac:fecnac,
            empleado_numcel:numcel,
            empleado_sueldoDeseado:sueldo
        
        });
        window.location.reload();
    }

    async function llenarCamposUsuario(){
        let col=collection(db,"empleado");
        let quer=query(col,where("empleado_id","==",mapaDatos["idtipopersona"]))
        const user = await getDocs(quer);
        const listaDatos = user.docs.map(doc => doc.data());
        console.log(listaDatos[0]);
        (document.getElementById("nombre") as HTMLInputElement)!.value=listaDatos[0]['empleado_nombre'];
        (document.getElementById("apellido1") as HTMLInputElement)!.value=listaDatos[0]['empleado_apellidoPaterno'];
        (document.getElementById("apellido2") as HTMLInputElement)!.value=listaDatos[0]['empleado_apellidoMaterno'];
        (document.getElementById("domicilio") as HTMLInputElement)!.value=listaDatos[0]['empleado_domicilio'];
        (document.getElementById("borndate") as HTMLInputElement)!.value=listaDatos[0]['empleado_fechaNac'];
        (document.getElementById("numcel") as HTMLInputElement)!.value=listaDatos[0]['empleado_numcel'];
        (document.getElementById("sueldodeseado") as HTMLInputElement)!.value=listaDatos[0]['empleado_sueldoDeseado'];

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
                    <IonLabel position="floating" id="labelsueldo">Sueldo mensual deseado:</IonLabel>
                    <IonInput id="sueldodeseado" inputMode="numeric" />
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
                    let sueldo = (document.getElementById("sueldodeseado") as HTMLInputElement)?.value;
                    let numcel = (document.getElementById("numcel") as HTMLInputElement)?.value;
                    let tipoPersona = (document.getElementById("tippers") as HTMLInputElement)?.value;
                    if(tipoPersona=="empleador"){
                        
                    }
                    if (nombre == "" || nombre == null || apell1 == "" || apell1 == null || apell2 == "" || apell2 == null || dom == "" || dom == null || fecnac == "" || fecnac == null
                        || sueldo == "" || sueldo == null || numcel == "" || numcel == null ) {
                        alert("Todos los campos son requeridos");

                    }
                    else {
                        updateProfile(nombre, apell1, apell2, dom, fecnac, numcel,sueldo);
                    }

                }} className="ion-margin-top" expand="block">
                    Actualizar
                </IonButton>
                <IonButton onClick={()=>{
                    history.goBack();
                }}>
                    Regresar
                </IonButton>

            </IonContent>
        </IonPage>
    );
};


export default PerfilEmpleado;



