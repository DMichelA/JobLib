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
import { getFirestore, collection, getDocs, addDoc, doc, setDoc,query,where } from 'firebase/firestore/lite';

import { useHistory } from "react-router";

const InicioEmpleado: React.FC = () => {
    console.log(firebase);
    var history = useHistory();
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);
    let data = history.location.state;
    let decodifyData=Object(JSON.parse(JSON.stringify(data))['detail'])
    const db=getFirestore();
    console.log(decodifyData);



    let datosUser=TraerDatosDeUsuario(decodifyData["tipopersona"],decodifyData["idtipopersona"]);
    let contador=0;
    window.onload=function(){
        datosUser.then((res:any)=>{
            console.log(res);
            traerTrabajosEmpleado();
      
        });
    }
    async function traerTrabajosEmpleado(){
        let col=collection(db,'trabajo');
        let datos=await getDocs(col);
        let qall=datos.docs.map(doc=>doc.data());
        console.log(qall)
        for(let i=0;i<qall.length;i++){
            if(contador<qall.length){
                insertarCard(qall[i]['trabajo_titulo'],qall[i]['trabajo_descripcion'],qall[i]['trabajo_funciones'],qall[i]['trabajo_horaInicio'],
                qall[i]['trabajo_horaFin'],qall[i]['trabajo_prestaciones'],qall[i]['trabajo_sueldo'],qall[i]['trabajo_ubicacion'],qall[i]['empleador_id']);
            } 
        }
    }


    function insertarCard(titulo:any,descripcion:any,funciones:any,horai:any,horaf:any,prestaciones:any,sueldo:any,ubicacion:any,creadorid:any){
        let cadena= `
        <style>
        .card {
            /* Add shadows to create the "card" effect */
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            transition: 0.3s;
          }
          
          /* On mouse-over, add a deeper shadow */
          .card:hover {
            box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
          }
          
          /* Add some padding inside the card container */
          .container {
            padding: 2px 16px;
          }
        </style>
        <div class="card">
        <img width="100" height="100" src="https://concepto.de/wp-content/uploads/2015/03/paisaje-800x409.jpg" alt="Avatar" style="width:100%">
        <div class="container">
          <h2><b>${titulo}</b></h2>
          <h3><b>${descripcion}</b></h3>
          <h4><b>Funciones:${funciones}</b></h4>
          <h4><b>Desde las:${horai}</b></h4>
          <h4><b>Hasta las:${horaf}</b></h4>
          <h4><b>Prestaciones:${prestaciones}</b></h4>
          <h4><b>Sueldo:${sueldo}</b></h4>
          <h4><b>Ubicacion del trabajo:${ubicacion}</b></h4>
          <h4><b>creadorid:${creadorid}</b></h4>
        </div>
      </div>`;
        document.getElementById("todo")?.insertAdjacentHTML("beforeend", cadena);
    }

    async function TraerDatosDeUsuario(tipoUser:any,idUser:any){
        let db=getFirestore();
        let qs;
        if(tipoUser=="empleado"){
            let col=collection(db,"empleado");
            let q=query(col,where("empleado_id","==",idUser))
            qs= await getDocs(q);
        }
        else{
            let col=collection(db,"empleador");
            let q=query(col,where("empleador_id","==",idUser))
            qs=await getDocs(q);// qs query snapshot
        }
        
        let qsr=qs.docs.map(doc => doc.data());
        console.log(qsr[0]);
        return qsr[0];//qsr querysnapshotresult
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
            <IonRow style={{flex:1,backgroundColor:"#1538BF"}} className="">
                <h1>Empleos publicados</h1>

                
            </IonRow>
            <IonRow id="todo"  style={{flex:18}}>
                
       
            </IonRow>
           

        </IonPage>





    );
};
/*
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
*/

export default InicioEmpleado;



