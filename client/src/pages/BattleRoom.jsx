import {useState, useEffect} from 'react'
import {useGameContext} from '../contexts/GameContextProvider'
import {useNavigate, useParams} from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import GameBoard from '../components/GameBoard'
import ChatRoom from '../components/ChatRoom'
import {Chip} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";

const BattleRoom = () => {
	const [connected, setConnected] = useState(false)
	const [users, setUsers] = useState([])
	const {gameUsername, socket} = useGameContext()
	const {room_id} = useParams()
	const navigate = useNavigate()


	const handleUpdateUsers = userlist => {
		console.log("Got new userlist", userlist)
		setUsers(userlist)
	}

	useEffect(() => {
		// if no username, redirect them to the login page
		if (!gameUsername) {
			navigate('/')
		}

		// emit join request
		socket.emit('user:joined', gameUsername, room_id, status => {
			console.log(`Successfully joined ${room_id} as ${gameUsername}`, status)
			setConnected(true)
		})

		// listen for updated userlist
		socket.on('user:list', handleUpdateUsers)

		return () => {
			console.log("Running cleanup")

			// stop listening to events
			socket.off('user:list', handleUpdateUsers)

			// rage-quit
			socket.emit('user:left', gameUsername, room_id)
		}
	}, [socket, gameUsername, room_id, navigate])

	// display connecting message
	if (!connected) {
		return (
			<p>Stand by, connecting....</p>
		)
	}

	return (
		<Container>
			<div style={{display: "flex", justifyContent: 'center', margin: 10}}>
				{Object.values(users).map((user, index) => <Chip avatar={<AccountCircle sx={{color: 'black'}}/>} sx={{background: 'rgba(26,32,47,0.50)' , color: 'white', marginRight: 1}} key={index} label={user} />)}
			</div>
			<Row>
				<Col><GameBoard board={'friendly'}/></Col>
				<Col><GameBoard board={'enemy'}/></Col>
			</Row>
			<Row>
				<Col>
					<ChatRoom/>
				</Col>
			</Row>

		</Container>
	)
}

export default BattleRoom