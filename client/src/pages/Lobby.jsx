import { useState, useEffect } from 'react'
import { useGameContext } from '../contexts/GameContextProvider'
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { useNavigate } from 'react-router-dom'



const Lobby = () => {
    const [username, setUsername] = useState('')
    const { setGameUsername, socket } = useGameContext()
    const [roomlist, setRoomlist] = useState([])
    const navigate = useNavigate()


    useEffect(() => {
		console.log("Requesting room list from server...")

		socket.emit('get-room-list', rooms => {
			setRoomlist(rooms)
		})

        // this is just to update the client for possible full rooms
        socket.on('check4gamers', () => {
            socket.emit('get-room-list', rooms => {
                setRoomlist(rooms)
            })
        })

        return () => {
			console.log("Running cleanup")

			// stop listening to events
			socket.off('check4gamers')
		}
	}, [socket])

	return (
		<div className="lobby">
            <div>
                <h1>Lobby</h1>
                <Form>
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                            type="text"
                            value={username}
                        />
                    </Form.Group>
                </Form>
                <Alert variant={'info'}>
                    You need to enter a valid username to join a game!
                </Alert>
                <h3>Games</h3>
                <div className="d-flex justify-content-between">
                    <ListGroup className="w-100">
                        {roomlist.map(room => 
                            <ListGroup.Item 
                                key={room.id} 
                                action
                                disabled={room.joinable === true && username.length > 1 ? false : true}
                                onClick={() => {
                                    setGameUsername(username)
                                    navigate(`/rooms/${room.id}`)
                                }}
                                className="d-flex justify-content-between align-items-start"
                                >
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold h5">{room.name}</div>
                                        
                                        {Object.values(room.users).length > 0 && 
                                        <div className="fw-bold">Connected Players:</div>}
                                        
                                        {Object.values(room.users).map((user, index) =>
                                            <div key={index}>{user}</div>
                                        )}
                                    </div>
                                    <Badge bg="primary" pill>
                                        {room.joinable === true ? 'Joinable' : 'Full'}
                                    </Badge> 
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </div>
            </div>
		</div>
	)
}

export default Lobby