import React, {useEffect, useState} from 'react'
import {Button} from "@mui/material";


// Different solution
/*function GameBoard({ board }) {
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


	const checkButton = (event) => {
		const target = event.target;
	}

    // this is for the friendly board, this should not have anything to interact with
    // only updates when fired on by enemy
    if (board === 'friendly') {
        return (
            <div className="game-board-holder">
                <h5>GameBoard</h5>
                {gameboard.map((y, index) =>
                    <div key={index} className="row" data-y={index + 1}>{
                        y.map(x =>
                            <div
                                key={x}
                                className="col cols4gameboard"
                                data-x={x}
                            >
                                {x}
                            </div>)
                    }
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="game-board-holder">
            <h5>GameBoard</h5>
            {gameboard.map((y, index) =>
                <div key={index} className="row" data-y={index + 1}>{
                    y.map(x =>
                        <div
                            key={x}
                            className="col cols4gameboard"
                            data-x={x}
                            onClick={() => {
                                console.log(index + 1, x)
                            }}
                        >
                            {x}
                        </div>)
                }
                </div>
            )}
        </div>
    )
}*/

// Battlefield
const BattlefieldBox = ({text, board, coordinate}) => {
	const [hit, setHit] = useState(false);
	const [colored, setColored] = useState('#1a202f');
	const [ships, setShips] = useState([coordinate])



	const checkButton = (event) => {
		const target = event.target;
		setHit(true);

	}


	if (board === 'friendly') {
		return (
			<Button
				coordinate={coordinate }
				style={{
					color: (coordinate) ? '#1976d2' : null,
					background: colored,
					borderRadius: 0,
					boxShadow: '0 0 3px #1976d2',
					maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'
				}}
				disabled={false}
			>
				{text}
			</Button>
		)
	}

	return (
		<Button
			id={coordinate}
			disabled={hit}
			style={{
				background: colored,
				borderRadius: 0,
				boxShadow: '0 0 3px #1976d2',
				maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'
			}}
			onClick={(e) => {
				checkButton(e)
			}}>
			{hit ? null : text}
		</Button>
	)
};


// Render Battlefield Grid ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
const GameBoard = ({board}) => {
	const horizontal = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	const vertical = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	return (
		<div style={{display: "flex", alignItems: 'center', flexDirection: 'column'}}>
			{vertical.map(letter => (
				<div key={letter}>
					{
						horizontal.map(number => <BattlefieldBox
							board={board}
							coordinate={letter + number}
							key={letter + number}
							text={letter + number}/>)
					}
				</div>
			))}
		</div>
	)

}

export default GameBoard;