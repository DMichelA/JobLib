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
    IonVirtualScroll


} from "@ionic/react";
import React, { useState } from "react";
import { logOut } from "ionicons/icons";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebase from "../database/Firebase";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, query, where, QuerySnapshot, getDoc } from 'firebase/firestore/lite';

import { useHistory } from "react-router";
import { Plugins } from '@capacitor/core';
const { App } = Plugins;
const InicioEmpleador: React.FC = () => {
    document.addEventListener('ionBackButton', ( ev:any) => {
        ev.detail.register(10, () => {
            window.location.reload();
        });
      });
    console.log(firebase);
    var History = useHistory();
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);
    let data = History.location.state;
    console.log(data);
    let datosHistory = Object(JSON.parse(JSON.stringify(data))['detail'])//CENTRO DE DATOS
    console.log(datosHistory);
    let trabajosPublicados=datosHistory['datosTrabajos'];
   
    if(datosHistory['datosUser']==undefined){
        window.location.reload();
    }
    let idEmpleador=datosHistory['datosUser']['idtipopersona'];
    
    let empleadosexistentes=datosHistory['empleados'];
    console.log(trabajosPublicados);
    console.log(idEmpleador);
    console.log(empleadosexistentes);
    const db = getFirestore();

    
    async function trabajosPorEmpleador(){
        let q=query(collection(db,"trabajo"),where("empleador_id","==",idEmpleador));
        let qs= await getDocs(q);
        let data=qs.docs.map(doc=>doc.data());
        console.log(data);
        return data;
    }
    

    function redireccion(ruta: any, datos: any) {
        let data = datos

        History.push({
            pathname: ruta,
            state: { detail: data }
        })
    }

    function redireccionTotal(ruta: any, datos: any) {
        let data = datos;

        History.push({
            pathname: ruta,
            state: { detail: data }
        })
    }
    

    async function traerEmpleadosPorId(ID:any){
        let q=query(collection(db,"empleado"),where("empleado_id","==",ID));
        let qs=await getDocs(q);
        let data=qs.docs.map(doc=>doc.data());
        return data[0];
    }

    async function traerTrabajoPorId(ID:any){
        let q=query(collection(db,"trabajo"),where("trabajo_id","==",ID));
        let qs=await getDocs(q);
        let data=qs.docs.map(doc=>doc.data());
        return data[0];
    }

    async function postulacionesDeEmpleosDeEmpleador(){
        let q=query(collection(db,"contrato"),where("empleador_id","==",idEmpleador),where("status","==","PENDIENTE"));
        let qs=await getDocs(q);
        let data=qs.docs.map(doc=>doc.data());
        console.log(data);
        let trabajoyaplicante=[]
        //ordenes aplicada
        for(let i=0;i<data.length;i++){
            console.log(data[i].empleado_id)
            console.log(data[i].contrato_id);
            let usuario=await traerEmpleadosPorId(data[i].empleado_id);
            let trab=await traerTrabajoPorId(data[i].trabajo_id);
            let idContrato=data[i].contrato_id;
            trabajoyaplicante.push([trab,usuario,data[i]])
        }

        console.log(trabajoyaplicante);


        return trabajoyaplicante;

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
                <IonCol style={{ backgroundColor: "#4a90e2", flex: 22, color: "white" }}>
                    <h1>Inicio</h1>
                </IonCol>
            </IonRow>

            <IonRow style={{ flex: 1 }}>
                <IonCol style={{ flex: 17 }} >
                    <IonButton color="warning" onClick={async function () {
                                let diccionarioEnviar=datosHistory;
                                diccionarioEnviar['datosTrabajos']=await trabajosPorEmpleador();
                                console.log(diccionarioEnviar);
                                redireccion("/inicioempleador",diccionarioEnviar);
                            }}>Recargar trabajos</IonButton>

                    <IonRow>


                        <IonButton color="success" onClick={function () {
                            redireccion("/anadirempleo", datosHistory);
                        }} >Añadir un nuevo empleo</IonButton>
                    </IonRow>


                    <IonButton color="light" onClick={async ()=>{
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
                        redireccionTotal("/mensajesentrantes",diccionarioEnviar);

           
                        



                    }}>Mensajes Recibidos</IonButton>

                    <IonButton color="secondary" onClick={async function () {

                        let diccionarioEnviar={
                            datosUser:datosHistory['datosUser'],
                            datosTrabajos:datosHistory.datosTrabajos,
                            todo:datosHistory,
                            postulaciones: await postulacionesDeEmpleosDeEmpleador()
                        }
                        console.log(diccionarioEnviar);
                        
                        redireccionTotal("/postulaciones", diccionarioEnviar);

                        
                        
                        

                    }}>Postulaciones</IonButton>

  
                    <IonRow>
                        <IonButton onClick={function () {
                            redireccionTotal("/perfilempleador", datosHistory);

                        }}>Perfil</IonButton>
                    </IonRow>
                    <IonRow>
                        <IonButton color="danger" onClick={()=>{
                            window.location.href= "/";

                        }}><IonIcon icon={logOut}/>
                            Cerrar sesión
                        </IonButton>
                    </IonRow>
                </IonCol>


            </IonRow >
            <IonRow style={{ flex: 1, backgroundColor: "#4a90e2", color: "white" }} className="">
                <h1>Empleos publicados</h1>


            </IonRow>
            <IonRow id="todo" style={{ flex: 18 }}>
                <IonContent>
                {trabajosPublicados.length!=0?trabajosPublicados.map((trabajo: any) =>
                        <Card data={{ trabajo: trabajo, empleados: empleadosexistentes, empleador_id: idEmpleador,todo:datosHistory }} />

                ):<p style={{ color: "red", fontSize: 20 }}>No hay Trabajos publicados</p>}
                </IonContent>
            </IonRow>


        </IonPage>





    );
};

const Card = (props: any) => {
    var history = useHistory();
    function redireccionTotal(ruta: any, datos: any) {
        let data = datos;

        history.push({
            pathname: ruta,
            state: { detail: data }
        })
    }
    console.log(props.data)
    

    return <IonCard id={props.data.trabajo_id} onClick={async function () {

        redireccionTotal("/modificarempleo", {todo:props.data.todo,datosTrabajo:props.data.trabajo})
        window.location.reload();
        console.log(props.data);


    }}>
        <IonRow style={{ justifyContent: "center" }}>
            <IonCardHeader>
                <IonCardTitle>{props.data.trabajo.trabajo_titulo}</IonCardTitle>
            </IonCardHeader>
        </IonRow>
        <IonRow style={{ justifyContent: "center" }}>
            <img src="https://i.blogs.es/e1feab/google-fotos/450_1000.jpg" />
        </IonRow>
        <IonRow style={{ justifyContent: "center" }}>
            <IonCardContent>
                <b>Descripcion:</b> {props.data.trabajo.trabajo_descripcion} <br></br>
                    
                <b>Funciones:</b> {props.data.trabajo.trabajo_funciones} <br></br>

            </IonCardContent>
        </IonRow>
        
    </IonCard>

}



export default InicioEmpleador;



