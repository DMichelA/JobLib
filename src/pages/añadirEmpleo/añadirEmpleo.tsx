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
import { getFirestore, collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore/lite';
import { useIonAlert } from '@ionic/react';
import { useHistory } from "react-router";

const AnadirEmpleo: React.FC = () => {
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
                        empleado_sueldoDeseado: sueldo
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
                        empleado_sueldoDeseado: sueldo
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
            <IonContent fullscreen>

                <IonRow className="ion-text-center ion-justify-content-center">
                    <IonCol style={{ backgroundColor: "#1538BF",flex:1 }}>
                        <IonRow style={{flex:1}}>
                        <IonCol style={{flex:1}}>
                            <IonButton>Menu</IonButton>
                        </IonCol>
                        <IonCol style={{flex:10}}>
                            <h1>Menu</h1>
                            
                        </IonCol>
                        </IonRow>
                    </IonCol>
                </IonRow>

                <IonItem>
                    <IonLabel position="floating">Titulo del empleo:</IonLabel>
                    <IonInput placeholder="Titulo del empleo" id="tituloEmpleo" />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Descripcion del empleo:</IonLabel>
                    <IonInput placeholder="Descripcion del empleo" id="descripcion" />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Ubicación:</IonLabel>
                    <IonInput id="ubicacion" placeholder="Ubicación" />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Sueldo propuesto:</IonLabel>
                    <IonInput inputMode="numeric" id="sueldo" placeholder="Sueldo propuesto" />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked" >Requisitos:</IonLabel>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating" >Edad de la persona:</IonLabel>
                    <IonInput id="edadlaborador" placeholder="edad de la persona" inputMode="numeric" />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked" >Escolaridad:</IonLabel>
                    <IonSelect id="tippers" >
                        <IonSelectOption value="primaria">Primaria o inferior</IonSelectOption>
                        <IonSelectOption value="secundaria">Secundaria</IonSelectOption>
                        <IonSelectOption value="preparatoria">Preparatoria o superior</IonSelectOption>
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Experiencia:</IonLabel>
                    <IonInput id="experiencia" placeholder="Experiencia obtenida" />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Funciones a realizar:</IonLabel>
                    <IonInput id="funciones" placeholder="Funciones a realizar" />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Horario:</IonLabel>
                    <IonRow>
                        <IonInput inputMode="numeric" placeholder="inicio"></IonInput>
                        <IonInput inputMode="numeric" placeholder="fin"></IonInput>
                    </IonRow>
                </IonItem>


                <IonItem>
                    <IonLabel position="floating">Prestaciones o beneficios:</IonLabel>
                    <IonInput placeholder="Prestaciones"></IonInput>

                </IonItem>
                <IonButton onClick={function () {
                   

                }} className="ion-margin-top" expand="block">
                    Añadir
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

export default AnadirEmpleo;



