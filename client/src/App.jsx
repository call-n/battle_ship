import socketio from 'socket.io-client'
import './App.css'

const App = () => {
	const socket = socketio.connect(process.env.REACT_APP_SOCKET_URL)

	return (
		<>
			lol
		</>
	)
}

export default App;
