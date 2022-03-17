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
    IonButton,
    IonIcon,
    IonPopover,
    IonText,
    IonAvatar,
} from "@ionic/react";
import React from "react";
import { arrowForwardCircle, calendar, camera } from "ionicons/icons";
import { useState } from "react";
import { format, parseISO } from "date-fns";


const RegisterForm: React.FC = () => {

    const [popoverDate, setPopoverDate] = useState('');

    const formatDate = (value: string) => {
        return format(parseISO(value), 'MMM dd yyyy');
    };

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
                    <IonTitle>Llena los siguientes campos</IonTitle>
                </IonCol>
            </IonRow>
            <IonRow class="ion-text-center ion-justify-content-center">
                <IonCol>
                    <IonButton>
                        <IonIcon slot="start" icon={camera}/>
                        Seleccionar una Imagen
                    </IonButton>
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
                <IonItem button={true} id="open-date-input">
                    <IonLabel>Fecha de Nacimiento</IonLabel>
                    <IonText slot="end">{popoverDate}</IonText>
                    <IonIcon icon={calendar} />
                    <IonPopover trigger="open-date-input" showBackdrop={false}>
                    <IonDatetime
                        presentation="date"
                        onIonChange={ev => setPopoverDate(formatDate(ev.detail.value!))}
                    />
                    </IonPopover>
                </IonItem>
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
                        <IonLabel>Selecciona</IonLabel>
                        <IonSelect>
                            <IonSelectOption value="empleado">Empleado</IonSelectOption>
                            <IonSelectOption value="empleador">Empleador</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonCol>
            </IonRow>
            <IonRow class="ion-text-end ion-justify-content-end">
                <IonCol>
                    <IonButton>
                        <IonIcon slot="start" icon={arrowForwardCircle}/>
                        Siguiente
                    </IonButton>
                </IonCol>
            </IonRow>
            </IonGrid>
        </IonContent>
    </IonPage>
    );
};

export default RegisterForm;