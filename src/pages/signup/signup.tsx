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
    IonInput
} from "@ionic/react";
import React, { Component, useState } from "react";
import { logoGoogle, personAdd } from "ionicons/icons";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import firebase from "../database/Firebase";
import { getFirestore, collection, getDocs, addDoc, setDoc, doc, where, query } from 'firebase/firestore/lite';
import { useIonAlert } from '@ionic/react';
import { useHistory } from "react-router-dom";

const SignUp: React.FC = () => {
    const db = getFirestore()
    console.log(firebase);
    let history = useHistory();
    const auth = getAuth();
    console.log(auth)
    window.onload = async function () {

        let email = await getRedirectResult(auth)
        console.log(email);
        console.log(email?.user.email);
        let col = collection(db, "correos");
        const q = query(col, where("correo", "==", email?.user.email));
        const querySnapshot = await getDocs(q);
        let todoCorre = await Select("correos");
        

        if (querySnapshot.size == 0) {

            redireccionGoogle("/datauser", { correo: email?.user.email, password: "#####", idcorreo: todoCorre.length + 1 });
        }
        else {
            setChange(true);
        }
    }
    async function LoginWithGoogle() {
        const provider = new GoogleAuthProvider();
        console.log(provider);
        /*
        await signInWithPopup(getAuth(), provider).then(res => {
            console.log(res.user.email);
            insertar(res.user.email,"google");
        })*/

        const auth = getAuth();
        await signInWithRedirect(auth,provider);




    }
    async function insertar(correo: any, contra: any) {
        let existe;
        const db = getFirestore();
        let registrosCorreos = Select("correos");

        //google
        if (contra == "unknown") {
            let correos = Select("correos");
            console.log(await correos);
            existe = await correos.then(correos => {
                let i = 0;
                for (let i in correos) {
                    let userbd = (JSON.stringify(correos[i]['correo'])).toString();
                    let pw = (JSON.stringify(correos[i]['password'])).toString();
                    userbd = userbd.substring(1, userbd.length - 1);
                    pw = pw.substring(1, pw.length - 1);

                    console.log(userbd);
                    console.log(correo);
                    if (userbd == correo) {
                        return true;
                        break;
                    }
                }
            });



        }
        else {
            //email
            let datosCorreos = await registrosCorreos.then(datos => {
                return datos;
            });
            console.log(datosCorreos);

            for (let i in datosCorreos) {
                let user = (JSON.stringify(datosCorreos[i]['correo'])).toString();
                let pw = (JSON.stringify(datosCorreos[i]['password'])).toString();
                user = user.substring(1, user.length - 1);
                pw = pw.substring(1, pw.length - 1);
                console.log(user);
                console.log(pw);
                if (user == correo) {
                    console.log("ya existe el correo");
                    existe = true;
                    break;
                }
                else {
                    existe = false;
                }
            }
            if (!existe) {

                try {

                    let id = datosCorreos.length + 1;

                    redireccion("/datauser", [id, correo, contra])
                } catch (e) {
                    console.error("Error adding document: ", e);
                }

            }
        }
        console.log(existe);
        return existe;
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



    async function Select(tabla: any) {

        const db = getFirestore();
        const coleccion = collection(db, tabla);

        const data = await getDocs(coleccion);

        const listaDatos = data.docs.map(doc => doc.data());
        console.log(listaDatos);
        return listaDatos;
    }

    function redireccionGoogle(ruta: any, datos: any) {
        let data = datos

        history.push({
            pathname: ruta,
            state: { detail: data }
        })
    }


    const [change, setChange] = useState(false);
    return (
        <IonPage>
            <IonContent fullscreen>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonImg class="logo" src="/assets/images/Joblib.png" />
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-text-center ion-justify-content-center">
                        <IonCol>
                            <h1>Crear cuenta</h1>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-justify-content-center">
                        <IonCol>
                            <IonButton onClick={function () {
                                LoginWithGoogle();
                            }} expand="block">
                                <IonIcon slot="start" icon={logoGoogle} />
                                Crear cuenta con Google
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonGrid>
                    <IonRow className="ion-justify-content-center">
                        <IonCol>
                            <p>Correo electronico:</p>
                            <IonItem>
                                <IonInput id="email" name="email" type="text" placeholder="Ingresa tu correo electronico"></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-justify-content-center">
                        <IonCol>
                            <p>Contraseña:</p>
                            <IonItem>
                                <IonInput id="contra" name="password" type="password" placeholder="Ingresa tu contraseña"></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-text-center ion-justify-content-center">
                        <IonCol>
                            <IonButton onClick={async function () {

                                let correo = (document.getElementById("email") as HTMLInputElement)?.value;
                                let contra = (document.getElementById("contra") as HTMLInputElement)?.value;
                                if (correo == null || correo == "" || contra == "" || contra == null) {
                                    alert("Llena todos los datos");
                                }
                                else {
                                    let alerta = await insertar(correo, contra);
                                    console.log(alerta);
                                    if (alerta) {
                                        setChange(true);
                                    }
                                    else {
                                        setChange(false);
                                    }
                                    Select("correo");
                                }
                                console.log(change);
                            }}>
                                <IonIcon slot="start" icon={personAdd} />
                                Crear cuenta
                            </IonButton>
                        </IonCol>
                        {change ? <AlertExample /> : null}
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

const AlertExample: React.FC = () => {
    const [present] = useIonAlert();
    present('El correo ya existe')
    setTimeout(function () {
        window.location.reload()
    }, 2000)
    return null
}

export default SignUp;



