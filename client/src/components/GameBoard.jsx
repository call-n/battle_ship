import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useGameContext} from '../contexts/GameContextProvider';
import FriendlyCords from './FriendlyCords';
import EnemyCords from './EnemyCords';
import {Alert, Box, Button} from "@mui/material";

function GameBoard({turn}) {
	// * Arr for render game board
	const gameBoard = [
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	];

	////////CUSTOM HOOKS///////
	const {gameUsername, socket} = useGameContext();

	///////ROUTER///////
	const {room_id} = useParams();

	///////STATES///////
	const [yourTurn, setYourTurn] = useState(turn);
	const [selectedBoats, setSelectedBoats] = useState(false);
	const [choosingCords, setChoosingCords] = useState(false);
	const [direction, setDirection] = useState(false);
	const [alertText, setAlertText] = useState('Choose which ship you want to place');
	const [enemyBoard, setEnemyBoard] = useState([]);
	const [friendlyBoard, setFriendlyBoard] = useState([]);
	const [takenCords, setTakenCords] = useState([]);
	const [shotCords, setShotCords] = useState([]);
	const [chosenBoat, setChosenBoat] = useState([]);

	// * Ship Data
	/* eslint    no-unused-vars: 0 */
	const [boatsToPlace, setBoatsToPlace] = useState([
		{id: 'boat1', size: 2, placed: false},
		{id: 'boat2', size: 2, placed: false},
		{id: 'boat3', size: 3, placed: false},
		{id: 'boat4', size: 4, placed: false}
	]);

	///////EFFECTS///////
	// * if this is added in the other useEffect it becomes a ∞loop
	useEffect(() => {
		// if all the boats and cords have been placed and
		// if the friendly board has returned from server
		if (takenCords.length === 11 && friendlyBoard.length === 0) {
			setAlertText(`All your boats are set! Waiting for other player...`);
			socket.emit('game:board', takenCords, room_id, gameUsername);
		}
	}, [socket, takenCords, room_id, gameUsername, friendlyBoard]);

	// * useEffect for handling turn result from server
	useEffect(() => {
		socket.on('game:turnresult', (payload) => {
			// check who sent the shoot
			if (payload.player === socket.id) return;

			setAlertText('bruh, its ur turn');

			const urCord = takenCords.find(boat => boat.y === payload.cords.y && boat.x === payload.cords.x);

			if (urCord) {
				urCord.miss = false;
				urCord.hit = true;
				setYourTurn(true);
				return;
			}

			setYourTurn(true);

			// just to reuse the old array when rendering
			setTakenCords(prevState => [...prevState, {y: payload.cords.y, x: payload.cords.x, hit: false, miss: true}]);
		})
	}, [socket, takenCords]);

	// * The initial that runs first when you are dont with the board and checks if its your turn
	useEffect(() => {
		// Checks if server gave you the first shoot
		if (yourTurn) setAlertText('bruh, its ur turn');

		// listens for the server to respond with the final cords for both boards
		/* eslint    array-callback-return: 0 */
		socket.on('game:boardsfinito', room => {
			room.users.map(user => {
				if (user.id !== socket.id) setEnemyBoard(user.takenCords);
				if (user.id === socket.id) setFriendlyBoard(user.takenCords);
			})
			setSelectedBoats(true)
		});
	}, [socket, yourTurn]);

	///////FUNCTIONS///////
	// * Logic behind how ships are placed
	const onStartChooseBoatLoc = (y, x) => {

		// * Allowances for ship placement if ship over board
		/* eslint no-mixed-operators: 0 */
		if (!direction && x > 7 && chosenBoat.size === 4 || direction && y > 7 && chosenBoat.size === 4 ||
			!direction && x > 9 && chosenBoat.size === 2 || direction && y > 9 && chosenBoat.size === 2 ||
			!direction && x > 8 && chosenBoat.size === 3 || direction && y > 8 && chosenBoat.size === 3) {
			setAlertText(`Error: ship must be within game board borders`);
			return;
		}

		// * Color cells
		const colorBoatByCor = (y, x) => setTakenCords(prevState => [...prevState, {y, x}]);

		// * Rendering
		const renderBoat = () => {
			setChoosingCords(false);
			setAlertText('Choose a new boat!');

			const theBoat = boatsToPlace.find(boat => boat.id === chosenBoat.id);
			theBoat.placed = true;

			let i = 0;
			while (i < chosenBoat.size) {
				i++;
				(direction === true) ? colorBoatByCor(y++, x) : colorBoatByCor(y, x++);
			}
		};

		renderBoat();
	};

	// * Allow which type of ship you want to place on your field
	const handleBoatChoice = (boat) => {
		setChoosingCords(true);
		setAlertText(`You chose boat size ${boat.size}, now place where you want your boat!`);
		setChosenBoat(boat);
	};

	// * Color Opponents Cell on click
	const handleShoot = (y, x) => {

		let hit = false;
		const cords = {y: y, x: x};

		console.log(enemyBoard.find(boat => boat.y === y && boat.x === x), y, x);

		// check if the cords are in the enemy board
		if (enemyBoard.find(boat => boat.y === cords.y && boat.x === cords.x)) {
			setAlertText('You hit a ship!');
			hit = true;
		} else setAlertText('You missed, lol');

		setShotCords(prevState => [...prevState, {y: y, x: x, hit}]);
		setYourTurn(false);

		// * Parse coordinates data to server after shooting
		socket.emit('game:nextturn', cords, room_id);
	};

	///////RENDER HTML///////
	return (<>
		{/*Game Info*/}
		<Alert sx={{bgcolor: 'rgba(26,32,47,0.70)', mb: 5, color: 'white', zIndex: '999999'}}
		       severity="info"
		       children={alertText}/>

		{/*Buttons* for prep phase*/}
		{!selectedBoats && <Box sx={{display: 'flex'}}>
			<Button
				variant="contained"
				sx={{mr: 2, bgcolor: 'rgba(26,32,47,0.70)'}}
				onClick={() => setDirection(() => !direction)}
				children={(direction === false) ? 'Horizontal' : 'Vertical'}/>
			{boatsToPlace.map(boat => <Button
				sx={{mr: 2, bgcolor: 'rgba(26,32,47,0.70)'}}
				key={boat.id}
				variant="contained"
				disabled={choosingCords || boat.placed}
				onClick={() => handleBoatChoice(boat)}
				children={`Boat size: ${boat.size}`}/>)}
		</Box>}


		{/* Game board Grid*/}
		<Box sx={{display: 'flex'}}>

			{/*Player Grid*/}
			<Box sx={{m: 2}} children={gameBoard.map((y, index) => <Box key={index}>
				{y.map(x => <FriendlyCords
					key={x}
					x={x}
					y={index + 1}
					handleChoice={onStartChooseBoatLoc}
					takenCords={takenCords}
					choosingCords={choosingCords}
					shotCords={shotCords}
					children={x}/>)}
			</Box>)}/>

			{/*Enemy Grid*/}
			<Box sx={{m: 2}} children={gameBoard.map((y, index) => <Box key={index}>
				{y.map(x => <EnemyCords
					key={x}
					y={index + 1}
					x={x}
					enemyBoard={enemyBoard}
					disabled={!selectedBoats ? true : false}
					handleChoise={handleShoot}
					yourTurn={yourTurn}
					children={x}/>)}
			</Box>)}/>
		</Box>
	</>)
}

export default GameBoard