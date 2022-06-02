import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useGameContext} from '../contexts/GameContextProvider'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import FriendlyCords from './FriendlyCords'
import EnemyCords from './EnemyCords'

function GameBoard({turn}) {
	const {gameUsername, socket} = useGameContext()
	const [yourTurn, setYourTurn] = useState(turn)
	const [selectedBoats, setSelectedBoats] = useState(false)
	const [choosingCords, setChoosingCords] = useState(false)
	const [chosenBoat, setChosenBoat] = useState([])
	const [alertText, setAlertText] = useState('Choose which ship you want to place')
	const [alertTextGaming, setAlertTextGaming] = useState('Wating for other player')
	const [alertGameStatus, setAlertGameStatus] = useState('lol')
	const [enemyBoard, setEnemyBoard] = useState([])
	const [friendlyBoard, setFriendlyBoard] = useState([])
	const [direction, setDirection] = useState(false)
	const [takenCords, setTakenCords] = useState([])
	const [shotCords, setShotCords] = useState([])
	const {room_id} = useParams()
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
	])


	const onStartChooseBoatLoc = (y, x) => {
		
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

		const colorBoatByCor = (y, x) => {
			setTakenCords(prevState => [...prevState, {y: y, x: x, hit: false}])
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

        let hit = false;
		const cords = {y: y, x: x}

        console.log(enemyBoard.find(boat => boat.y === y && boat.x === x), y, x)

        // check if the cords are in the enemy board
		if (enemyBoard.find(boat => boat.y === cords.y && boat.x === cords.x)) {
			setAlertGameStatus('You hit a ship!')
            hit = true
		} else {
			setAlertGameStatus('You missed, lol')
		}

		setShotCords(prevState => [...prevState, {y: y, x: x, hit: hit}])
		setYourTurn(false)
		nextTurn(cords)
	}

    // if this is added in the other useEffect it becomes a ∞loop
    useEffect(() => {
        // if all the boats and cords have been placed and 
        // if the friendly board has returned from server
        if (takenCords.length === 11 && friendlyBoard.length === 0) {
            setAlertText(`All your boats are set! Waiting for other player...`)
            socket.emit('game:board', takenCords, room_id, gameUsername)
        }

    }, [socket, takenCords, room_id, gameUsername, friendlyBoard])

    // useEffect for handling turn result from server
    useEffect(() => {
        socket.on('game:turnresult', (payload) => {
			if (payload.player === socket.id) {
				// check who sent the shoot
				return
			}
			setAlertTextGaming('bruh, its ur turn')

            const urCord = takenCords.find(boat => boat.y === payload.cords.y && boat.x === payload.cords.x)

            if (urCord) {
                urCord.hit = true
                setAlertGameStatus('You got hit... lol')
                setYourTurn(true)
                return
            }

            setAlertGameStatus('He missed... lol')
            setYourTurn(true)
            // just to reuse the old array when rendering
			setTakenCords(prevState => [...prevState, {
                y: payload.cords.y, 
                x: payload.cords.x , 
                hit: false
            }])
		})
    }, [socket, takenCords])

    // The initital that runs first when you are dont with the board and checks if its your turn
    useEffect(() => {
        // Checks if server gave you the first shoot
		if (yourTurn) {
			setAlertTextGaming('bruh, its ur turn')
		}

        // listens for the server to respond with the final cords for both boards
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
	}, [socket, yourTurn])

	return (
		<Row>
				
                {!selectedBoats && 
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
                    </Row>
                }
                {selectedBoats && 
                    <Row>
                        <Col>
                            <Alert variant={'info'}>
                                {alertTextGaming}
                            </Alert>
                        </Col>
                        <Col>
                            <Alert>
                                {alertGameStatus}
                            </Alert>
                        </Col>
                    </Row>
                }
				
				<Col>
					<div className="game-board-holder">
						<h5>Yours</h5>
						{gameboard.map((y, index) =>
                            <Row key={index}>{
                                y.map(x =>
                                    <FriendlyCords
                                        key={x}
                                        x={x}
                                        y={index + 1}
                                        handleChoice={onStartChooseBoatLoc}
                                        takenCords={takenCords}
                                        choosingCords={choosingCords}
                                        shotCords={shotCords}
                                    >
                                        {x}
                                    </FriendlyCords>
                                )}
                            </Row>
						)}
					</div>
				</Col>
				<Col>
					<div className="game-board-holder">
						<h5>Enemy</h5>
						{gameboard.map((y, index) =>
                            <Row key={index}>{
                                y.map(x =>
                                    <EnemyCords
                                        key={x}
                                        y={index + 1}
                                        x={x}
                                        enemyBoard={enemyBoard}
                                        disabled={!selectedBoats ? true : false}
                                        handleChoise={handleShoot}
                                        yourTurn={yourTurn}
                                    >
                                        {x}
                                    </EnemyCords>
                                )}
                            </Row>
						)}
					</div>
				</Col>
			</Row>
		)
}

export default GameBoard