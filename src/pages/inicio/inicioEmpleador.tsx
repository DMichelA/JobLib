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
import { logoGoogle, personAdd } from "ionicons/icons";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebase from "../database/Firebase";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, query, where, QuerySnapshot, getDoc } from 'firebase/firestore/lite';

import { useHistory } from "react-router";
const InicioEmpleador: React.FC = () => {
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
                <IonCol style={{ flex: 1 }}>
                    <i ><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAclBMVEX///8AAADLy8sQEBDw8PA1NTX6+vpQUFBiYmIICAheXl4jIyPk5OTs7Oy9vb0wMDAWFhbU1NS1tbU6Ojp0dHT09PSioqKTk5NKSkonJycbGxuEhIRnZ2eKioo9PT1TU1PGxsagoKCvr694eHja2tpDQ0N7djjzAAACyUlEQVR4nO2b25KCMAyGKyetlDNFEUVEff9XXLUFdafOdCmEcTb/le5F820aahMSQlAo1KscllgTK2H8k/UgXWV+bE+s2M/2YaAwzw4RXQCJupvfCF7rQlmXCKn3tve5DWr/Jvv8EgvBGsz7T9FVvw3OGt78XXvpA+/c///Ur4+rSXWs/ae1g4iDNO7+cEwZ9yYWZ+myQ4jDRwDU8mvZfjwixhVvS2ly69y+niSPa8GYv8uKpM/bWwRexWcf0D4hjS9dwEkjIoAWkPYJ2Qi/xxbJBcrVgQUIMmF3Q+QRfIK1T8hB7gHZCVck0ACJ2PodEXtRMmgAJh5FSoQnIuAQuD198kmUAC48gIsACIAACIAAegDexTwdVWWCugBsvTNPR7NwMIA3TspSXoYCXHajAKjuW3oASfx50b9oMxQgGCdpp4og0AzCdow9oLki5dIE8KxqbapcmfLpH0TG6ah62a85CREAARAAARAAARAAARLzK9k+VV2KNAFSWVQ2ksGltKvoGsoefC2fPTGZPTXzjqPY9xWlcM0gvBxtaqwoVays+xg6VmiqRlmJ/5qDCAEQAAEQAAEQAAEQgDjMVIGyWKsJwKvIN1W5VrVnaN6Kz6N0uWWKW6EeABsjM7upHQowe2bEys+L/kF0sAe6hidDbRWvLnVf2bTbyFRZpcpMtM8BHphKvfT3nIQIgAAI8F8AZmxonL2lU5QibdC25rssMdGwI7IaDN7WWwm7S3IWH2plt9F06rpTNsSSrd3ALjj0rd28a25vIO03sgq+5IQU8tYVAcZh07X336vIXX//wi+gBhxO3W3/MeBAwn7E41pAjHgU137Eo3kAedXLkEu2XU6qbfYy5NKlC3y/mEXPd1nBfo5Bp/zl98ep4Ee9Dm8h76XjvKDTFa3D31WD4OTCjftlherkD8Kqhhh4rKvm4w8Pn3XkE4X6p/oBUCxUVpQhVWIAAAAASUVORK5CYII="></img></i>

                </IonCol>
                <IonCol style={{ backgroundColor: "#1538BF", flex: 22 }}>
                    <h1>Inicio</h1>
                </IonCol>
            </IonRow>

            <IonRow style={{ flex: 1 }}>
                <IonCol style={{ flex: 17 }} >
                    <IonButton onClick={function () {
                        redireccion("/anadirempleo", datosHistory);



                    }} >Añadir un nuevo empleo</IonButton>
                    <IonButton onClick={async function () {
                        let diccionarioEnviar=datosHistory;
                        diccionarioEnviar['datosTrabajos']=await trabajosPorEmpleador();
                        console.log(diccionarioEnviar);
                        redireccion("/inicioempleador",diccionarioEnviar);
                    }}>Recargar trabajos</IonButton>

                    <IonButton onClick={function () {
                        redireccionTotal("/perfilempleador", datosHistory);

                    }}>Perfil</IonButton>
                    <IonButton onClick={async function () {

                        let diccionarioEnviar={
                            datosUser:datosHistory['datosUser'],
                            datosTrabajos:datosHistory.datosTrabajos,
                            todo:datosHistory,
                            postulaciones: await postulacionesDeEmpleosDeEmpleador()
                        }
                        console.log(diccionarioEnviar);
                        
                        redireccionTotal("/postulaciones", diccionarioEnviar);

                        
                        
                        

                    }}>Postulaciones</IonButton>

                    <IonButton onClick={async ()=>{
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
                    <IonButton onClick={()=>{
                        redireccion("/","");

                    }}>
                        Cerrar sesión
                    </IonButton>

                </IonCol>

                <IonCol style={{ flex: 1 }}>
                    <i ><img src="https://e7.pngegg.com/pngimages/404/688/png-clipart-computer-icons-macintosh-electronic-filter-filter-drawing-icon-miscellaneous-angle.png"></img></i>
                </IonCol>

            </IonRow >
            <IonRow style={{ flex: 1, backgroundColor: "#1538BF" }} className="">
                <h1>Empleos publicados</h1>


            </IonRow>
            <IonRow id="todo" style={{ flex: 18 }}>
                <IonContent>
                {trabajosPublicados.length!=0?trabajosPublicados.map((trabajo: any) =>
                        <Card data={{ trabajo: trabajo, empleados: empleadosexistentes, empleador_id: idEmpleador,todo:datosHistory }} />

                ):<p>No hay Trabajos publicados</p>}
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
            <IonCardHeader>
                <IonCardSubtitle>Descripcion:<br></br>
                    {props.data.trabajo.trabajo_descripcion}</IonCardSubtitle>
                <IonCardSubtitle>Funciones:<br></br>
                    {props.data.trabajo.trabajo_funciones}</IonCardSubtitle>
            </IonCardHeader>
        </IonRow>
        
    </IonCard>

}



export default InicioEmpleador;



