import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Home from './pages/home/home';
import Login from './pages/login/login';
import SignUp from './pages/signup/signup';
import DataUser from "./pages/datosUsuario/datosUsuario"
import InicioEmpleado from "./pages/inicio/inicioEmpleado"
import InicioEmpleador from "./pages/inicio/inicioEmpleador"
import AnadirEmpleo from "./pages/anadirEmpleo/anadirEmpleo"
import VistaEmpleo from "./pages/vistaEmpleo/vistaEmpleo"
import FiltroEmpleado from "./pages/filtro/filtroempleado"
import FiltroEmpleador from "./pages/filtro/filtroempleador"
import PerfilEmpleado from './pages/perfilEmpleado/perfilEmpleado'
import PerfilEmpleador from './pages/perfilEmpleador/perfilEmpleador'
import TrabajosAplicados from './pages/trabajosAplicadosEmpleado/trabajosAplicados'
import ModificarEmpleo from './pages/ModificarEmpleo/modificarEmpleo'
import Postulaciones from './pages/postulaciones/postulaciones';
import Aceptadas from './pages/Aceptadas/Aceptadas';
import Rechazadas from './pages/Rechazadas/Rechazadas';
import Mensajes from './pages/messages/messages';
import MensajesEntrantes from './pages/MensajesEntrantes/mensajesEntrantes';
import MensajesDesdeEmpleador from './pages/mensajesdesdeempleador/mensajesdesdeempleador';
setupIonicReact();
const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/" component={Home} exact={true}/>
        <Route path="/login"  component={Login} exact={true}/>
        <Route path="/signup" component={SignUp} exact={true}/>
        <Route path="/datauser" component={DataUser} exact={true}/>
        <Route path="/inicioempleado" component={InicioEmpleado} exact={true}/>
        <Route path="/inicioempleador" component={InicioEmpleador} exact={true}/>
        <Route path="/anadirempleo" component={AnadirEmpleo} exact={true}/>
        <Route path="/vistaempleo" component={VistaEmpleo} exact={true}/>
        <Route path="/filtroempleado" component={FiltroEmpleado} exact={true}/>
        <Route path="/filtroempleador" component={FiltroEmpleador} exact={true}/>
        <Route path="/perfilempleado" component={PerfilEmpleado} exact={true}/>
        <Route path="/perfilempleador" component={PerfilEmpleador} exact={true}/>
        <Route path="/trabajosaplicados" component={TrabajosAplicados} exact={true}/>
        <Route path="/modificarempleo" component={ModificarEmpleo} exact={true}/>
        <Route path="/postulaciones" component={Postulaciones} exact={true}/>
        <Route path="/aceptadas" component={Aceptadas} exact={true}/>
        <Route path="/rechazadas" component={Rechazadas} exact={true}/>
        <Route path="/mensajes" component={Mensajes} exact={true}/>
        <Route path="/mensajesentrantes" component={MensajesEntrantes} exact={true}/>
        <Route path="/mensajesdesdeempleador" component={MensajesDesdeEmpleador} exact={true}/>

        <Redirect to="/login"/>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);



export default App;
