import {useEffect, useState} from 'react';
import {useGameContext} from '../contexts/GameContextProvider';
import {useNavigate, useParams} from 'react-router-dom';
import {Alert, Box, Chip, Container, LinearProgress} from "@mui/material";
import GameBoard from "../components/GameBoard";
import ChatRoom from "../components/ChatRoom";

const BattleRoom = () => {

	// CUSTOM HOOKS
	const {gameUsername, socket} = useGameContext();

	// STATES
	const [users, setUsers] = useState([]);
	const [whosTurn, setWhosTurn] = useState(false);
	const [startGame, setStartGame] = useState(false);
	const [connected, setConnected] = useState(false);

	// ROUTES
	const {room_id} = useParams();
	const navigate = useNavigate();

	const handleUpdateUsers = userList => setUsers(userList);

	useEffect(() => {
		// if no username, redirect them to the login page
		if (!gameUsername) navigate('/');

		// emit join request
		socket.emit('user:joined', gameUsername, room_id, status => setConnected(true));

		// listen for updated userlist
		socket.on('user:list', handleUpdateUsers);

		return () => {
			// stop listening to events
			socket.off('user:list', handleUpdateUsers)

			// rage-quit
			socket.emit('user:left', gameUsername, room_id)
		}
	}, [socket, gameUsername, room_id, navigate]);

	useEffect(() => {
		// listen for game start
		socket.emit('game:start', room_id);

		socket.on('game:starting', (player) => {
			player === socket.id ? setWhosTurn(true) : console.log('Other player starts..');

			setStartGame(true);
		});

	}, [socket, room_id]);

	// display connecting message
	if (!connected) return <Box sx={{width: '100%'}} children={<LinearProgress/>}/>
	return <Container>
		<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<Chip label={Object.values(users).join(' vs ')} color="primary" sx={{bgcolor: 'rgba(26,32,47,0.50)', mb: 5}}/>
			{startGame ? <>
				<GameBoard turn={whosTurn} users={users}/>
				<ChatRoom/>
			</> : <Alert
				sx={{bgcolor: 'rgba(26,32,47,0.70)', mb: 5, color: 'white'}}
				severity="info"
				children={'Waiting for another player to join...'}/>}
		</Box>
	</Container>;
};

export default BattleRoom;