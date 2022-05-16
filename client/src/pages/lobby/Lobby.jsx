import {useState, useEffect} from 'react'
import {useGameContext} from '../../contexts/GameContextProvider'
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'
import {useNavigate} from 'react-router-dom'
import {AccountCircle} from "@mui/icons-material";
import CustomTextField from "./CustomTextField";
import {Box} from "@mui/material";


function VideogameAssetIcon() {
	return null;
}

const Lobby = () => {
	const [username, setUsername] = useState('')
	const {setGameUsername, socket} = useGameContext()
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
				<div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
					<Box sx={{display: 'flex', alignItems: 'flex-end', marginBottom: 10}}>
						<AccountCircle sx={{color: '#1976d2', mr: 1, my: 0.5}}/>
						<CustomTextField required
						                 label={'Username'}
						                 variant="standard"
						                 value={username}
						                 onChange={e => setUsername(e.target.value)}/>
					</Box>
				</div>
				<div className="d-flex justify-content-between">
					<ListGroup className="w-100" style={{color: '#fff'}}>
						{roomlist.map(room =>
							<ListGroup.Item
								key={room.id}
								action
								disabled={!(room.joinable && username.length > 1)}
								onClick={() => {
									setGameUsername(username)
									navigate(`/rooms/${room.id}`)
								}}
								className={`d-flex justify-content-between align-items-start ${(room.joinable && username.length > 1) ? 'text-light' : 'text-muted'}`}
								style={{background: 'rgba(26,32,47,0.59)', cursor:'pointer'}}>
								<div className="ms-2 me-auto">
									<div className="fw-bold h5">{room.name}</div>
									{Object.values(room.users).length > 0 && <div className="fw-bold">Connected Players:</div>}
									{Object.values(room.users).map((user, index) => <div key={index}>{user}</div>)}
								</div>
								<Badge style={{background: '#1976d2', marginLeft: 20}} pill>
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