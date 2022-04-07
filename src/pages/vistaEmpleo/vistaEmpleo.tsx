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
import { arrowBackCircle, checkmark } from "ionicons/icons";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebase from "../database/Firebase";
import { getFirestore, collection, getDocs, orderBy, doc, setDoc, query, where, updateDoc } from 'firebase/firestore/lite';

import { useHistory } from "react-router";
import { error } from "console";

const VistaEmpleo: React.FC = () => {
    console.log(firebase);
    let db = getFirestore();
    var history = useHistory();
    let data = history.location.state;
    let decodifyDatas = Object(JSON.parse(JSON.stringify(data))['detail']);
    console.log(decodifyDatas);
    aplicado()
    if (console.error.length != 0) {
        window.location.reload()
    }
    async function trabajosTodos() {
        let col = collection(db, 'trabajo');
        let datos = getDocs(col);
        let values;
        let qall = await datos.then(res => {
            values = res.docs.map(doc => doc.data())
            return values;
        });
        return qall;
    }
    async function empleadoresexistentes() {
        let col = collection(db, "empleador");
        let datos = await getDocs(col);
        let datoss = datos.docs.map(doc => doc.data())
        return datoss;

    }
    function redireccion(ruta: any, datos: any) {
        let data = datos;

        history.push({
            pathname: ruta,
            state: { detail: data }
        })
    }

    async function getContratos() {
        let col = collection(db, "contrato");
        let docs = await getDocs(col);
        let qs = docs.docs.map(doc => doc.data())
        return qs;
    }

    async function aplicado() {
        let col = collection(db, "contrato");
        let q = query(col, where("empleado_id", "==", decodifyDatas['empleado_id']), where("trabajo_id", "==", decodifyDatas['trabajo']['trabajo_id']));
        let querySnapshot = await getDocs(q);
        let qs = querySnapshot.docs.map(doc => doc.data())
        
        console.log(qs[0]);
        
        if(document.getElementById("aplicar")!=undefined){
            if (qs[0]['status'] == "PENDIENTE") {
                (document.getElementById("aplicar")as HTMLInputElement)!.innerText = "NO ESTOY INTERESADO YA";
            }
            else if (qs[0]['status'] == "CANCELADA") {
                (document.getElementById("aplicar")as HTMLInputElement)!.innerText = "ESTOY INTERESADO";
    
            }
            else if (qs[0]['status'] == "RECHAZADA") {
                (document.getElementById("aplicar")as HTMLInputElement)!.innerText = "ESTOY INTERESADO";
            }
        }
        else{
            window.location.reload();
        }
            
        
       
    }



    return (
        <IonPage>
            <IonRow className="ion-text-center ion-justify-content-center">
                <IonCol style={{ backgroundColor: "#4a90e2", flex: 1, color: "white" }}>
                    <IonRow style={{ flex: 1 }}>
                        <IonCol style={{ flex: 10 }}>
                            <h1>Vista Empleo</h1>

                        </IonCol>
                    </IonRow>
                </IonCol>
            </IonRow>

            <IonContent >
                <Card data={decodifyDatas} />
                <IonRow className="ion-justify-content-center">
                    <IonButton color="success" id="aplicar" onClick={async () => {
                        if (document.getElementById("aplicar")?.innerText == "ESTOY INTERESADO") {
                            document.getElementById("aplicar")!.innerText = "NO ESTOY INTERESADO YA"
                        }
                        else {
                            document.getElementById("aplicar")!.innerText = "ESTOY INTERESADO"
                        }


                        if (document.getElementById("aplicar")?.innerText == "ESTOY INTERESADO") {
                            let todoContratos = await getContratos();
                            console.log(todoContratos);
                            for (let i = 0; i < todoContratos.length; i++) {
                                console.log(todoContratos[i])
                                if (todoContratos[i]['empleado_id'] == decodifyDatas['empleado_id'] && todoContratos[i]['trabajo_id'] == decodifyDatas['trabajo']['trabajo_id']) {
                                    const update = doc(db, "contrato", todoContratos[i]['contrato_id']);
                                    await updateDoc(update, {
                                        status: 'CANCELADA'
                                    });
                                }
                                
                            }
                            
                        }
                        else {
                            let todoContratos = await getContratos();
                            console.log(todoContratos);
                            let insercion = 0;
                            for (let i = 0; i < todoContratos.length; i++) {
                                console.log(todoContratos[i])
                                if (todoContratos[i]['empleado_id'] == decodifyDatas['empleado_id'] && todoContratos[i]['trabajo_id'] == decodifyDatas['trabajo']['trabajo_id']) {
                                    const update = doc(db, "contrato", todoContratos[i]['contrato_id']);
                                    await updateDoc(update, {
                                        status: 'PENDIENTE'
                                    });
                                    insercion++;
                                }
                                
                            }
                            if (insercion == 0) {
                                await setDoc(doc(db, "contrato", (todoContratos.length + 1).toString()), {
                                    contrato_id: (todoContratos.length + 1).toString(),
                                    empleado_id: decodifyDatas['empleado_id'],
                                    empleador_id: decodifyDatas['trabajo']['empleador_id'],
                                    trabajo_id: decodifyDatas['trabajo']['trabajo_id'],
                                    status: 'PENDIENTE'
                                });
                            }


                        }
                        window.location.reload();
                    }}className="ion-margin-top"><IonIcon icon={checkmark}/> Estoy Interesado</IonButton>
                </IonRow>

            </IonContent>
            <IonButton onClick={async () => {
                    
                    let datosTrabajo = trabajosTodos();
                    let empleadores = await empleadoresexistentes();
                    console.log(empleadores)
                    datosTrabajo.then(res => {
                        let diccionarioEnviar = {
                            datosTrabajos: res,
                            datosUser: { tipopersona: "empleado", idtipopersona: decodifyDatas['empleado_id'] },
                            empleadores: empleadores,
                            empleado_id:decodifyDatas.empleado_id,
                            trabajo:decodifyDatas.trabajo
                        }
                        console.log(decodifyDatas);
                        console.log(diccionarioEnviar);

                        redireccion("/inicioempleado", diccionarioEnviar);
                        
                    })


                }}><IonIcon icon={arrowBackCircle}/>Regresar</IonButton>
        </IonPage>





    );
};



