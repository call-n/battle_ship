import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useGameContext} from '../contexts/GameContextProvider'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

function GameBoard({turn}) {
	const {gameUsername, socket} = useGameContext();
	const [yourTurn, setYourTurn] = useState(turn);
	const [selectedBoats, setSelectedBoats] = useState(false);
	const [choosingCords, setChoosingCords] = useState(false);
	const [chosenBoat, setChosenBoat] = useState([]);
	const [alertText, setAlertText] = useState('Choose which ship you want to place');
	const [alertTextGaming, setAlertTextGaming] = useState('Wating for other player');
	const [enemyBoard, setEnemyBoard] = useState(false);
	const [friendlyBoard, setFriendlyBoard] = useState(false);
	const [direction, setDirection] = useState(false);
	const {room_id} = useParams();
	const gameboard = [
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
	]
	const [boatsToPlace, setBoatsToPlace] = useState([
		{
			id: 'boat1',
			size: 2,
			placed: false
		},
		{
			id: 'boat2',
			size: 2,
			placed: false
		},
		{
			id: 'boat3',
			size: 3,
			placed: false
		},
		{
			id: 'boat4',
			size: 4,
			placed: false
		}
	]);
	const [takenCords, setTakenCords] = useState([]);

	useEffect(() => {
		if (takenCords.length === 11) {
			setAlertText(`All your boats are set! Waiting for other player...`)
			socket.emit('game:board', takenCords, room_id, gameUsername)
		}
	}, [takenCords]);


	const onStartChooseBoatLoc = (y, x, target) => {
		if (target.classList.contains('friendlyBoat')) {
			setAlertText(`You cant choose the same cords again!`);
			return
		}

		if (!direction && x > 7 && chosenBoat.size === 4) {
			setAlertText(`Change to Vertical or select new place`);
			return;
		}
		if (direction && y > 7 && chosenBoat.size === 4) {
			setAlertText(`Change to Horizontal or select new place`);
			return;
		}
		if (!direction && x > 9 && chosenBoat.size === 2) {
			setAlertText(`Change to Vertical or select new place`);
			return;
		}
		if (direction && y > 9 && chosenBoat.size === 2) {
			setAlertText(`Change to Horizontal or select new place`);
			return;
		}

		if (!direction && x > 8 && chosenBoat.size === 3) {
			setAlertText(`Change to Vertical or select new place`);
			return;
		}
		if (direction && y > 8 && chosenBoat.size === 3) {
			setAlertText(`Change to Horizontal or select new place`);
			return;
		}

		const colorBoatByCor = (corY, corX) => {
			const friendlyBoat = document.querySelector(`[data-y-friendly="${corY}"] [data-x-friendly="${corX}"]`);
			setTakenCords(prevState => [...prevState, {y: corY, x: corX}])
			friendlyBoat.classList.add('friendlyBoat');
		}


		const renderBoat = () => {
			setChoosingCords(false);
			setAlertText('Choose a new boat!');

			const theBoat = boatsToPlace.find(boat => boat.id === chosenBoat.id);
			theBoat.placed = true;

			let i = 0;
			while (i < chosenBoat.size) {
				i++
				(direction === true) ? colorBoatByCor(y++, x) : colorBoatByCor(y, x++)
			}
		};


		renderBoat();



	}

	const handleBoatChoice = (boat) => {
		setChoosingCords(true)

		setAlertText(`You chose boat size ${boat.size}, now place where you want your boat!`)
		setChosenBoat(boat)
	}

	const nextTurn = (cords) => {
		socket.emit('game:nextturn', cords, room_id)
	}

	const handleShoot = (y, x) => {
		if (!yourTurn) {
			return
		}
		const cords = {y: y, x: x}
		// find the element hit by player with data selectors
		const targetHit = document.querySelector(`[data-y="${y}"] [data-x="${x}"]`)

		console.log(enemyBoard);
		console.log(enemyBoard[0].y, y)
		console.log(enemyBoard.find(boat => boat.y === y && boat.x === x));

		if (enemyBoard.find(boat => boat.y === y && boat.x === x)) {
			setAlertTextGaming('You hit a ship!')
			targetHit.classList.add('targetHit')
		} else {
			setAlertTextGaming('You missed, lol')
			targetHit.classList.add('targetMiss')

		}
		setYourTurn(false)
		nextTurn(cords)
		setAlertTextGaming('bruh, waiting for other P')
	}

	useEffect(() => {
		if (yourTurn) {
			setAlertTextGaming('bruh, its ur turn')
		}

		socket.on('game:boardsfinito', room => {
			room.users.map(user => {
				if (user.id !== socket.id) {
					setEnemyBoard(user.takenCords)
				}
				if (user.id === socket.id) {
					setFriendlyBoard(user.takenCords)
				}
			})

			setSelectedBoats(true)
		})

		socket.on('game:turnresult', (payload) => {
			if (payload.player === socket.id) {
				// check who sent the shoot
				return
			}
			setAlertTextGaming('bruh, its ur turn')

			const targetHitByEnemy = document.querySelector(`[data-y-friendly="${payload.cords.y}"] [data-x-friendly="${payload.cords.x}"]`)

			if (payload.cords.x === 5 && payload.cords.y === 5) {
				setAlertTextGaming('You got hit... lol')
				targetHitByEnemy.classList.add('targetHit')
				setYourTurn(true)
				return
			}

			setAlertTextGaming('He missed... lol')
			targetHitByEnemy.classList.add('targetMiss')
			setYourTurn(true)
		})

		if (friendlyBoard) {
			takenCords.forEach(cords => {
				const friendlyBoatCords = document.querySelector(`[data-y-friendly="${cords.y}"] [data-x-friendly="${cords.x}"]`)
				const enemyBoatCords = document.querySelector(`[data-y="${cords.y}"] [data-x="${cords.x}"]`)

				console.log('mjau');
				// Clean up for new board render
				friendlyBoatCords.classList.add('friendlyBoat')
				enemyBoatCords.classList.remove('friendlyBoat')
			})

		}

	}, [socket, room_id, friendlyBoard, yourTurn, takenCords])

	if (!selectedBoats) {
		return (
			<Row>
				<Alert variant={'info'}>
					{alertText}
				</Alert>
				<Container>
					<Button
						variant="info"
						style={{marginRight: 10}}
						onClick={() => setDirection(() => !direction)}>{(direction === false) ? 'Horizontal' : 'Vertical'}</Button>
					{boatsToPlace.map(boat => (
						<Button
							key={boat.id}
							variant="info"
							disabled={choosingCords || boat.placed}
							onClick={() => {
								handleBoatChoice(boat)

							}}
						>
							Boat size: {boat.size}
						</Button>
					))}
				</Container>
				<Col>
					<div className="game-board-holder">
						<h5>Yours</h5>
						{gameboard.map((y, index) =>
							<div key={index} className="row" data-y-friendly={index + 1}>{
								y.map(x =>
									<div
										key={x}
										className="col cols4gameboard"
										data-x-friendly={x}
										onClick={(event) => {
											const target = event.target
											if (!choosingCords) return
											onStartChooseBoatLoc(index + 1, x, target)
										}}
									>
										{x}
									</div>)
							}
							</div>
						)}
					</div>
				</Col>
				<Col>
					<div className="game-board-holder">
						<h5>Enemy</h5>
						{gameboard.map((y, index) =>
							<div key={index} className="row">{
								y.map(x =>
									<div
										key={x}
										className="col cols4gameboard"
									>
										{x}
									</div>)
							}
							</div>
						)}
					</div>
				</Col>
			</Row>
		)
	}

	return (
		<Row>
			<Alert variant={'info'}>
				{alertTextGaming}
			</Alert>
			<Col>
				<div className="game-board-holder">
					<h5>Yours</h5>
					{gameboard.map((y, index) =>
						<div key={index} className="row" data-y-friendly={index + 1}>{
							y.map(x =>
								<div
									key={x}
									className="col cols4gameboard"
									data-x-friendly={x}
								>
									{x}
								</div>)
						}
						</div>
					)}
				</div>
			</Col>
			<Col>
				<div className="game-board-holder">
					<h5>Enemy</h5>
					{gameboard.map((y, index) =>
						<div key={index} className="row" data-y={index + 1}>{
							y.map(x =>
								<div
									key={x}
									className="col cols4gameboard"
									data-x={x}
									onClick={() => {
										handleShoot(index + 1, x)
									}}
								>
									{x}
								</div>)
						}
						</div>
					)}
				</div>
			</Col>
		</Row>

	)
}

export default GameBoard