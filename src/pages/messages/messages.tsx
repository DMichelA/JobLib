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
    IonBackButton


} from "@ionic/react";
import React, { useState } from "react";
import { arrowBackCircle} from "ionicons/icons";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebase from "../database/Firebase";
import { getFirestore, collection, getDocs, doc, orderBy, query, where, setDoc } from 'firebase/firestore/lite';
import { useHistory } from "react-router";

const Messages: React.FC = () => {
  
    console.log(firebase);
    var history = useHistory();
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);
    const db = getFirestore();
    let data = history.location.state;
    console.log(data);
    let mapaDatos = Object(JSON.parse(JSON.stringify(data))['detail'])
    console.log(mapaDatos);
    let mensajes = mapaDatos.mensajesdeconversacion;
    console.log(mensajes)
    let conversacion = mapaDatos.conversacion.datosDeConversacion
    let nombreEmpleador;
    let nombrecorto: any;
    for (let i = 0; i < mapaDatos.empleadores.length; i++) {
        if (mapaDatos.empleador == mapaDatos.empleadores[i].empleador_id) {
            nombrecorto = mapaDatos.empleadores[i].empleador_nombre;
            nombreEmpleador = mapaDatos.empleadores[i].empleador_nombre + " ";

            nombreEmpleador += mapaDatos.empleadores[i].empleador_apellidoPaterno + " ";
            nombreEmpleador += mapaDatos.empleadores[i].empleador_apellidoMaterno;
            break
        }

    }



    async function Conversaciones(empleadoid: any, empleadorid: any) {
        let q = query(collection(db, "conversaciones"), where("empleado_id", "==", empleadoid), where("empleador_id", "==", empleadorid));
        let qs = await getDocs(q);
        let result = qs.docs.map(doc => doc.data());
        console.log(result);
        let idNuevaConversacion;
        if (result.length == 0) {
            idNuevaConversacion = 1;
        }
        else {
            idNuevaConversacion = result.length + 1;
        }


        return { idPosibleNuevaConversacion: idNuevaConversacion, datosDeConversacion: result };

    }

    async function Mensajes(conversacionid: any) {
        let q = query(collection(db, "mensajes"), where("conversacion_id", "==", conversacionid));
        let qs = await getDocs(q);
        let result = qs.docs.map(doc => doc.data());
        console.log(result);
        return result;

    }
    function redireccionTotal(ruta: any, datos: any) {
        let data = datos;

        history.push({
            pathname: ruta,
            state: { detail: data }
        })
    }

    async function MensajesTodos() {
        let db = getFirestore();
        let col = collection(db, "mensajes");
        let docs = await getDocs(col);
        let result = docs.docs.map(doc => doc.data());
        return result
    }

 
    async function getOrderMessages(ID: any) {
        let q = query(collection(db, "mensajes"), where("conversacion_id", "==", ID));
        let qs = await getDocs(q);
        let result = qs.docs.map(doc => doc.data());
        let orden = [];
        for (let i = 0; i < result.length; i++) {
            orden.push(result[i].mensaje_orden);
        }


        return orden;
    }


    return (

        <IonPage>
            <IonRow style={{ flex: 1 }} className="ion-text-center ion-justify-content-center">
                <IonCol style={{ backgroundColor: "#4a90e2", color: "white" }}>
                    <h1>{nombreEmpleador}</h1>
                </IonCol>
            </IonRow>
            <IonRow style={{ flex: 15 }}>
                <IonContent>
                    {mensajes.length == 0 ? <p style={{ color: "red", fontSize: 20 }}>No hay mensajes, Escribe el primer mensaje</p> : mensajes.map((mensaj: any) =>
                        <div>
                            {mensaj.tipoPersonaEmisor == "empleado" ? <p>Tu dices: <p>{mensaj.mensajeTexto}</p></p> : <p>{nombrecorto} dice: <p>{mensaj.mensajeTexto}</p></p>}

                        </div>


                    )}
                </IonContent>

            </IonRow>
            <IonRow style={{ flex: 1 }}>
                <IonInput id="mensaje" style={{ height: 50 }} placeholder="Escribe tu mensaje" />
                <IonButton color="success" onClick={async () => {
                    let mensaje = (document.getElementById('mensaje') as HTMLInputElement)?.value;
                    (document.getElementById('mensaje') as HTMLInputElement)!.value = "";
                    console.log(mensaje);
                    conversacion = await Conversaciones(mapaDatos.empleado, mapaDatos.empleador);
                    console.log(conversacion);
                    if (conversacion.datosDeConversacion.length != 0) {
                        mensajes = await Mensajes(conversacion.datosDeConversacion[0].conversacion_id);
                        console.log(mensajes)
                    }
                    conversacion = conversacion.datosDeConversacion;

                    console.log(conversacion);

                    if (mensaje != "") {
                        if (conversacion.length == 0) {
                            console.log("entro a convc 0");
                            let col = collection(db, "conversaciones");
                            let qs = await getDocs(col);
                            let results = qs.docs.map(doc => doc.data());

                            let col2 = collection(db, "mensajes");
                            let qs2 = await getDocs(col2);
                            let results2 = qs2.docs.map(doc => doc.data());



                            await setDoc(doc(db, "conversaciones", (results.length + 1).toString()), {
                                conversacion_id: (results.length + 1).toString(),
                                empleado_id: mapaDatos.empleado,
                                empleador_id: mapaDatos.empleador
                            });
                            let orden = await getOrderMessages((results.length + 1).toString())
                            console.log(orden);

                            let ordenado = orden.sort(function (a: any, b: any) { return (a - b) });
                            console.log(ordenado);
                            let valsig = ordenado[ordenado.length - 1] + 1;
                            if (orden.length == 0) {
                                valsig = 1;
                            }

                            await setDoc(doc(db, "mensajes", (results2.length + 1).toString()), {
                                mensaje_id: (results2.length + 1).toString(),
                                conversacion_id: (results.length + 1).toString(),
                                mensajeTexto: mensaje,
                                tipoPersonaEmisor: "empleado",
                                mensaje_orden: valsig
                            });

                            let empleado = mapaDatos.empleado;
                            let empleador = mapaDatos.empleador;

                            let conversaciones = await Conversaciones(empleado, empleador);
                            let mensajesdeConversacion = await Mensajes((results.length + 1).toString())
                            let diccionarioEnviar = mapaDatos;
                            diccionarioEnviar.conversacion = conversaciones;
                            diccionarioEnviar.mensajesdeconversacion = mensajesdeConversacion;
                            console.log(diccionarioEnviar);


                            redireccionTotal("/mensajes", diccionarioEnviar);
                        }
                        else {
                            console.log("entro a fuera mens 0");
                            let empleado = mapaDatos.empleado;
                            let empleador = mapaDatos.empleador;

                            let conversaciones = await Conversaciones(empleado, empleador);
                            let id_conversacion = conversaciones.datosDeConversacion[0].conversacion_id;
                            let mensajesTodos = await MensajesTodos()
                            console.log(mensajesTodos);
                            let orden = await getOrderMessages(id_conversacion)
                            console.log(orden);
                            let ordenado = orden.sort(function (a: any, b: any) { return (a - b) });
                            console.log(ordenado);
                            let valsig = ordenado[ordenado.length - 1] + 1;
                            await setDoc(doc(db, "mensajes", (mensajesTodos.length + 1).toString()), {
                                mensaje_id: (mensajesTodos.length + 1).toString(),
                                conversacion_id: id_conversacion,
                                mensajeTexto: mensaje,
                                tipoPersonaEmisor: "empleado",
                                mensaje_orden: valsig
                            });

                            conversaciones = await Conversaciones(empleado, empleador);
                            let mensajesdeConversacion = await Mensajes((id_conversacion).toString())
                            let diccionarioEnviar = mapaDatos;
                            diccionarioEnviar.conversacion = conversaciones;
                            diccionarioEnviar.mensajesdeconversacion = mensajesdeConversacion;
                            console.log(diccionarioEnviar)

                            redireccionTotal("/mensajes", diccionarioEnviar);

                        }

                    }
                }

                }>Enviar</IonButton>
            </IonRow>
            <IonRow className="ion-justify-content-center">

                <IonButton color="warning" onClick={async () => {
                    let empleado=mapaDatos.empleado;
                    let empleador=mapaDatos.empleador;
                    console.log(empleado);
                    console.log(empleador)
                    let conversaciones = await Conversaciones(empleado,empleador);
                    let idConversacion;
                    if(conversaciones.datosDeConversacion[0]==undefined){
                        idConversacion=1;
                    }
                    else{
                        idConversacion=conversaciones.datosDeConversacion[0].conversacion_id
                    }
                    let mensajesdeConversacion=await Mensajes(idConversacion)
                    
                    let diccionarioEnviar={
                        empleado_id:empleado,
                        empleadores:mapaDatos.empleadores,
                        trabajo:mapaDatos.trabajo,
                        conversacion:conversaciones,
                        mensajesdeconversacion:mensajesdeConversacion,
                        empleado:empleado,
                        empleador:empleador
                    }
                    console.log(diccionarioEnviar);
                    redireccionTotal("/mensajes",diccionarioEnviar);

                }}>
                    Recargar mensajes
                </IonButton>

            </IonRow>
            
            <IonButton onClick={() => {
                redireccionTotal("/vistaempleo", mapaDatos);
                }}><IonIcon icon={arrowBackCircle}/>Regresar</IonButton>
        </IonPage>
    );
};


export default Messages;



