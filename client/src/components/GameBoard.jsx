import React, {useEffect, useState} from 'react'




// Different solution
function GameBoard({board}) {
	const [colored, setColored] = useState('#ff5454')
	const gameboard = [
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 11],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 11],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 11],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 11],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	]

	const random = () => Math.floor(Math.random() * 10) + 1;

	const checkMe = (event) => {
		const target = event.target;
		const x = target.getAttribute('data-x');
		const y = target.getAttribute('data-y');
		console.log(y, x)
	}

	// this is for the friendly board, this should not have anything to interact with
	// only updates when fired on by enemy
	if (board === 'friendly') {

		return (
			<div className="game-board-holder">
				<h5>GameBoard</h5>
				{gameboard.map((y, index) =>
					<div key={index} className="row" data-y={index + 1}>{
						y.map((x, i) =>
							<div
								key={i}
								className="col cols4gameboard"
								data-x={i}>
								{x}
							</div>)}
					</div>)}
			</div>
		)
	}
	return (
		<div className="game-board-holder">
			<h5>GameBoard</h5>
			{gameboard.map((y, index) =>
				<div key={index} className="row" data-y={index + 1}>{
					y.map((x) =>
						<div
							key={x}
							className="col cols4gameboard"
							data-x={x}
							data-y={index + 1}
							onClick={event => {
								checkMe(event)
							}}
						>
							{`${index + 1}.${x}`}
						</div>)
				}
				</div>
			)}
		</div>
	)
}


// Battlefield
/*
const BattlefieldBox = ({text, board, coordinate}) => {
	const [hit, setHit] = useState(false);
	const [colored, setColored] = useState('#1a202f');


	const checkButton = (event) => {
		const target = event.target;
		(target.id === coordinate) ? setColored('#5dd219') : setColored('#ff5454');
	}

	const checkCoordinate = () => {

	}

	if (board === 'friendly') {
		return (
			<>
				<Button
					id={coordinate}
					style={{
						background: (Math.floor(Math.random() * 10) + 'D' === coordinate) ? 'red' : null,
						borderRadius: 0,
						color: '#1a202f',
						boxShadow: '0 0 3px #1976d2',
						maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'
					}}
					disabled={true}>
				</Button>
			</>
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
				checkButton(e);

			}}>
			{coordinate}
		</Button>
	)
};


// Render Battlefield Grid
const GameBoard = ({board}) => {
	const horizontal = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	const vertical = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	return (
		<div style={{display: "flex", alignItems: 'center', flexDirection: 'column'}}>
			{vertical.map(letter => (
				<div key={letter}>
					{
						horizontal.map((number, i) => <BattlefieldBox
									coordinate={letter + number}
									board={board}
									key={i}/>
						)
					}
				</div>
			))}
		</div>
	)


}*/


export default GameBoard;