import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGameContext } from '../contexts/GameContextProvider'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

function GameBoard({ turn }) {
    const { gameUsername, socket } = useGameContext()
    const [yourTurn, setYourTurn] = useState(turn)
    const [selectedBoats, setSelectedBoats] = useState(false)
    const [choosingCords, setChoosingCords] = useState(false)
    const [choosenBoat, setChoosenBoat] = useState([])
    const [alertText, setAlertText] = useState('Choose which ship you want to place')
    const [alertTextGaming, setAlertTextGaming] = useState('Wating for other player')
    const [timesPlaced, setTimesPlaced] = useState(1)
    const [enemyBoard, setEnemyBoard] = useState(false)
    const [friendlyBoard, setFriendlyBoard] = useState(false)
    const { room_id } = useParams()
    const gameboard = [
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,6,7,8,9,10],
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
    const [takenCords, setTakenCords] = useState([])

    const onStartChooseBoatLoc = (y, x) => {
        const friendlyBoat = document.querySelector(`[data-y-friendly="${y}"] [data-x-friendly="${x}"]`)

        friendlyBoat.classList.add('friendlyBoat')

        if ( takenCords.find(cords => cords.y === y && cords.x === x)) {
            setAlertText(`You cant choose the same cords again!`)
            return
        }

        setTimesPlaced(prevValue => prevValue + 1)
        setTakenCords(prevState => [...prevState, {y: y, x: x}])

        if(timesPlaced === choosenBoat.size) {
            console.log('boat finished');
            setChoosingCords(false)
            setAlertText('Choose a new boat!')

            const theBoat = boatsToPlace.find(boat => boat.id === choosenBoat.id)
            theBoat.placed = true;

            setTimesPlaced(1)
        }

        if (takenCords.length === 10) {
            setAlertText(`All your boats are set! Waiting for other player...`)
            socket.emit('game:board', takenCords, room_id, gameUsername)
        }
    }

    const handleBoatChoise = (boat) => {
        setChoosingCords(true)

        setAlertText(`You chose boat size ${boat.size}, now place where you want your boat!`)
        setChoosenBoat(boat)
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

        if ( enemyBoard.find(boat => boat.y === y && boat.x === x) ) {
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
            if( payload.player === socket.id ) {
                // check who sent the shoot
                return
            }
			console.log(payload.player)
            setAlertTextGaming('bruh, its ur turn')

            const targetHitByEnemy = document.querySelector(`[data-y-friendly="${payload.cords.y}"] [data-x-friendly="${payload.cords.x}"]`)

			console.log(targetHitByEnemy.payload)

            if( friendlyBoard.find(boat => boat.y === payload.cords.y && boat.x === payload.cords.x)) {
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

    if ( !selectedBoats ){
        return (
            <Row>
                <Alert variant={'info'}>
                    {alertText}
                </Alert>
                <Container>
                    { boatsToPlace.map(boat => (
                        <Button 
                            key={boat.id}
                            variant="info"
                            disabled={choosingCords || boat.placed}
                            onClick={() => {
                                handleBoatChoise(boat)
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
                                    onClick={() => {
                                        if (!choosingCords) {
                                            return
                                        }
                                        onStartChooseBoatLoc(index + 1, x)
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
                        <div key={index} className="row" >{
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