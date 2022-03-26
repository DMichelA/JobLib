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
import { getAuth, GoogleAuthProvider, signInWithRedirect,getRedirectResult } from "firebase/auth";
//import  firebase from 'firebase/compat/app';
import firebase from "../database/Firebase";
import { getFirestore, collection, getDocs, addDoc,query,where } from 'firebase/firestore/lite';
import { useIonAlert } from '@ionic/react';
import { useHistory } from "react-router-dom";

const Login: React.FC = () => {
    let history = useHistory();

    const db = getFirestore();
    Select();
    window.onload=async function(){
        const auth = getAuth();
        let email=await getRedirectResult(auth)
        console.log(email?.user.email);
        let col=collection(db,"correos");
        const q = query(col, where("correo", "==",email?.user.email ));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot)    
        const listaDatos = querySnapshot.docs.map(doc => doc.data());
       
        if(querySnapshot.size==0){
            seterrorNe(true);
        }
        else{
            if(listaDatos[0]['tipoPersona']=="empleado"){
                redireccion("/inicioempleado",{tipopersona:"empleado",idtipopersona:listaDatos[0]["idTipoPersona"]});
    
            }
            else{
                redireccion("/inicioempleador",{tipopersona:"empleador",idtipopersona:listaDatos[0]["idTipoPersona"]})
    
            }
             
        }
    }
    function redireccion(ruta: any, datos: any) {
        let data =datos;

        history.push({
            pathname: ruta,
            state: { detail: data }
        })
    }
    async function LoginWithGoogle() {
        const provider = new GoogleAuthProvider();
        console.log(provider);
        const auth = getAuth();
        await signInWithRedirect(auth, provider)
    }
    async function Select() {
        
        const db = getFirestore();
        const coleccion = collection(db, 'correos');

        const correos = await getDocs(coleccion);

        const listaDatos = correos.docs.map(doc => doc.data());
        console.log(listaDatos)
        return listaDatos;
    }

    async function authenticationWithEmailAndPassword(correo: any, contrasena: any) {
        console.log(correo);
        console.log(contrasena);
        var estado;
        let datos = await Select();
        console.log(datos);
        if(datos.length==0){
            estado="error NE"//NO EXISTENTE
        }
        for (const dato in datos) {
            let user = (JSON.stringify(datos[dato]['correo'])).toString();
            let pw = (JSON.stringify(datos[dato]['password'])).toString();
            user = user.substring(1, user.length - 1);
            pw = pw.substring(1, pw.length - 1);
            console.log(user);
            console.log(pw);
            if (user == correo) {
                if (pw == contrasena) {
                    estado = "correcto";
                    break;
                }
                else {
                    estado = "error pw";
                    break
                }
            }
            else {
                estado = "error email"
            }
        }
        console.log(estado);
        return estado;

    }
    const [errorPw, seterrorPW] = useState(false);
    const [errorEm, seterrorEm] = useState(false);
    const [errorNe, seterrorNe] = useState(false);

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
                            <IonButton expand="block" onClick={function () {
                                LoginWithGoogle();
                            }}>
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
                            <IonButton onClick={async function () {
                                let correo = (document.getElementById("email") as HTMLInputElement)?.value
                                let contra = (document.getElementById("contra") as HTMLInputElement)?.value
                                let autenticado = await authenticationWithEmailAndPassword(correo, contra);
                                console.log(autenticado);
                                if (autenticado == "error pw") {
                                    seterrorPW(true);
                                    seterrorEm(false)
                                    seterrorNe(false);

                                }
                                else if (autenticado == "error email") {
                                    seterrorEm(true);
                                    seterrorPW(false)
                                    seterrorNe(false);

                                }
                                else if(autenticado=="error NE"){
                                    seterrorNe(true);
                                    seterrorPW(false);
                                    seterrorEm(false)
                                }
                                else if(autenticado=='correcto'){
                                    let col=collection(db,"correos");
                                    let q=query(col,where("correo","==",correo));
                                    let qs= await getDocs(q);
                                    let qsr=qs.docs.map(doc => doc.data());
                                    console.error(qsr[0]['tipoPersona']);
                                    if(qsr[0]['tipoPersona']=="empleado"){
                                        redireccion("/inicioempleado",{tipopersona:"empleado",idtipopersona:qsr[0]['idTipoPersona']});

                                    }else{
                                        redireccion("/inicioempleador",{tipopersona:"empleador",idtipopersona:qsr[0]['idTipoPersona']});

                                    }

                                }

                                console.log(errorEm);
                                console.log(errorPw);
                                console.log(errorNe);

                            }} >
                                {errorNe?<CorreoNoRegistrado />:errorEm && !errorPw ? <CorreoNoRegistrado /> : errorPw && !errorEm ? <ContrasenaIncorrecta /> : null}


                                <IonIcon slot="start" icon={logIn} />
                                Iniciar sesion
                            </IonButton>
                        </IonCol>
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
                            <IonRouterLink href="/signup" class="underline">Registrarse</IonRouterLink>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonFooter>
        </IonPage>
    );
};

const CorreoNoRegistrado: React.FC = () => {
    const [present] = useIonAlert();
    present('Correo no registrado', [{ text: 'Ok' }])
    setTimeout(function(){
        window.location.reload()
    },3000);
    
    return null
}


const ContrasenaIncorrecta: React.FC = () => {
    const [present] = useIonAlert();
    present('La contraseña es incorrecta', [{ text: 'Ok' }])
    setTimeout(function(){
        window.location.reload()
    },3000);
    return null
}

export default Login;

