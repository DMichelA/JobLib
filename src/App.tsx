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
import AñadirEmpleo from "./pages/añadirEmpleo/añadirEmpleo"
import VistaEmpleo from "./pages/vistaEmpleo/vistaEmpleo"
import FiltroEmpleado from "./pages/filtro/filtroempleado"
import FiltroEmpleador from "./pages/filtro/filtroempleador"
import Perfil from './pages/perfil/perfil'
import TrabajosAplicados from './pages/trabajosAplicadosEmpleado/trabajosAplicados'
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
        <Route path="/anadirempleo" component={AñadirEmpleo} exact={true}/>
        <Route path="/vistaempleo" component={VistaEmpleo} exact={true}/>
        <Route path="/filtroempleado" component={FiltroEmpleado} exact={true}/>
        <Route path="/filtroempleador" component={FiltroEmpleador} exact={true}/>
        <Route path="/perfil" component={Perfil} exact={true}/>
        <Route path="/trabajosaplicados" component={TrabajosAplicados} exact={true}/>

        <Redirect to="/login"/>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);



export default App;
