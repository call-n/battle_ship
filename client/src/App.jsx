import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Lobby from './pages/lobby/Lobby'
import BattleRoom from './pages/BattleRoom'
import NotFound from './pages/NotFound'
import './App.css'
import ErrorBoundary from "./components/errorBoundary/ErrorBoundary";
import Bokeh from "./components/bokeh/Bokeh";

const App = () => {

	return (
		<div id="App">
			<Navigation />
			<Bokeh/>
			<Routes>
				<Route path="/" element={<ErrorBoundary insideElement={<Lobby />}/>} />
				<Route path="/rooms/:room_id" element={<ErrorBoundary insideElement={<BattleRoom />}/>} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	)
}

export default App;
