import { useEffect, useState, useRef } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import ListGroup from 'react-bootstrap/ListGroup'
import { useNavigate, useParams } from 'react-router-dom'
import { useGameContext } from '../contexts/GameContextProvider'

const ChatRoom = () => {
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState([])
	const { gameUsername, socket } = useGameContext()
	const { room_id } = useParams()
	const navigate = useNavigate()
	const messageRef = useRef()

	const handleIncomingMessage = msg => {
		console.log("Received a new chat message", msg)

		// add message to chat
		setMessages(prevMessages => [ ...prevMessages, msg ])
	}

	const handleSubmit = async e => {
		e.preventDefault()

		if (!message.length) {
			return
		}

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
				{ ...msg, self: true }
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
			<div id="chat">
				<h2>#{room_id}</h2>

				<div id="messages-wrapper">
					<ListGroup id="messages">
						{messages.map((message, index) => {
							const ts = new Date(message.timestamp)
							const time = ts.toLocaleTimeString()
							return (
								<ListGroup.Item key={index} className="message">
									<span className="time">{time}</span>{' '}
									<span className="user">{message.username}:</span>{' '}
									<span className="content">{message.content}</span>
								</ListGroup.Item>
							)
						}
					)}
					</ListGroup>
				</div>

				<Form onSubmit={handleSubmit} id="message-form">
					<InputGroup>
						<Form.Control
							onChange={e => setMessage(e.target.value)}
							placeholder="Say something nice..."
							ref={messageRef}
							required
							type="text"
							value={message}
						/>
						<Button variant="success" type="submit" disabled={!message.length}>Send</Button>
					</InputGroup>
				</Form>
			</div>
		</div>
	)
}

export default ChatRoom

