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
    let conversacion = mapaDatos.conversacion.datosDeConversacion
    if(mapaDatos.empleadorDatos==undefined){
        window.location.reload()
    }
    let nombreEmpleador=mapaDatos.empleadorDatos.empleador_nombre;
    let nombreEmpleado=mapaDatos.empleadoDatos.empleado_nombre+" "+ mapaDatos.empleadoDatos.empleado_apellidoPaterno + " "+mapaDatos.empleadoDatos.empleado_apellidoMaterno;
    let nombrecorto=mapaDatos.empleadoDatos.empleado_nombre;
    console.log(nombreEmpleador)
    console.log(mensajes);





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
    async function getOrderMessages(ID:any){
        let q=query(collection(db,"mensajes"),where("conversacion_id","==",ID));
        let qs=await getDocs(q);
        let result=qs.docs.map(doc=>doc.data());
        let orden=[];
        for(let i=0;i<result.length;i++){
            orden.push(result[i].mensaje_orden);
        }


        return orden;
    }

    async function Empleador(ID:any){
        let q=query(collection(db,'empleador'),where("empleador_id","==",ID))
        let qs=await getDocs(q);
        let result= qs.docs.map(doc=>doc.data());
        return result;
    }


    async function Empleado(ID:any){
        let q=query(collection(db,'empleado'),where("empleado_id","==",ID))
        let qs=await getDocs(q);
        let result= qs.docs.map(doc=>doc.data());
        return result;
    }
    return (

        <IonPage>
            <IonRow style={{ flex: 1 }} className="ion-text-center ion-justify-content-center">
                <IonCol style={{ backgroundColor: "#1538BF" }}>
                    <h1>{nombreEmpleado}</h1>
                </IonCol>
            </IonRow>
            <IonRow style={{ flex: 15 }}>
                <IonContent>
                    {mensajes.length == 0 ? <p>No hay mensajes, Escribe el primer mensaje</p> : mensajes.map((mensaj: any) =>
                        mensaj.tipoPersonaEmisor=="empleador"? <p>Tu dices: {mensaj.mensajeTexto}</p>:<p>{nombrecorto} dice: {mensaj.mensajeTexto}</p>
                    )}
                </IonContent>

            </IonRow>
            <IonRow style={{ flex: 1 }}>
                <IonInput id="mensaje" style={{ height: 50 }} placeholder="Escribe tu mensaje" />
                <IonButton onClick={async () => {
                    let mensaje = (document.getElementById('mensaje') as HTMLInputElement)?.value;
                    (document.getElementById('mensaje') as HTMLInputElement)!.value="";
                    console.log(mensaje);
                    conversacion = await Conversaciones(mapaDatos.empleadoDatos.empleado_id, mapaDatos.empleadorDatos.empleador_id);
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
                                empleado_id: mapaDatos.empleadoDatos.empleado_id,
                                empleador_id: mapaDatos.empleadorDatos.empleador_id
                            });
                            let orden=await getOrderMessages((results.length + 1).toString())
                            console.log(orden);
                            let ordenado=orden.sort(function(a:any, b:any){return (a-b)});
                            console.log(ordenado);
                            let valsig=ordenado[ordenado.length-1]+1;
                            if(orden.length==0){
                                valsig=1;
                            }

                            await setDoc(doc(db, "mensajes", (results2.length + 1).toString()), {
                                mensaje_id: (results2.length + 1).toString(),
                                conversacion_id: (results.length + 1).toString(),
                                mensajeTexto: mensaje,
                                tipoPersonaEmisor: "empleador",
                                mensaje_orden:valsig
                            });

                            let empleado = mapaDatos.empleadoDatos.empleado_id;
                            let empleador = mapaDatos.empleadorDatos.empleador_id;

                            let conversaciones = await Conversaciones(empleado, empleador);
                            let mensajesdeConversacion = await Mensajes((results.length + 1).toString())
                            let diccionarioEnviar = mapaDatos;
                            diccionarioEnviar.conversacion = conversaciones;
                            diccionarioEnviar.mensajesdeconversacion = mensajesdeConversacion;
                            console.log(diccionarioEnviar);


                            redireccionTotal("/mensajesdesdeempleador", diccionarioEnviar);
                        }
                        else {
                            console.log("entro a fuera mens 0");
                            let empleado = mapaDatos.empleadoDatos.empleado_id;
                            let empleador = mapaDatos.empleadorDatos.empleador_id;

                            let conversaciones = await Conversaciones(empleado, empleador);
                            let id_conversacion = conversaciones.datosDeConversacion[0].conversacion_id;
                            let mensajesTodos = await MensajesTodos()
                            console.log(mensajesTodos);
                            let orden=await getOrderMessages(id_conversacion)
                            console.log(orden);
                            let ordenado=orden.sort(function(a:any, b:any){return (a-b)});
                            console.log(ordenado);
                            let valsig=ordenado[ordenado.length-1]+1;

                            await setDoc(doc(db, "mensajes", (mensajesTodos.length + 1).toString()), {
                                mensaje_id: (mensajesTodos.length + 1).toString(),
                                conversacion_id: id_conversacion,
                                mensajeTexto: mensaje,
                                tipoPersonaEmisor: "empleador",
                                mensaje_orden:valsig
                            });

                            conversaciones = await Conversaciones(empleado, empleador);
                            let mensajesdeConversacion = await Mensajes((id_conversacion).toString())
                            let diccionarioEnviar = mapaDatos;
                            diccionarioEnviar.conversacion = conversaciones;
                            diccionarioEnviar.mensajesdeconversacion = mensajesdeConversacion;
                            console.log(diccionarioEnviar)

                            redireccionTotal("/mensajesdesdeempleador", diccionarioEnviar);

                        }

                    }
                
                }
                }>Enviar</IonButton>

            </IonRow>
            <IonRow style={{ flex: 1 }} >
                <IonButton onClick={() => {
                    console.log(mapaDatos)

                    redireccionTotal("/mensajesentrantes", mapaDatos);
                }}>
                    Regresar
                </IonButton>
                <IonButton onClick={async () => {
                    let empleado = mapaDatos.empleadoDatos.empleado_id;
                    let empleador = mapaDatos.empleadorDatos.empleador_id;
                    let empleadorDatos=await Empleador(empleador);
                    let empleadoDatos=await Empleado(empleado);
                    console.log(empleado);
                    console.log(empleador)
                    let conversaciones = await Conversaciones(empleado, empleador);
                    let idConversacion;
                    if (conversaciones.datosDeConversacion[0] == undefined) {
                        idConversacion = 1;
                    }
                    else {
                        idConversacion = conversaciones.datosDeConversacion[0].conversacion_id
                    }
                    let mensajesdeConversacion = await Mensajes(idConversacion)
                    let diccionarioEnviar=mapaDatos;
                    diccionarioEnviar.mensajesdeconversacion=mensajesdeConversacion;
                    console.log(diccionarioEnviar);
                    diccionarioEnviar['empleadorDatos']=empleadorDatos[0];
                    diccionarioEnviar['empleadoDatos']=empleadoDatos[0];
                    console.log(diccionarioEnviar);
            
                    redireccionTotal("/mensajesdesdeempleador", diccionarioEnviar);


                }}>
                    Recargar mensajes
                </IonButton>

            </IonRow>
        </IonPage >
    );
};


export default Messages;



