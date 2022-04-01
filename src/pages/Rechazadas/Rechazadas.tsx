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
    IonMenu,IonList,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonRouterOutlet


} from "@ionic/react";
import React, { useState } from "react";
import { logoGoogle, personAdd } from "ionicons/icons";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebase from "../database/Firebase";
import { getFirestore, doc,updateDoc ,query,where,collection,getDocs} from 'firebase/firestore/lite';

import { useHistory } from "react-router";

const Postulaciones: React.FC = () => {
    function onDeviceReady() {
        document.addEventListener("backbutton", function (e) {
          e.preventDefault();
          console.log("hello");
        }, false);
      }
      
    document.onload = function () {
    document.addEventListener("deviceready", onDeviceReady, false);
    };
    //BLOQUEAR TECLA RETROCESO EN EL NAVEGADOR
    window.location.hash="no-back-button";
    window.location.hash="Again-No-back-button";//esta linea es necesaria para chrome
    window.onhashchange=function(){window.location.hash="no-back-button";}
    console.log(firebase);
    var history = useHistory();
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);
    var history = useHistory();
    let data = history.location.state;
    let decodifyDatas=Object(JSON.parse(JSON.stringify(data))['detail']);
    console.log(decodifyDatas);
    let datosUser=decodifyDatas["datosUser"];
    let postulacion=decodifyDatas["postulaciones"];
    let db=getFirestore();
    let idEmpleador=datosUser.idtipopersona;
    function redireccion(ruta: any, datos: any) {
        let data = datos;

        history.push({
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
            let usuario=await traerEmpleadosPorId(data[i].empleado_id);
            let trab=await traerTrabajoPorId(data[i].trabajo_id);
            trabajoyaplicante.push([trab,usuario,data[i]])
        }

        console.log(trabajoyaplicante);


        return trabajoyaplicante;

    }
    async function postulacionesRechazadasDeEmpleosDeEmpleador(){
        let q=query(collection(db,"contrato"),where("empleador_id","==",idEmpleador),where("status","==","RECHAZADA"));
        let qs=await getDocs(q);
        let data=qs.docs.map(doc=>doc.data());
        console.log(data);
        let trabajoyaplicante=[]
        //ordenes aplicada
        for(let i=0;i<data.length;i++){
            let usuario=await traerEmpleadosPorId(data[i].empleado_id);
            let trab=await traerTrabajoPorId(data[i].trabajo_id);
            trabajoyaplicante.push([trab,usuario,data[i]])
        }

        console.log(trabajoyaplicante);


        return trabajoyaplicante;

    }


    return (
        <IonPage>
            <IonRow style={{flex:1}} className="ion-text-center ion-justify-content-center">
                <IonCol style={{ backgroundColor: "#1538BF" ,flex:2}}>
                    <IonButton>
                        menu
                    </IonButton>
                    
                    
                </IonCol>
                <IonCol style={{ backgroundColor: "#1538BF" ,flex:18}}>
                    <h1>Trabajos Aplicados</h1>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonButton onClick={async ()=>{
                    let postulantes=await postulacionesRechazadasDeEmpleosDeEmpleador();
                    console.log(postulantes)
                    let diccionarioEnviar=decodifyDatas;
                    diccionarioEnviar.postulaciones=postulantes;
                    console.log(diccionarioEnviar)
                    redireccion("/rechazadas",diccionarioEnviar);
                }}>Recargar Postulantes Rechazados</IonButton>
            </IonRow>
            
            <IonRow style={{flex:18}}>
                <IonContent >
                {postulacion.length!=0?postulacion.map((trabajo:any) => 
                        <Card  data={trabajo} />
                        
                    ):<p>No hay trabajos aplicados</p>}
                   
                
                    

                </IonContent>
            </IonRow>
            
            <IonRow style={{ backgroundColor: "red", alignContent: "flex-end" }}>
                    <IonButton onClick={async () => {
                        let postulantes=await postulacionesDeEmpleosDeEmpleador();
                        let diccionarioEnviar=decodifyDatas;
                        diccionarioEnviar.postulaciones=postulantes;
                        console.log(diccionarioEnviar)
                        redireccion("/postulaciones",diccionarioEnviar);
                        /*
                        let diccionarioEnviar = {
                            datosTrabajos: trabajostodos,
                            datosUser: { tipopersona: "empleado", idtipopersona: decodifyData['empleado_id'] },
                            empleadores: empleadoresexistentes
                        }

                        console.log(diccionarioEnviar);

                        redireccion("/inicioempleado", diccionarioEnviar);
                        window.location.reload();
*/

                    }} style={{ float: "right" }} >Regresar</IonButton>
            </IonRow>
        </IonPage>





    );
};


const Card = (props:any) => {
    let db=getFirestore();
    var history = useHistory();
    function redireccionTotal(ruta: any, datos: any) {
        let data =datos;

        history.push({
            pathname: ruta,
            state: { detail: data }
        })
    }
    console.log(props.data)
    let postulacionesDatos=props.data;
    let status=postulacionesDatos[2].status;
    
    return <IonCard id={props.data.trabajo_id} >
        <IonRow style={{ justifyContent: "center" }}>
            <IonCardHeader>
                <IonCardTitle>{postulacionesDatos[0].trabajo_titulo}</IonCardTitle>
            </IonCardHeader>
        </IonRow>
        <IonRow style={{ justifyContent: "center" }}>
            <img src="https://i.blogs.es/e1feab/google-fotos/450_1000.jpg" />
        </IonRow>
        <IonRow style={{ justifyContent: "center" }}>
            <IonCardHeader>
                <IonCardSubtitle>Descripcion:<br></br>
                    {postulacionesDatos[0].trabajo_descripcion}</IonCardSubtitle>
                <IonCardSubtitle>Funciones:<br></br>
                    {postulacionesDatos[0].trabajo_funciones}</IonCardSubtitle>
            </IonCardHeader>
        </IonRow>
        <IonRow>
            Datos del Interesado<br/>
            Nombre:{postulacionesDatos[1].empleado_nombre}<br/>
            Apellido Paterno:{postulacionesDatos[1].empleado_apellidoPaterno}<br/>
            Apellido Materno:{postulacionesDatos[1].empleado_apellidoMaterno}<br/>
            Fecha de nacimiento:{postulacionesDatos[1].empleado_fechaNac}<br/>
            Sueldo Deseado:{postulacionesDatos[1].empleado_sueldoDeseado}<br/>
            Numero de telefono:{postulacionesDatos[1].empleado_numcel}<br/>
        </IonRow>
        <IonRow>
            status:{status}
        </IonRow>
        <IonRow>
            <IonButton onClick={async ()=>{
                const update = doc(db, "contrato", postulacionesDatos[2].contrato_id);
                await updateDoc(update, {
                    status:"ACEPTADA"
                });
                alert("Ahora se ha aceptado al postulante "+postulacionesDatos[1].empleado_nombre+" "+ postulacionesDatos[1].empleado_apellidoPaterno+" en el empleo publicado "+postulacionesDatos[0].trabajo_titulo)

            }}>
                ACEPTAR
            </IonButton>

        </IonRow>
    </IonCard>



     

}

export default Postulaciones;



