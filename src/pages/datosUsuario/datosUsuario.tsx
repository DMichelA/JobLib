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
import { getFirestore, collection, getDocs, addDoc, doc, setDoc,query, where } from 'firebase/firestore/lite';
import { useIonAlert } from '@ionic/react';
import { useHistory } from "react-router";

const DataUser: React.FC = () => {
    console.log(firebase);
    var history = useHistory();
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);
    

    async function Select(tabla: any) {

        const db = getFirestore();
        const coleccion = collection(db, tabla);

        const correos = await getDocs(coleccion);

        const listaDatos = correos.docs.map(doc => doc.data());
        console.log(listaDatos)
        return listaDatos;
    }
    function redireccion(ruta: any, datos: any) {
        let data = {
            idcorreo: datos[0],
            correo: datos[1],
            password: datos[2],

        }

        history.push({
            pathname: ruta,
            state: { detail: data }
        })
    }
    function redireccionTotal(ruta: any, datos: any) {
        let data =datos;

        history.push({
            pathname: ruta,
            state: { detail: data }
        })
    }

    async function insercion(nombre: any, apell1: any, apell2: any, dom: any, fecnac: any, sueldo: any, numcel: any, tipoPersona: any) {
        let data = history.location.state;
        data = Object(JSON.parse(JSON.stringify(data))['detail'])
        console.log(data)
        let correo = (Object(data)['correo']).toString();

        let contrasena = (Object(data)['password']).toString();
        let idc = (Object(data)['idcorreo']).toString();
        console.log(correo + " " + contrasena + " " + idc);

        const db = getFirestore();
        
        try {

            if (tipoPersona == "empleado") {
                let todoEmpleado = await Select("empleado");
                console.log(todoEmpleado);
                console.log(todoEmpleado.length);
                console.log(todoEmpleado.length + 1)
                if (contrasena == "#####") {
                    let col=collection(db, "empleado");
                    let q=query(col,where("empleado_correo","==",correo));
                    let querySnapshot=await getDocs(q);
                    if(querySnapshot.size==0){
                        await setDoc(doc(db, "correos", idc.toString()), {
                            idTipoPersona: (todoEmpleado.length + 1).toString(),
                            tipoPersona: "empleado",
                            correo: correo,
                            password: "unknown",
                            id: idc,
                            tipoAutenticacion: "google"
                        });
    
                        await setDoc(doc(db, "empleado", (todoEmpleado.length + 1).toString()), {
                            empleado_id: (todoEmpleado.length + 1).toString(),
                            empleado_correo: correo,
                            empleado_password: "unknown",
                            empleado_nombre: nombre,
                            empleado_apellidoPaterno: apell1,
                            empleado_apellidoMaterno: apell2,
                            empleado_domicilio: dom,
                            empleado_fechaNac: fecnac,
                            empleado_sueldoDeseado: sueldo
                        });
                    }
                    
                }
                else {
                    const cole = collection(db, "empleado");
                    console.log(correo);
                    const q = query(cole, where("empleado_correo", "==",correo ));
                    const querySnapshot = await getDocs(q);
                    console.log(querySnapshot.size);
                    if(querySnapshot.size==0){
                        await setDoc(doc(db, "correos", idc.toString()), {
                            idTipoPersona: (todoEmpleado.length + 1).toString(),
                            tipoPersona: "empleado",
                            correo: correo,
                            password: contrasena,
                            id: idc,
                            tipoAutenticacion: "email"
                        });
    
                        await setDoc(doc(db, "empleado", (todoEmpleado.length + 1).toString()), {
                            empleado_id: (todoEmpleado.length + 1).toString(),
                            empleado_correo: correo,
                            empleado_password: contrasena,
                            empleado_nombre: nombre,
                            empleado_apellidoPaterno: apell1,
                            empleado_apellidoMaterno: apell2,
                            empleado_domicilio: dom,
                            empleado_fechaNac: fecnac,
                            empleado_sueldoDeseado: sueldo
                        });
                    }
                }
                redireccionTotal("/inicioempleado",{tipopersona:"empleado",idtipopersona:(todoEmpleado.length + 1).toString()});
            }
            else {//inicia zona de empleador
                if (contrasena == "#####") {//empleador en google
                    let  todoEmpleador= await Select('empleador');
                    console.log(todoEmpleador);
                    console.log(todoEmpleador.length);
                    console.log(todoEmpleador.length + 1)
                    let contadorRegistrados=0;
                    for (let i=0;i<todoEmpleador.length;i++){
                        if(todoEmpleador[i]['empleador_correo']==correo){
                            contadorRegistrados++;
                        }
                    }
                    if(contadorRegistrados==0){
                        await setDoc(doc(db, "correos", idc.toString()), {
                            idTipoPersona: (todoEmpleador.length + 1).toString(),
                            tipoPersona: "empleador",
                            correo: correo,
                            password: "unknown",
                            id: idc,
                            tipoAutenticacion:"google"
                        });
    
                        await setDoc(doc(db, "empleador", (todoEmpleador.length + 1).toString()), {
                            empleador_id: (todoEmpleador.length + 1).toString(),
                            empleador_correo: correo,
                            empleador_password: "unknown",
                            empleador_nombre: nombre,
                            empleador_apellidoPaterno: apell1,
                            empleador_apellidoMaterno: apell2,
                            empleador_domicilio: dom,
                            empleador_fechaNac: fecnac
                        });
                    }
                    redireccionTotal("/inicioempleador",{tipopersona:"empleador",idtipopersona:todoEmpleador.length+1})
                    //redireccionTotal("/inicioempleador",[idc,correo.toString(),"unknown"]);

                }
                else{//empleador pero correo
                    let todoEmpleador = await Select("empleador");
                    console.log(todoEmpleador);
                    console.log(todoEmpleador.length);
                    console.log(todoEmpleador.length + 1)
                    todoEmpleador=await Select("empleador");
                    let contadorRegistrados=0;
                    for (let i=0;i<todoEmpleador.length;i++){
                        if(todoEmpleador[i]['empleador_correo']==correo){
                            contadorRegistrados++;
                        }
                    }
                    console.log(contadorRegistrados);
                    if(contadorRegistrados==0){
                        await setDoc(doc(db, "correos", idc.toString()), {
                            idTipoPersona: (todoEmpleador.length + 1).toString(),
                            tipoPersona: "empleador",
                            correo: correo,
                            password: contrasena,
                            id: idc,
                            tipoAutenticacion:'email'
                        });
        
                        await setDoc(doc(db, "empleador", (todoEmpleador.length + 1).toString()), {
                            empleador_id: (todoEmpleador.length + 1).toString(),
                            empleador_correo: correo,
                            empleador_password: contrasena,
                            empleador_nombre: nombre,
                            empleador_apellidoPaterno: apell1,
                            empleador_apellidoMaterno: apell2,
                            empleador_domicilio: dom,
                            empleador_fechaNac: fecnac
                        });
                        

                    }
                    redireccionTotal("/inicioempleador",{tipopersona:"empleador",idtipopersona:(todoEmpleador.length + 1).toString(),idcorreo:idc});


                    
                }




                

            }
        } catch (e) {
            console.error("Error adding document: ", e);
        }





    }

    return (

        <IonPage>
            <IonContent fullscreen>

                <IonRow className="ion-text-center ion-justify-content-center">
                    <IonCol style={{ backgroundColor: "#1538BF" }}>
                        <h1>Configuración</h1>
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
                <IonItem>
                    <IonLabel position="floating">Tipo persona:</IonLabel>
                    <IonSelect id="tippers" onIonChange={function(){
                        console.log("ssd");
                        console.log((document.getElementById("tippers") as HTMLInputElement)?.value);
                        if((document.getElementById("tippers") as HTMLInputElement)?.value=="empleador"){
                            (document.getElementById("sueldodeseado") as HTMLInputElement).disabled=true;
                            (document.getElementById("sueldodeseado") as HTMLInputElement).hidden=true;
                            (document.getElementById("sueldodeseado") as HTMLInputElement).value="0";
                        }
                        else{
                            (document.getElementById("sueldodeseado") as HTMLInputElement).disabled=false;
                            (document.getElementById("sueldodeseado") as HTMLInputElement).hidden=false;
                        }
                    }} >
                        <IonSelectOption value="empleado">Empleado</IonSelectOption>
                        <IonSelectOption value="empleador">Empleador</IonSelectOption>
                    </IonSelect>
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
                        || sueldo == "" || sueldo == null || numcel == "" || numcel == null || tipoPersona == "" || tipoPersona == null) {
                        alert("Todos los campos son requeridos");

                    }
                    else {
                        insercion(nombre, apell1, apell2, dom, fecnac, sueldo, numcel, tipoPersona);
                    }

                }} className="ion-margin-top" expand="block">
                    Ingresar
                </IonButton>

            </IonContent>
        </IonPage>
    );
};

const AlertExample: React.FC = () => {
    const [present] = useIonAlert();
    present('El correo ya existe', [{ text: 'Ok' }])
    return null
}

export default DataUser;



