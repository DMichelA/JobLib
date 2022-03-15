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

const SignUp: React.FC = () => {
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
                            <IonButton expand="block">
                                <IonIcon slot="start" icon={logoGoogle}/>
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
                                <IonInput name="email" type="text" placeholder="Ingresa tu correo electronico"></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-justify-content-center">
                        <IonCol>
                            <p>Contraseña:</p>
                            <IonItem>
                                <IonInput name="password" type="password" placeholder="Ingresa tu contraseña"></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-text-center ion-justify-content-center">
                        <IonCol>
                            <IonButton>
                                <IonIcon slot="start" icon={personAdd}/>
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