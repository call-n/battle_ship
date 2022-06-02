import { useState, useEffect, useRef } from 'react'
import Button from 'react-bootstrap/Button'


function EnemyCords({ disabled, x, y, handleChoise, enemyBoard, yourTurn }) {
    const [hit, setHit] = useState(false)
    const [shot, setShot] = useState(false)
    const [itsGoTime, SetItsGoTime] = useState(true)

    const handleClick = (y, x) => {
        if(!yourTurn) return

        handleChoise(y, x)
        setHit(true)
    }

    useEffect(() => {
        enemyBoard.find(cord => cord.y === y && cord.x === x) ? setShot(true) : setShot(false)

        SetItsGoTime(false)
        console.log('xd');

		
    }, [enemyBoard, y, x])

    if (disabled) {
        return(
            <Button
                variant="none"
                className="col cols4gameboard"
                disabled
            >
                
            </Button>
        )
    }

  return (
        <Button
            variant={hit ? 'success' : "none"}
            className="col cols4gameboard"
            disabled={itsGoTime || !yourTurn}
            onClick={() => {
                handleClick(y, x)
            }}
        >
            
        </Button>
  )
}

export default EnemyCords