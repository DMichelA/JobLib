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

const FiltroEmpleado: React.FC = () => {
    return (

        <IonPage>
            <IonContent fullscreen>

                <IonRow style={{ flex: 1 }} className="">
                    <IonRow style={{ flex: 1, backgroundColor: "#1538BF" }}>
                        <IonCol style={{ flex: 1 }}>
                            <IonButton>Menu</IonButton>
                        </IonCol>
                        <IonRow style={{ flex: 18, backgroundColor: 'black',justifyContent:'center' }}>
                            Filtros
                        </IonRow>
                    </IonRow>
                </IonRow>
                <IonRow style={{ flex: 1, justifyContent: 'right' }} className="">
                    <IonButton>Limpiar</IonButton>
                </IonRow>
                <IonRow style={{ flex: 18 }}>
                    <IonCol style={{ flex: 1 }}>
                        <IonRow style={{ flex: 1, }}>
                            <IonItem>
                                <IonLabel position="stacked">Tipo Empleo:</IonLabel>
                                <IonSelect id="tippers" >
                                    <IonSelectOption value="empleado">Empleado</IonSelectOption>
                                    <IonSelectOption value="empleador">Empleador</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </IonRow>
                        <IonRow style={{ flex: 1 }}>

                            <IonLabel position="stacked">Salario estimado:</IonLabel>
                            <IonCol>
                                <IonInput placeholder="min" type="number" id="minsal" />

                            </IonCol>
                            <IonCol>
                                <IonInput placeholder="max" type="number" id="maxsal" />
                            </IonCol>

                        </IonRow>
                        <IonRow style={{ flex: 1 }}>
                            <IonCol style={{ flex: 1 }}>
                                <IonLabel position="stacked" >Fecha de Publicacion:</IonLabel>

                            </IonCol>
                            <IonCol style={{ flex: 1 }}>
                                <IonInput id="fechapublicacion" type="date" />

                            </IonCol>
                            <IonCol style={{ flex: 8 }}>

                            </IonCol>


                        </IonRow>
                        <IonRow style={{ flex: 1 }}>
                            <IonCol style={{ flex: 1, justifyContent: 'center' }}>
                                <IonLabel position="floating">Edad:</IonLabel>
                            </IonCol>
                            <IonCol style={{ flex: 2 }}>
                                <IonInput placeholder="edad" type="number" id="edad" />
                            </IonCol>
                            <IonCol style={{ flex: 8 }}>
                            </IonCol>
                        </IonRow>
                        <IonRow style={{ flex: 1,justifyContent:'center' }}>
                            <IonButton onClick={function () {

                            }} className="ion-margin-top" expand="block">
                                Aplicar
                            </IonButton>

                        </IonRow>
                    </IonCol>
                </IonRow>



            </IonContent>
        </IonPage>
    );
};

const AlertExample: React.FC = () => {
    const [present] = useIonAlert();
    present('El correo ya existe', [{ text: 'Ok' }])
    return null
}

export default FiltroEmpleado;



