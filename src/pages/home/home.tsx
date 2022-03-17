import { 
    IonContent, 
    IonGrid, 
    IonPage, 
    IonCardTitle, 
    IonRouterLink, 
    IonRow, 
    IonCol,
    IonFooter,
    IonButton,
    IonImg,
} from "@ionic/react";
import React from "react";

const Home: React.FC = () => {
    return (
        <IonPage>
            <IonContent fullscreen>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <IonImg src="/assets/images/Joblib.png"/>
                            </IonCol>
                        </IonRow>
                        <IonRow className="ion-text-center ion-justify-content-center">
                            <IonCol>
                                <IonCardTitle>Encontrar el empleo perfecto nunca antes más fácil</IonCardTitle>
                            </IonCol>
                        </IonRow>

                        <IonRow className="ion-text-center ion-justify-content-center">
                            <IonRouterLink>
                                <IonCol>
                                    <IonButton href="/login" expand="block">COMENZAR</IonButton>
                                </IonCol>
                            </IonRouterLink>
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

export default Home;