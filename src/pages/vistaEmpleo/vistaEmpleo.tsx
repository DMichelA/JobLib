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
import { getFirestore, collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore/lite';

import { useHistory } from "react-router";

const vistaEmpleo: React.FC = () => {
    console.log(firebase);
    var history = useHistory();
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);
    async function LoginWithGoogle() {
        const provider = new GoogleAuthProvider();
        console.log(provider);
        await signInWithPopup(getAuth(), provider).then(res => {
            console.log(res)
        })
    }

    async function Select(tabla: any) {

        const db = getFirestore();
        const coleccion = collection(db, tabla);

        const correos = await getDocs(coleccion);

        const listaDatos = correos.docs.map(doc => doc.data());
        console.log(listaDatos)
        return listaDatos;
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
                if (contrasena == "google") {
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
                        empleado_sueldo: sueldo
                    });

                }
                else {
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
                        empleado_sueldo: sueldo
                    });
                }


            }
            else {
                if (contrasena == "google") {
                    let todoEmpleador = await Select("empleador");
                    console.log(todoEmpleador);
                    console.log(todoEmpleador.length);
                    console.log(todoEmpleador.length + 1)
                    await setDoc(doc(db, "correos", idc.toString()), {
                        idTipoPersona: (todoEmpleador.length + 1).toString(),
                        tipoPersona: "empleador",
                        correo: correo,
                        password: "unknown",
                        id: idc,
                        tipoAutenticacion: "google"
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
                else {
                    let todoEmpleador = await Select("empleador");
                    console.log(todoEmpleador);
                    console.log(todoEmpleador.length);
                    console.log(todoEmpleador.length + 1)
                    await setDoc(doc(db, "correos", idc.toString()), {
                        idTipoPersona: (todoEmpleador.length + 1).toString(),
                        tipoPersona: "empleador",
                        correo: correo,
                        password: contrasena,
                        id: idc,
                        tipoAutenticacion: 'email'
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




            }

            window.location.href = "/login";


        } catch (e) {
            console.error("Error adding document: ", e);
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
                <Card />
                <IonRow   style={{backgroundColor:"red",alignContent:"flex-end"}}>
                    <IonButton style={{float:"right"}} >Regresar</IonButton>
                </IonRow>
                

            </IonContent>
        </IonPage>





    );
};

const Card = () => {
    return <IonCard>
        <IonRow style={{ justifyContent: "center" }}>
            <IonCardHeader>
                <IonCardTitle>titulo</IonCardTitle>
                <IonCardSubtitle>Descripcion</IonCardSubtitle>
            </IonCardHeader>
        </IonRow>
        <IonRow style={{ justifyContent: "center" }}>
            <IonCardContent style={{ justifyContent: "center", alignItems: "center" }}>
                <IonRow>Edad:</IonRow>
                <IonRow>Escolaridad:</IonRow>
                <IonRow>Horario</IonRow>
            </IonCardContent>
        </IonRow>
    </IonCard>





}

export default vistaEmpleo;



