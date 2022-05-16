import {useEffect, useState, useRef} from 'react'
import SendIcon from '@mui/icons-material/Send';
import {useNavigate, useParams} from 'react-router-dom'
import {useGameContext} from '../contexts/GameContextProvider'
import {Box, Button} from "@mui/material";
import MessageIcon from '@mui/icons-material/Message';
import CustomTextField from "../pages/lobby/CustomTextField";
import CustomTextField2 from "../pages/lobby/CustomTextField2";

const ChatRoom = () => {
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState([])
	const {gameUsername, socket} = useGameContext()
	const {room_id} = useParams()
	const navigate = useNavigate()
	const messageRef = useRef()

	const handleIncomingMessage = msg => {
		console.log("Received a new chat message", msg)

		// add message to chat
		setMessages(prevMessages => [...prevMessages, msg])
	}

	const handleSubmit = async e => {
		e.preventDefault()

		if (!message.length) return


		// construct message object
		const msg = {
			username: gameUsername,
			room: room_id,
			content: message,
			timestamp: Date.now(),
		}

		// emit chat message
		socket.emit('chat:message', msg)

		// add message to chat
		setMessages(prevMessages =>
			[
				...prevMessages,
				{...msg, self: true}
			]
		)

		// clear message input and refocus on input element
		setMessage('')
		messageRef.current.focus()
	}

	// connect to room when component is mounted
	useEffect(() => {
		// listen for incoming messages
		socket.on('chat:message', handleIncomingMessage)

		return () => {
			console.log("Running cleanup")

			// stop listening to events
			socket.off('chat:message', handleIncomingMessage)
		}
	}, [socket, room_id, gameUsername, navigate])

	useEffect(() => {
		// focus on message input
		messageRef.current && messageRef.current.focus()
	}, [])

	return (
		<div id="chat-room">
			<div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
				<Box component="form" onSubmit={handleSubmit} sx={{display: 'flex', flexDirection: 'column'}}>
					<div style={{display: 'flex', alignItems: 'flex-end', marginBottom: 10}}>
						<MessageIcon sx={{color: '#1976d2', mr: 1, my: 0.5}}/>
						<CustomTextField required
						                 label={'Say something nice'}
						                 variant="standard"
						                 value={message}
						                 ref={messageRef}
						                 type="text"
						                 onChange={e => setMessage(e.target.value)}/>
					</div>
					<Button style={{color: 'white',}} variant="contained" endIcon={<SendIcon style={{color: 'white'}}/>}
					        type='submit' disabled={!message.length}>Send</Button>
				</Box>
			</div>
			<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
				{messages.map((message, index) => {
						const ts = new Date(message.timestamp)
						const time = ts.toLocaleTimeString()
						return (
							<CustomTextField2
								sx={{minWidth: 400, margin: 2, color: 'white !important'}}

								id="standard-error-helper-text"
								label={message.username}
								defaultValue={message.content}
								helperText={time}
								variant="standard"
								InputProps={{readOnly: true,}}
							/>
						)
					}
				)}
			</Box>


		</div>
	)
}

export default ChatRoom

