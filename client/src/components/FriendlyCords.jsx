import { useState, useEffect, useRef } from 'react'
import Button from 'react-bootstrap/Button'


function FriendlyCords({ index, x, y, handleChoice, takenCords, choosingCords, disabled, shotCords }) {
    const [hit, setHit] = useState(false)
    const [chosen, setChosen] = useState(false)
    const cord = useRef()

    const handleClick = (y, x) => {
        if (!hit) {
            handleChoice(y, x)
        }
    }
    
    useEffect(() => {
        takenCords.find(cord => cord.y === y && cord.x === x) ? setChosen(true) : setChosen(false)
        
    }, [takenCords, y, x])

    if (disabled) {
        return(
            <Button
                className="col cols4gameboard"
                variant={chosen ? 'info' : 'none'}
                disabled={disabled}
            >
                {x}
            </Button>
        )
    }

  return (
            <Button
                className="col cols4gameboard"
                variant={chosen ? 'info' : 'none'}
                onClick={() => {
                    if (!choosingCords) return
                    handleClick(y, x)
                }}
                disabled={!choosingCords || chosen}
            >
                {x}
            </Button>
  )
}

export default FriendlyCords