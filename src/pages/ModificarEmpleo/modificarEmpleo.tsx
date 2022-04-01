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
import { getFirestore, collection, getDocs, doc,query,where,updateDoc} from 'firebase/firestore/lite';
import { useIonAlert } from '@ionic/react';
import { useHistory } from "react-router";

const ModificarEmpleo: React.FC = () => {
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
    const db = getFirestore();
    console.log(user);
    let data = history.location.state;
    let decodifyData = Object(JSON.parse(JSON.stringify(data))['detail'])
    console.log(decodifyData);
    let datosEmpleo = decodifyData['datosTrabajo'];

    
    async function modificarEmpleo(tituloEmpleo: any, descripcion: any, ubicacion: any, sueldo: any, edad: any, escolaridad: any, experiencia: any, funciones: any, horarioinicio: any, horariofin: any, prestaciones: any) {
        await updateDoc(doc(db, "trabajo", datosEmpleo['trabajo_id']), {
            trabajo_titulo: tituloEmpleo,
            trabajo_descripcion: descripcion,
            trabajo_ubicacion: ubicacion,
            trabajo_sueldo: sueldo,
            trabajo_edad: edad,
            trabajo_escolaridad: escolaridad,
            trabajo_experiencia: experiencia,
            trabajo_funciones: funciones,
            trabajo_horaInicio: horarioinicio,
            trabajo_horaFin: horariofin,
            trabajo_prestaciones: prestaciones,
        });

        window.location.reload();


    }
    llenarDatos();

    async function trabajosPorIdUser(){
        let q=query(collection(db,"trabajo"),where("trabajo_id","==",datosEmpleo['trabajo_id']));
        let qs= await getDocs(q);
        let data=qs.docs.map(doc=>doc.data());
        console.log(data);
        return data[0];
    }

    async function trabajosPorEmpleador(){
        let q=query(collection(db,"trabajo"),where("empleador_id","==",datosEmpleo['empleador_id']));
        let qs= await getDocs(q);
        let data=qs.docs.map(doc=>doc.data());
        console.log(data);
        return data;
    }

    

    async function llenarDatos() {
        let datosllenado= await trabajosPorIdUser();
        
        (document.getElementById("tituloEmpleo") as HTMLInputElement)!.value=datosllenado['trabajo_titulo'];
        (document.getElementById("descripcion") as HTMLInputElement)!.value=datosllenado['trabajo_descripcion'];
        (document.getElementById("ubicacion") as HTMLInputElement)!.value=datosllenado['trabajo_ubicacion'];
        (document.getElementById("sueldo") as HTMLInputElement)!.value=datosllenado['trabajo_sueldo'];
        (document.getElementById("edadLaborador") as HTMLInputElement)!.value=datosllenado['trabajo_edad'];
        (document.getElementById("experiencia") as HTMLInputElement)!.value=datosllenado['trabajo_experiencia'];
        (document.getElementById("funciones") as HTMLInputElement)!.value=datosllenado['trabajo_funciones'];
        (document.getElementById("horarioInicio") as HTMLInputElement)!.value=datosllenado['trabajo_horaInicio'];
        (document.getElementById("horarioFin") as HTMLInputElement)!.value=datosllenado['trabajo_horaFin'];
        (document.getElementById("prestaciones") as HTMLInputElement)!.value=datosllenado['trabajo_prestaciones'];
        (document.getElementById("escolaridad") as HTMLInputElement)!.value=datosllenado['trabajo_escolaridad'];

    }

    function redireccion(ruta: any, datos: any) {
        let data = datos;

        history.push({
            pathname: ruta,
            state: { detail: data }
        })
    }
    






    return (

        <IonPage>
            <IonContent fullscreen>

                <IonRow className="ion-text-center ion-justify-content-center">
                    <IonCol style={{ backgroundColor: "#1538BF", flex: 1 }}>
                        <IonRow style={{ flex: 1 }}>
                            <IonCol style={{ flex: 1 }}>
                                <IonButton>Menu</IonButton>
                            </IonCol>
                            <IonCol style={{ flex: 10 }}>
                                <h1>Menu</h1>

                            </IonCol>
                        </IonRow>
                    </IonCol>
                </IonRow>

                <IonItem>
                    <IonLabel position="floating">Titulo del empleo:</IonLabel>
                    <IonInput placeholder="Titulo del empleo" id="tituloEmpleo" />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Descripcion del empleo:</IonLabel>
                    <IonInput placeholder="Descripcion del empleo" id="descripcion" />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Ubicación:</IonLabel>
                    <IonInput id="ubicacion" placeholder="Ubicación" />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Sueldo propuesto:</IonLabel>
                    <IonInput inputMode="numeric" id="sueldo" placeholder="Sueldo propuesto" />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked" >Requisitos:</IonLabel>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating" >Edad de la persona:</IonLabel>
                    <IonInput id="edadLaborador" placeholder="edad de la persona" type="number" />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked" >Escolaridad:</IonLabel>
                    <IonSelect id="escolaridad" >
                        <IonSelectOption value="primaria">Primaria o inferior</IonSelectOption>
                        <IonSelectOption value="secundaria">Secundaria</IonSelectOption>
                        <IonSelectOption value="preparatoria">Preparatoria o superior</IonSelectOption>
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Experiencia:</IonLabel>
                    <IonInput id="experiencia" placeholder="Experiencia obtenida" />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Funciones a realizar:</IonLabel>
                    <IonInput id="funciones" placeholder="Funciones a realizar" />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Horario:</IonLabel>
                    <IonRow>
                        <IonInput inputMode="numeric" placeholder="inicio" id="horarioInicio"></IonInput>
                        <IonInput inputMode="numeric" placeholder="fin" id="horarioFin"></IonInput>
                    </IonRow>
                </IonItem>


                <IonItem>
                    <IonLabel position="floating">Prestaciones o beneficios:</IonLabel>
                    <IonInput placeholder="Prestaciones" id="prestaciones"></IonInput>

                </IonItem>
                <IonButton onClick={function () {
                    let tituloEmpleo = (document.getElementById("tituloEmpleo") as HTMLInputElement)?.value;
                    let descripcion = (document.getElementById("descripcion") as HTMLInputElement)?.value;
                    let ubicacion = (document.getElementById("ubicacion") as HTMLInputElement)?.value;
                    let sueldo = (document.getElementById("sueldo") as HTMLInputElement)?.value;
                    let edadRequerida = (document.getElementById("edadLaborador") as HTMLInputElement)?.value;
                    let escolaridadRequerida = (document.getElementById("escolaridad") as HTMLInputElement)?.value;
                    let experienciaRequerida = (document.getElementById("experiencia") as HTMLInputElement)?.value;
                    let funcionesPorRealizar = (document.getElementById("funciones") as HTMLInputElement)?.value;
                    let HorarioInicio = (document.getElementById("horarioInicio") as HTMLInputElement)?.value;
                    let HorarioFin = (document.getElementById("horarioFin") as HTMLInputElement)?.value;
                    let prestacionesOfrecidas = (document.getElementById("prestaciones") as HTMLInputElement)?.value;
                    console.log(tituloEmpleo);
                    console.log(descripcion);
                    console.log(ubicacion);
                    console.log(sueldo);
                    console.log(edadRequerida);
                    console.log(escolaridadRequerida);
                    console.log(experienciaRequerida);
                    console.log(funcionesPorRealizar);
                    console.log(HorarioInicio);
                    console.log(HorarioFin);
                    console.log(prestacionesOfrecidas);
                    console.log();
                    if (tituloEmpleo == null || tituloEmpleo == "" || descripcion == null || descripcion == "" || ubicacion == null || ubicacion == "" ||
                        sueldo == null || sueldo == "" || edadRequerida == null || edadRequerida == "" || escolaridadRequerida == null || escolaridadRequerida == "" ||
                        experienciaRequerida == null || experienciaRequerida == "" || funcionesPorRealizar == null || funcionesPorRealizar == "" || HorarioInicio == null || HorarioFin == "" ||
                        prestacionesOfrecidas == null || prestacionesOfrecidas == "") {
                        alert("Por favor llena todos los campos");
                    }
                    else {
                        modificarEmpleo(tituloEmpleo, descripcion, ubicacion, sueldo, edadRequerida, escolaridadRequerida, experienciaRequerida, funcionesPorRealizar, HorarioInicio, HorarioFin, prestacionesOfrecidas);
                    }



                }} className="ion-margin-top" expand="block">
                    Modificar
                </IonButton>


            </IonContent>
            <IonButton onClick={async()=>{
                let diccionarioEnviar={
                    datosTrabajos:await trabajosPorEmpleador(),
                    datosUser:{tipopersona:"empleado",idtipopersona:datosEmpleo["empleador_id"]},
                    empleados:decodifyData.todo.empleados
                }
                console.log(diccionarioEnviar);

                redireccion("/inicioempleador",diccionarioEnviar);
            }}>Regresar</IonButton>
        </IonPage>
    );
};

const AlertExample: React.FC = () => {
    const [present] = useIonAlert();
    present('El correo ya existe', [{ text: 'Ok' }])
    return null
}

export default ModificarEmpleo;



