import { useState, useEffect } from 'react'
import { useGameContext } from '../contexts/GameContextProvider'
import { useNavigate, useParams } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import GameBoard from '../components/GameBoard'
import ChatRoom from '../components/ChatRoom'
import Alert from 'react-bootstrap/Alert'

const BattleRoom = () => {
    const [connected, setConnected] = useState(false)
    const [users, setUsers] = useState([])
	const [whosTurn, setWhosTurn] = useState(false)
	const [startGame, setStartGame] = useState(false)
    const { gameUsername, socket } = useGameContext()
    const { room_id } = useParams()
    const navigate = useNavigate()

    const handleUpdateUsers = userlist => {
		setUsers(userlist)
	}

    useEffect(() => {
		// if no username, redirect them to the login page
		if (!gameUsername) {
			navigate('/')
		}

        // emit join request
		socket.emit('user:joined', gameUsername, room_id, status => {
			setConnected(true)
		})

        // listen for updated userlist
		socket.on('user:list', handleUpdateUsers)

        return () => {
			// stop listening to events
			socket.off('user:list', handleUpdateUsers)

			// rage-quit
			socket.emit('user:left', gameUsername, room_id)
		}
    }, [socket, gameUsername, room_id, navigate])

	useEffect(() => {
		// listen for game start
		socket.emit('game:start', room_id)

		socket.on('game:starting', (player) => {
			player === socket.id 
			? setWhosTurn(true)
			: console.log('Other player starts..')

			setStartGame(true)
		})

	}, [socket, room_id])

    // display connecting message
    if (!connected) {
        return (
            <p>Stand by, connecting....</p>
        )
    }

	return (
		<Container>
			<Container>
				<Row>
					<Col><h1>BattleRoom</h1></Col>
					<Col xs lg="2">
					<div className="gamers">
						<h4>Gamers:</h4>
						<ul id="online-users">
							{Object.values(users).map((user, index) =>
								<li key={index}>{user}</li>
							)}
						</ul>
					</div>
					</Col>
				</Row>
			</Container>
			{startGame ? (
				<Container>
					<GameBoard turn={whosTurn} />
				</Container>)
				:( 
				<Alert variant={'info'}>
					Waiting for another player to join...
				</Alert>
				)}
			<Container>
				<Row>
					<Col>
						<ChatRoom />
					</Col>
					<Col>
						lol
					</Col>
				</Row>
			</Container>
		</Container>
	)
}

export default BattleRoom