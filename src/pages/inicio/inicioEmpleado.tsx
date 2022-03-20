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
    IonSelectOption,
    IonCardContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle


} from "@ionic/react";
import React, { useState } from "react";
import { logoGoogle, personAdd } from "ionicons/icons";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebase from "../database/Firebase";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore/lite';

import { useHistory } from "react-router";

const InicioEmpleado: React.FC = () => {
    console.log(firebase);
    var history = useHistory();
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);
    async function LoginWithGoogle() {
        const provider = new GoogleAuthProvider();
        console.log(provider);
        await signInWithPopup(getAuth(), provider).then(res => {
            console.log(res)
        })
    }

    async function Select(tabla: any) {

        const db = getFirestore();
        const coleccion = collection(db, tabla);

        const correos = await getDocs(coleccion);

        const listaDatos = correos.docs.map(doc => doc.data());
        console.log(listaDatos)
        return listaDatos;
    }

    async function insercion(nombre: any, apell1: any, apell2: any, dom: any, fecnac: any, sueldo: any, numcel: any, tipoPersona: any) {
        let data = history.location.state;
        data = Object(JSON.parse(JSON.stringify(data))['detail'])
        console.log(data)
        let correo = (Object(data)['correo']).toString();

        let contrasena = (Object(data)['password']).toString();
        let idc = (Object(data)['idcorreo']).toString();
        console.log(correo + " " + contrasena + " " + idc);

        const db = getFirestore();


        try {

            if (tipoPersona == "empleado") {
                let todoEmpleado = await Select("empleado");
                console.log(todoEmpleado);
                console.log(todoEmpleado.length);
                console.log(todoEmpleado.length + 1)
                if (contrasena == "google") {
                    await setDoc(doc(db, "correos", idc.toString()), {
                        idTipoPersona: (todoEmpleado.length + 1).toString(),
                        tipoPersona: "empleado",
                        correo: correo,
                        password: "unknown",
                        id: idc,
                        tipoAutenticacion: "google"
                    });

                    await setDoc(doc(db, "empleado", (todoEmpleado.length + 1).toString()), {
                        empleado_id: (todoEmpleado.length + 1).toString(),
                        empleado_correo: correo,
                        empleado_password: "unknown",
                        empleado_nombre: nombre,
                        empleado_apellidoPaterno: apell1,
                        empleado_apellidoMaterno: apell2,
                        empleado_domicilio: dom,
                        empleado_fechaNac: fecnac,
                        empleado_sueldo: sueldo
                    });

                }
                else {
                    await setDoc(doc(db, "correos", idc.toString()), {
                        idTipoPersona: (todoEmpleado.length + 1).toString(),
                        tipoPersona: "empleado",
                        correo: correo,
                        password: contrasena,
                        id: idc,
                        tipoAutenticacion: "email"
                    });

                    await setDoc(doc(db, "empleado", (todoEmpleado.length + 1).toString()), {
                        empleado_id: (todoEmpleado.length + 1).toString(),
                        empleado_correo: correo,
                        empleado_password: contrasena,
                        empleado_nombre: nombre,
                        empleado_apellidoPaterno: apell1,
                        empleado_apellidoMaterno: apell2,
                        empleado_domicilio: dom,
                        empleado_fechaNac: fecnac,
                        empleado_sueldo: sueldo
                    });
                }


            }
            else {
                if (contrasena == "google") {
                    let todoEmpleador = await Select("empleador");
                    console.log(todoEmpleador);
                    console.log(todoEmpleador.length);
                    console.log(todoEmpleador.length + 1)
                    await setDoc(doc(db, "correos", idc.toString()), {
                        idTipoPersona: (todoEmpleador.length + 1).toString(),
                        tipoPersona: "empleador",
                        correo: correo,
                        password: "unknown",
                        id: idc,
                        tipoAutenticacion: "google"
                    });

                    await setDoc(doc(db, "empleador", (todoEmpleador.length + 1).toString()), {
                        empleador_id: (todoEmpleador.length + 1).toString(),
                        empleador_correo: correo,
                        empleador_password: "unknown",
                        empleador_nombre: nombre,
                        empleador_apellidoPaterno: apell1,
                        empleador_apellidoMaterno: apell2,
                        empleador_domicilio: dom,
                        empleador_fechaNac: fecnac
                    });
                }
                else {
                    let todoEmpleador = await Select("empleador");
                    console.log(todoEmpleador);
                    console.log(todoEmpleador.length);
                    console.log(todoEmpleador.length + 1)
                    await setDoc(doc(db, "correos", idc.toString()), {
                        idTipoPersona: (todoEmpleador.length + 1).toString(),
                        tipoPersona: "empleador",
                        correo: correo,
                        password: contrasena,
                        id: idc,
                        tipoAutenticacion: 'email'
                    });

                    await setDoc(doc(db, "empleador", (todoEmpleador.length + 1).toString()), {
                        empleador_id: (todoEmpleador.length + 1).toString(),
                        empleador_correo: correo,
                        empleador_password: contrasena,
                        empleador_nombre: nombre,
                        empleador_apellidoPaterno: apell1,
                        empleador_apellidoMaterno: apell2,
                        empleador_domicilio: dom,
                        empleador_fechaNac: fecnac
                    });
                }




            }

            window.location.href = "/login";


        } catch (e) {
            console.error("Error adding document: ", e);
        }





    }

    return (
        <IonPage>
            <IonRow style={{flex:1}} className="ion-text-center ion-justify-content-center">
                <IonCol style={{flex:1}}>
                <i ><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAclBMVEX///8AAADLy8sQEBDw8PA1NTX6+vpQUFBiYmIICAheXl4jIyPk5OTs7Oy9vb0wMDAWFhbU1NS1tbU6Ojp0dHT09PSioqKTk5NKSkonJycbGxuEhIRnZ2eKioo9PT1TU1PGxsagoKCvr694eHja2tpDQ0N7djjzAAACyUlEQVR4nO2b25KCMAyGKyetlDNFEUVEff9XXLUFdafOdCmEcTb/le5F820aahMSQlAo1KscllgTK2H8k/UgXWV+bE+s2M/2YaAwzw4RXQCJupvfCF7rQlmXCKn3tve5DWr/Jvv8EgvBGsz7T9FVvw3OGt78XXvpA+/c///Ur4+rSXWs/ae1g4iDNO7+cEwZ9yYWZ+myQ4jDRwDU8mvZfjwixhVvS2ly69y+niSPa8GYv8uKpM/bWwRexWcf0D4hjS9dwEkjIoAWkPYJ2Qi/xxbJBcrVgQUIMmF3Q+QRfIK1T8hB7gHZCVck0ACJ2PodEXtRMmgAJh5FSoQnIuAQuD198kmUAC48gIsACIAACIAAegDexTwdVWWCugBsvTNPR7NwMIA3TspSXoYCXHajAKjuW3oASfx50b9oMxQgGCdpp4og0AzCdow9oLki5dIE8KxqbapcmfLpH0TG6ah62a85CREAARAAARAAARAAARLzK9k+VV2KNAFSWVQ2ksGltKvoGsoefC2fPTGZPTXzjqPY9xWlcM0gvBxtaqwoVays+xg6VmiqRlmJ/5qDCAEQAAEQAAEQAAEQgDjMVIGyWKsJwKvIN1W5VrVnaN6Kz6N0uWWKW6EeABsjM7upHQowe2bEys+L/kF0sAe6hidDbRWvLnVf2bTbyFRZpcpMtM8BHphKvfT3nIQIgAAI8F8AZmxonL2lU5QibdC25rssMdGwI7IaDN7WWwm7S3IWH2plt9F06rpTNsSSrd3ALjj0rd28a25vIO03sgq+5IQU8tYVAcZh07X336vIXX//wi+gBhxO3W3/MeBAwn7E41pAjHgU137Eo3kAedXLkEu2XU6qbfYy5NKlC3y/mEXPd1nBfo5Bp/zl98ep4Ee9Dm8h76XjvKDTFa3D31WD4OTCjftlherkD8Kqhhh4rKvm4w8Pn3XkE4X6p/oBUCxUVpQhVWIAAAAASUVORK5CYII="></img></i>
                </IonCol>
                <IonCol style={{ backgroundColor: "#1538BF",flex:22 }}>
                    <h1>Inicio</h1>
                </IonCol>
            </IonRow>
            <IonRow style={{flex:1}}>
                <IonCol style={{flex:17}} >
                    <IonInput placeholder="Buscar un empleo"></IonInput>
                </IonCol>
                <IonCol style={{flex:1}}>
                <a className="btn btn-primary"><img src="https://e7.pngegg.com/pngimages/404/688/png-clipart-computer-icons-macintosh-electronic-filter-filter-drawing-icon-miscellaneous-angle.png"></img></a>
                </IonCol>

            </IonRow >
            <IonRow style={{flex:18}}>
                <IonContent >
                    <Card />
                    

                </IonContent>
            </IonRow>
        </IonPage>





    );
};

const Card = () => {
    return <IonCard>
        <IonRow style={{ justifyContent: "center" }}>
            <img src="https://i.blogs.es/e1feab/google-fotos/450_1000.jpg" />
        </IonRow>
        <IonRow style={{ justifyContent: "center" }}>
            <IonCardHeader>
                <IonCardSubtitle>Destination</IonCardSubtitle>
                <IonCardTitle>Madison, WI</IonCardTitle>
            </IonCardHeader>
        </IonRow>
        <IonRow style={{ justifyContent: "center" }}>
            <IonCardContent style={{ justifyContent: "center", alignItems: "center" }}>
                Founded in 1829 on an isthmus between Lake Monona and Lake Mendota, Madison was named the capital of the
                Wisconsin Territory in 1836.
            </IonCardContent>
        </IonRow>
    </IonCard>





}

export default InicioEmpleado;



