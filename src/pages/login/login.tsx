import {
    IonContent,
    IonGrid,
    IonPage,
    IonRow,
    IonCol,
    IonImg,
    IonIcon,
    IonButton,
    IonFooter,
    IonRouterLink,
    IonItem,
    IonInput,
} from "@ionic/react";
import React, { useState } from "react";
import { logoGoogle, logIn } from "ionicons/icons";

//import  firebase from 'firebase/compat/app';
import firebase from "../database/Firebase";
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore/lite';
import { useIonAlert } from '@ionic/react';

const Login: React.FC = () => {
    function vinculacion() {
        console.error(firebase);
        const db = getFirestore();
        let todo = Select();

    }



    async function Select() {
        const db = getFirestore();
        const coleccion = collection(db, 'correos');

        const correos = await getDocs(coleccion);

        const listaDatos = correos.docs.map(doc => doc.data());

        return listaDatos;
    }

    function authenticationWithEmailAndPassword(correo: any, contrasena: any) {
        console.log(correo);
        console.log(contrasena);
        var estado=false;
        let datos = Select();
        datos.then(datos => {
            console.log(datos)
            for (const dato in datos) {
                console.log(dato)
                let user = (JSON.stringify(datos[dato]['correo'])).toString();
                let pw = (JSON.stringify(datos[dato]['password'])).toString();
                user = user.substring(1, user.length - 1);
                pw = pw.substring(1, pw.length - 1);

                console.log(user);
                console.log(pw);
                if (user == correo && contrasena == pw) {
                    console.log("el correo existe con el id" + dato);
                    window.location.href = '/signup';


                }
                else {
                    estado = true;

                }
            }
        })
        return estado;
    }




    vinculacion();
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
                            <h1>Iniciar sesion</h1>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-justify-content-center">
                        <IonCol>
                            <IonButton expand="block" >
                                <IonIcon slot="start" icon={logoGoogle} />
                                Iniciar sesion con Google
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
                            <IonButton onClick={function () {
                                let correo = (document.getElementById("email") as HTMLInputElement)?.value
                                let contra = (document.getElementById("contra") as HTMLInputElement)?.value
                                let autenticado = authenticationWithEmailAndPassword(correo, contra);
                                if (!autenticado) {
                                    setChange(true);

                                }
                                else{
                                    setChange(false);
                                }

                            }} >

                                <IonIcon slot="start" icon={logIn} />
                                Iniciar sesion
                            </IonButton>
                        </IonCol>
                        {change ? <AlertExample /> : null}
                    </IonRow>
                </IonGrid>
            </IonContent>
            <IonFooter className="ion-no-border">
                <IonGrid>
                    <IonRow className="ion-text-center ion-justify-content-center">
                        <IonCol>
                            <h6>¿No tienes cuenta?</h6>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-text-center ion-justify-content-center">
                        <IonCol>
                            <IonRouterLink href="" class="underline">Registrarse</IonRouterLink>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonFooter>
        </IonPage>
    );
};

const AlertExample: React.FC = () => {
    const [present] = useIonAlert();
    present('Usuario O  Contraseña incorrectos', [{ text: 'Ok' }])
   return null
}
export default Login;

