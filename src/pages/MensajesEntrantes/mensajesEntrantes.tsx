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
    IonCardTitle,
    IonMenu, IonList,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonRouterOutlet


} from "@ionic/react";
import React, { useState } from "react";
import { logoGoogle, personAdd } from "ionicons/icons";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebase from "../database/Firebase";
import { getFirestore, doc, updateDoc, query, where, collection, getDocs } from 'firebase/firestore/lite';

import { useHistory } from "react-router";

const MensajesEntrantes: React.FC = () => {
    
    console.log(firebase);
    var history = useHistory();
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);
    var history = useHistory();
    let data = history.location.state;
    let decodifyDatas = Object(JSON.parse(JSON.stringify(data))['detail']);
    console.log(decodifyDatas);
    let datosUser = decodifyDatas["datosUser"];
    let db = getFirestore();
    let idEmpleador = datosUser.idtipopersona;
    let trabajosPublicados=decodifyDatas.datosTrabajos;
    let empleadosexistentes=decodifyDatas.empleados;
    let conversaciones = decodifyDatas.conversacion.datosDeConversacion;
    console.log(conversaciones)
    function redireccion(ruta: any, datos: any) {
        let data = datos;

        history.push({
            pathname: ruta,
            state: { detail: data }
        })
    }


    async function traerEmpleadosPorId(ID: any) {
        let q = query(collection(db, "empleado"), where("empleado_id", "==", ID));
        let qs = await getDocs(q);
        let data = qs.docs.map(doc => doc.data());
        return data[0];
    }

    async function traerTrabajoPorId(ID: any) {
        let q = query(collection(db, "trabajo"), where("trabajo_id", "==", ID));
        let qs = await getDocs(q);
        let data = qs.docs.map(doc => doc.data());
        return data[0];
    }

    async function conversacionesDeEmpleador(ID:any){
        let q=query(collection(db,"conversaciones"),where("empleador_id","==",ID.toString()))
        let qs= await getDocs(q);
        let result= qs.docs.map(doc=>doc.data());

        for(let i=0;i<result.length;i++){
            let mensajes= await mensajesPorIdConversacion(result[i].conversacion_id);
            console.log(mensajes);
        }
        return result;
    }

    async function mensajesPorIdConversacion(ID:any){
        let q=query(collection(db,"mensajes"),where("conversacion_id","==",ID.toString()))
        let qs= await getDocs(q);
        let result= qs.docs.map(doc=>doc.data());
        return result
        
    }




    return (
        <IonPage>
            <IonRow style={{ flex: 1 }} className="ion-text-center ion-justify-content-center">
                <IonCol style={{ backgroundColor: "#1538BF", flex: 2 }}>
                    <IonButton>
                        menu
                    </IonButton>


                </IonCol>
                <IonCol style={{ backgroundColor: "#1538BF", flex: 18 }}>
                    <h1>Trabajos Aplicados</h1>
                </IonCol>
            </IonRow>


            <IonRow style={{ flex: 18 }}>
                <IonContent >
                    {conversaciones.length != 0 ? conversaciones.map((conversacion: any) =>
                        <Card data={conversacion} todo={decodifyDatas} />
                    ) : <p>No hay Nuevas Conversaciones</p>}




                </IonContent>
            </IonRow>
            <IonRow>
                <IonButton onClick={
                    async ()=>{
                        let conversaciones=await conversacionesDeEmpleador(idEmpleador);
                        console.log(conversaciones);
                        let arregloMensajes=[];
                        for(let i=0;i<conversaciones.length;i++){
                            let mensajesdeConversacion=await mensajesPorIdConversacion(conversaciones[i].conversacion_id);
                            arregloMensajes.push(mensajesdeConversacion);
                        }
                        let diccionarioEnviar={
                            conversacion:{
                                datosDeConversacion:conversaciones
                            },
                            mensajesdeconversacion:arregloMensajes,
                            datosTrabajos:trabajosPublicados,
                            datosUser:{
                                idtipopersona:idEmpleador,
                                tipopersona:'empleador'
                            },
                            empleados:empleadosexistentes

                        }
                        console.log(diccionarioEnviar);
                        redireccion("/inicioempleador",diccionarioEnviar);

                    }
                }>Regresar</IonButton>
            </IonRow>

        </IonPage>





    );
};


