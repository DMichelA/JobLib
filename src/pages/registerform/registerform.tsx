import {  
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonInput,
    IonDatetime,
    IonSelect,
    IonSelectOption,
} from "@ionic/react";
import React from "react";
import { logoGoogle, personAdd } from "ionicons/icons";


const RegisterForm: React.FC = () => {
    return (
        <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Configuracion</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            <IonGrid>
            <IonRow>
                <IonCol>
                    <h5>Llenar los siguientes campos</h5>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonItem>
                        <IonLabel position='floating'>Nombres(s)</IonLabel>
                        <IonInput type='text'></IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonItem>
                        <IonLabel position='floating'>Apellido Paterno</IonLabel>
                        <IonInput type='text'></IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonItem>
                        <IonLabel position='floating'>Apellido Materno</IonLabel>
                        <IonInput type='text'></IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonItem>
                        <IonLabel position='floating'>Domicilio</IonLabel>
                        <IonInput type='text'></IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonLabel>Fecha de Nacimiento</IonLabel>
                    <IonDatetime presentation="date" placeholder="Fecha de Nacimiento"/>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonItem>
                        <IonLabel position='floating'>Sueldo mensual</IonLabel>
                        <IonInput type='number'></IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonItem>
                        <IonLabel position='floating'>Numero celular</IonLabel>
                        <IonInput type='number'></IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonItem>
                        <IonLabel>Tipo persona...</IonLabel>
                        <IonSelect>
                            <IonSelectOption value="empleado">Empleado</IonSelectOption>
                            <IonSelectOption value="empleador">Empleador</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonCol>
            </IonRow>
            </IonGrid>
        </IonContent>
    </IonPage>
    );
};

export default RegisterForm;