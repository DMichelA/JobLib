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
import React from "react";
import { logoGoogle, personAdd } from "ionicons/icons";
import { getAuth, GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import firebase from "../database/Firebase";
import { getFirestore, collection, getDocs,addDoc } from 'firebase/firestore/lite';

const SignUp: React.FC = () => {
    async function LoginWithGoogle(){
        const provider = new GoogleAuthProvider();
        console.log(provider);
        await signInWithPopup(getAuth(),provider).then(res=>{
            console.log(res)
        })
    }
    async function insertar(correo:any,contra:any){
        
        const db = getFirestore();
        try {
            const docRef = await addDoc(collection(db, "correos"), {
              correo: correo,
              password: contra,
            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }
    async function Select() {
        const db = getFirestore();
        const coleccion = collection(db, 'correos');
        
        const correos = await getDocs(coleccion);
        
        const listaDatos = correos.docs.map(doc => doc.data());
        console.log(listaDatos)
        return listaDatos;
    }
    
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
                            <IonButton onClick={function(){
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
                            <IonButton onClick={ function(){
                                    let correo=(document.getElementById("email")as HTMLInputElement)?.value
                                    let contra=(document.getElementById("contra")as HTMLInputElement)?.value
                                    
                                    insertar(correo,contra);
                                    Select();
                                } }>
                                <IonIcon slot="start" icon={personAdd} />
                                Crear cuenta
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default SignUp;


 