const Card = (props: any) => {
    let db = getFirestore();
    var history = useHistory();
    function redireccionTotal(ruta: any, datos: any) {
        let data = datos;

        history.push({
            pathname: ruta,
            state: { detail: data }
        })
    }
    console.log(props.data)
    console.log(props.todo)

    let mensajesTodosParaEsteEmpleador = props.todo.mensajesdeconversacion;
    let mensajesDeEstaConversacion = [];
    for (let i = 0; i < mensajesTodosParaEsteEmpleador.length; i++) {
        for (let a = 0; a < mensajesTodosParaEsteEmpleador[i].length; a++) {
            if (props.todo.mensajesdeconversacion[i][a].conversacion_id == props.data.conversacion_id) {
                mensajesDeEstaConversacion.push(props.todo.mensajesdeconversacion[i]);
                break;
            }
        }
    }
    let datosdeempleado:any;
    for (let i = 0; i < props.todo.empleados.length; i++) {
        if (props.data.empleado_id == props.todo.empleados[i].empleado_id) {
            datosdeempleado = props.todo.empleados[i];
            break;
        }
    }

    console.log(datosdeempleado);
    async function Conversaciones(empleadoid:any,empleadorid:any){
        let q=query(collection(db,"conversaciones"),where("empleado_id","==",empleadoid),where("empleador_id","==",empleadorid));
        let qs=await getDocs(q);
        let result=qs.docs.map(doc=>doc.data());
        console.log(result);
        let idNuevaConversacion;
        if(result.length==0){
            idNuevaConversacion=1;
        }
        else{
            idNuevaConversacion=result.length+1;
        }


        return {idPosibleNuevaConversacion:idNuevaConversacion,datosDeConversacion:result};

    }
    async function Mensajes(conversacionid:any){
        let q=query(collection(db,"mensajes"),where("conversacion_id","==",conversacionid));
        let qs=await getDocs(q);
        let result=qs.docs.map(doc=>doc.data());
        console.log(result);
        return result;

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

    console.log(mensajesDeEstaConversacion);

    
   

    console.log(mensajesDeEstaConversacion);
    return <IonCard onClick={async () => {

        
        let empleado = props.data.empleado_id;
        let empleador = props.data.empleador_id;
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
        let diccionarioEnviar=props.todo;
        diccionarioEnviar.mensajesdeconversacion=mensajesdeConversacion;
        console.log(diccionarioEnviar);
        diccionarioEnviar['empleadorDatos']=empleadorDatos[0];
        diccionarioEnviar['empleadoDatos']=empleadoDatos[0];
        console.log(diccionarioEnviar);
        
        
        redireccionTotal("/mensajesdesdeempleador", diccionarioEnviar);


    }} id={props.data.conversacion_id} >
        <IonRow>

            <IonRow >
                <IonCardHeader>
                    <IonCardSubtitle>{datosdeempleado.empleado_nombre} {datosdeempleado.empleado_apellidoPaterno} {datosdeempleado.empleado_apellidoMaterno}</IonCardSubtitle><br />
                    <IonCardSubtitle> Mensaje: {mensajesDeEstaConversacion.length!=0?mensajesDeEstaConversacion[0][mensajesDeEstaConversacion[0].length - 1].mensajeTexto:<p>No hay registros</p>}</IonCardSubtitle>
                </IonCardHeader>
            </IonRow>


        </IonRow>

    </IonCard>





}


export default MensajesEntrantes;



