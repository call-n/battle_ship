/**
 * Socket Controller
 */

const debug = require('debug')('battleship:socket_controller');
let io = null; // socket.io server instance

const rooms = [
	{
		id: 'antietam',
		name: 'Antietam, Maryland',
		users: {},
	},
	{
		id: 'chalmette',
		name: 'Chalmette, Louisiana',
		users: {},
	},
	{
		id: 'fredericksburg',
		name: 'Fredericksburg, Virginia',
		users: {},
	},
];

var room_boards = []

/**
 * Get room by ID
 *
 * @param {String} id ID of Room to get
 * @returns
 */
 const getRoomById = id => {
	return rooms.find(room => room.id === id)
}

/**
 * Get room by User ID
 *
 * @param {String} id Socket ID of User to get Room by
 * @returns
 */
const getRoomByUserId = id => {
	return rooms.find(chatroom => chatroom.users.hasOwnProperty(id));
}

/**
 * Handle a user disconnecting
 *
 */
const handleDisconnect = function() {
	debug(`Client ${this.id} disconnected :(`);

	// find the room that this socket is part of
	const room = getRoomByUserId(this.id);

	// if socket was not in a room, don't broadcast disconnect
	if (!room) {
		return;
	}

	// let everyone in the room know that this user has disconnected
	this.broadcast.to(room.id).emit('user:disconnected', room.users[this.id]);

	// remove user from list of users in that room
	delete room.users[this.id];

	// broadcast list of users in room to all connected sockets EXCEPT ourselves
	this.broadcast.to(room.id).emit('user:list', room.users);
}


/**
 * Handle a user joining a room
 *
 */
 const handleUserJoined = async function(username, room_id, callback) {
	debug(`User ${username} with socket id ${this.id} wants to join room '${room_id}'`);

	// join room
	this.join(room_id);

	// add socket to list of online users in this room
	// a) find room object with `id` === `general`
	const room = getRoomById(room_id);

	// b) add socket to room's `users` object
	room.users[this.id] = username;

	// let everyone know that someone has joined the room
	this.broadcast.to(room.id).emit('user:joined', username);

	// confirm join
	callback({
		success: true,
		roomName: room.name,
		users: room.users
	});

	// tells the lobby if players joined lobby
	io.emit('check4gamers')

	// broadcast list of users to everyone in the room
	io.to(room.id).emit('user:list', room.users);
}

/**
 * Handle a user leaving a room
 *
 */
 const handleUserLeft = async function(username, room_id) {
	debug(`User ${username} with socket id ${this.id} left room '${room_id}'`);

	// leave room
	this.leave(room_id);

	// remove socket from list of online users in this room
	// a) find room object with `id` === `general`
	const room = getRoomById(room_id);

	// b) remove socket from room's `users` object
	delete room.users[this.id];

	// removes the game instance and clears boards
	room_boards = room_boards.filter(board => board.id === room.name)

	// let everyone know that someone left the room
	this.broadcast.to(room.id).emit('user:left', username);

	// broadcast list of users to everyone in the room
	io.to(room.id).emit('user:list', room.users);
}

let joinable;
const handleGetRoomList = function(callback) {

	// generate a list of rooms with only their id and name
	const room_list = rooms.map(room => {

		// the joinable parameter is used in the lobby so I know 
		// when a new user can join the room
		Object.keys(room.users).length >= 2 
		? joinable = false 
		: joinable = true
	
		return {
			id: room.id,
			name: room.name,
			users: room.users,
			joinable: joinable
		}
	});

	// send list of rooms back to the client
	callback(room_list);
}

/**
 * Handle a user sending a chat message to a room
 *
 */
 const handleChatMessage = async function(data) {
	debug('Someone said something: ', data);

	const room = getRoomById(data.room);

	// emit `chat:message` event to everyone EXCEPT the sender
	this.broadcast.to(room.id).emit('chat:message', data);
}

/**
 * Handles the start of game
 * 
 */
const handleGameStart = function(room_id) {

	// get room
	const room = getRoomById(room_id);

	// checks if there is two users in the room
	if (Object.keys(room.users).length !== 2) {
		return;
	}

	// when both players has connected return player who starts
	io.to(room_id).emit('game:starting', this.id);
}

/**
 * Handles the turns, just like the message for the chat
 * 
 */
const handleTurns = function(cords, room_id) {

	// what we want to give back to the client
	const payload = {
		cords: cords, 
		player: this.id
	}
	// tells us the cords and who shoot
	io.to(room_id).emit('game:turnresult', payload);
}

/**
 * handleGameBoards purpose is so we can save both players set boards
 * and send them to both clients for later use
 */
const handleGameBoard = function(cords, room_id, username) {

	// if there is no instance for this room 
	// create one and add the first players board
	if ( !room_boards.find(room => room.id === room_id) ) {
		room_boards.push({
			id: room_id,
			users: [
				{
					id: this.id,
					name: username,
					takenCords: cords
				}
			]
		})
		return
	}

	// find the room we created earlier
	const room = room_boards.find(room => room.id === room_id)

	// set the other player's board
	room.users.push({
		id: this.id,
		name: username,
		takenCords: cords
	})

	console.log(room)
	// tell the client we have both boards
	io.to(room_id).emit('game:boardsfinito', room);
}

/**
 * Export controller and attach handlers to events
 *
 */
module.exports = function(socket, _io) {
	// save a reference to the socket.io server instance
	io = _io;

	debug(`Client ${socket.id} connected`)

	// handle user disconnect
	socket.on('disconnect', handleDisconnect);

	// handle user joined
	socket.on('user:joined', handleUserJoined);

	// handle user leave
	socket.on('user:left', handleUserLeft);

	// handle get room list request
	socket.on('get-room-list', handleGetRoomList);

	// handle user emitting a new message
	socket.on('chat:message', handleChatMessage);

	// handle the start of game
	socket.on('game:start', handleGameStart)

	// handle turns
	socket.on('game:nextturn', handleTurns)

	// handle the board of the game
	socket.on('game:board', handleGameBoard)
}
