import {useEffect, useRef, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useGameContext} from '../contexts/GameContextProvider'
import {Box, FormControl, TextField} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";

const ChatRoom = () => {
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const {gameUsername, socket} = useGameContext();
	const {room_id} = useParams();
	const navigate = useNavigate();
	const messageRef = useRef();

	const handleIncomingMessage = msg => {
		console.log("Received a new chat message", msg);

		// add message to chat
		setMessages(prevMessages => [...prevMessages, msg]);
	};
	const handleSubmit = async e => {
		e.preventDefault();

		if (!message.length) return;

		// construct message object
		const msg = {username: gameUsername, room: room_id, content: message, timestamp: Date.now()}

		// emit chat message
		socket.emit('chat:message', msg)

		// add message to chat
		setMessages(prevMessages => [...prevMessages, {...msg, self: true}]);

		// clear message input and refocus on input element
		setMessage('');
		messageRef.current.focus();
	};

	// connect to room when component is mounted
	useEffect(() => {
		// listen for incoming messages
		socket.on('chat:message', handleIncomingMessage);

		return () => {
			console.log("Running cleanup");

			// stop listening to events
			socket.off('chat:message', handleIncomingMessage);
		}
	}, [socket, room_id, gameUsername, navigate]);

	// focus on message input
	useEffect(() => messageRef.current && messageRef.current.focus(), []);

	return (<>
		<FormControl component="form" onSubmit={handleSubmit} variant="standard" sx={{my: 5}}>
			<Box sx={{display: 'flex', alignItems: 'flex-end', mb: 1}}>
				<MessageIcon sx={{color: '#1976d2', mr: 1}}/>
				<TextField
					required
					inputProps={{style: {color: '#fff'}}}
					InputLabelProps={{style: {color: '#1976d2'}}}
					label={'Say something nice'}
					ref={messageRef}
					variant="standard"
					value={message}
					onChange={({target}) => setMessage(target.value)}/>
			</Box>
		</FormControl>
		<Messages messages={messages}/>
	</>)
}

const Messages = ({messages}) => {
	return <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		{messages.map(({username, content}, index) => (<TextField
			sx={{width: 400}}
			key={index}
			inputProps={{style: {color: '#fff'}}}
			InputLabelProps={{style: {color: '#1976d2'}}}
			label={username}
			defaultValue={content}
			variant="standard"
			InputProps={{readOnly: true,}}/>))}
	</Box>
}

export default ChatRoom

