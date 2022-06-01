import {Route, Routes} from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Lobby from '../../pages/Lobby';
import BattleRoom from '../../pages/BattleRoom';
import NotFound from '../../pages/NotFound';
import './App.css';
import ErrorBoundary from "../../components/ErrorBoundary";
import Wave from "../bg_animations/Wave";

const App = () => {
	return (<div id="App">
		{/*Animations*/}
		<Wave/>

		{/*Navigation*/}
		<Navigation/>

		{/*Main Content*/}
		<Routes>
			<Route path="/" element={<ErrorBoundary insideElement={<Lobby/>}/>}/>
			<Route path="/rooms/:room_id" element={<ErrorBoundary insideElement={<BattleRoom/>}/>}/>
			<Route path="*" element={<NotFound/>}/>
		</Routes>
	</div>)
}

export default App;