const Card = (props: any) => {
    var history = useHistory();
    let db=getFirestore();
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
    console.log(props.data)

    async function Mensajes(conversacionid:any){
        let q=query(collection(db,"mensajes"),where("conversacion_id","==",conversacionid));
        let qs=await getDocs(q);
        let result=qs.docs.map(doc=>doc.data());
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

    let empleadoress = props.data.empleadores;
    console.log(empleadoress);
    for (let i = 0; i < empleadoress.length; i++) {
        if(empleadoress[i]["empleador_id"]!=undefined){
            if(props.data.trabajo!=undefined){
                if (empleadoress[i]["empleador_id"] == props.data.trabajo.empleador_id) {
                    empleadoress = empleadoress[i]
                }
            }
            else{
                window.location.reload();
            }
            
        }
        else{
            
        }
        
    }
    
    return <IonCard id={props.data.trabajo.trabajo_id} onClick={function () {
        console.log(props.data);

    }}>
   
        <IonCardHeader className="ion-text-center">
            <IonCardTitle>{props.data.trabajo.trabajo_titulo}</IonCardTitle>
        </IonCardHeader>
        <IonRow style={{ justifyContent: "center" }}>
            <img src="https://i.blogs.es/e1feab/google-fotos/450_1000.jpg" />
        </IonRow>
        <IonCardContent>
            <b>Descripcion:</b> {props.data.trabajo.trabajo_descripcion}<br></br>
            <b>Funciones:</b> {props.data.trabajo.trabajo_funciones}<br></br>
            <b>Horario<br></br></b>
            Entrada: {props.data.trabajo.trabajo_horaInicio}:00 Salida: {props.data.trabajo.trabajo_horaFin}:00<br></br>
            <b>Requisitos</b><br />
            <b>Experiencia:</b> {props.data.trabajo.trabajo_experiencia}<br />
            <b>Escolaridad:</b> {props.data.trabajo.trabajo_escolaridad}<br />
            <b>Edad:</b> {props.data.trabajo.trabajo_edad} <br />
            <b>Prestaciones:</b> {props.data.trabajo.trabajo_prestaciones} <br />
        </IonCardContent>
        <IonCardHeader>
            <IonCardTitle> Datos de Contacto</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
            <b>Nombre Completo:</b> {empleadoress.empleador_nombre} {empleadoress.empleador_apellidoPaterno} {empleadoress.empleador_apellidoMaterno} <br />
            <b>Numero de Celular:</b> {empleadoress.empleador_numcel}
            <IonRow className="ion-justify-content-center">
                <IonButton className="ion-margin-top" color="secondary" onClick={
                    async ()=>{
                        let empleado=props.data.empleado_id;
                        let empleador=props.data.trabajo.empleador_id;
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
                            empleado_id:props.data.empleado_id,
                            empleadores:props.data.empleadores,
                            trabajo:props.data.trabajo,
                            conversacion:conversaciones,
                            mensajesdeconversacion:mensajesdeConversacion,
                            empleado:empleado,
                            empleador:empleador
                        }
                        console.log(diccionarioEnviar);
                        redireccionTotal("/mensajes",diccionarioEnviar);

                        

                    }
                }>Contactar por mensaje</IonButton>
            </IonRow>
        </IonCardContent>

    </IonCard>

}

export default VistaEmpleo;



