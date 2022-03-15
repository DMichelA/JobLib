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
    IonInput
} from "@ionic/react";
import React from "react";
import { logoGoogle, logIn } from "ionicons/icons";

const Login: React.FC = () => {
    return(
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
                                <IonButton expand="block">
                                    <IonIcon slot="start" icon={logoGoogle}/>
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
                                    <IonIcon slot="start" icon={logIn}/>
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
                            <IonRouterLink href="#" class="underline">Registrarse</IonRouterLink>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonFooter>
        </IonPage>
    );
};

export default Login;