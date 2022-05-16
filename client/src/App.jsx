import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Lobby from './pages/Lobby'
import BattleRoom from './pages/BattleRoom'
import NotFound from './pages/NotFound'
import './App.css'

const App = () => {

	return (
		<div id="App">
			<Navigation />

			<Routes>
				<Route path="/" element={<Lobby />} />
				<Route path="/rooms/:room_id" element={<BattleRoom />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	)
}

export default App;
