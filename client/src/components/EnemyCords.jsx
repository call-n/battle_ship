import {useEffect, useState} from 'react';
import {Button} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";

function EnemyCords({disabled, x, y, handleChoise, enemyBoard, yourTurn}) {
	///////STATES///////
	const [itsGoTime, SetItsGoTime] = useState(true);
	const [hit, setHit] = useState(false);
	const [shot, setShot] = useState(false);
	const [hitMissChecker, setHitMissChecker] = useState(false);
	const [extraMissChecker, setExtraMissChecker] = useState(false);

	///////GLOBAL VARIABLES///////
	const missIcon = extraMissChecker ? <ClearIcon sx={{color: 'rgba(26,32,47,0.5)', ml: -1.6, width: '40px', height: '40px', background: '#f50057'}}/> : null;
	const hitIcon = <DirectionsBoatIcon sx={{color: 'rgba(25,118,210,0.8)', ml: -1.6, width: '40px', height: '40px', background: '#1a202f'}}/>

	///////EFFECTS///////
	useEffect(() => {
		enemyBoard.find(cord => cord.y === y && cord.x === x) ? setShot(true) : setShot(false);
		SetItsGoTime(false);
	}, [enemyBoard, y, x]);

	///////FUNCTIONS///////
	const handleClick = (y, x) => {
		if (!yourTurn) return;

		enemyBoard.find(cord => cord.y === y && cord.x === x) ? setHitMissChecker(true) : setHitMissChecker(false);
		enemyBoard.find(cord => cord.y !== y && cord.x !== x) ? setExtraMissChecker(true) : setExtraMissChecker(false);
		handleChoise(y, x);
		setHit(true);
	}


	///////RENDER HTML///////
	// * For prep phase
	if (disabled) {
		return (<Button
			sx={{
				bgcolor: '#1a202f',
				borderRadius: 0,
				boxShadow: '0 0 3px #1976d2',
				maxWidth: '40px',
				maxHeight: '40px',
				minWidth: '40px',
				minHeight: '40px'
			}}
			disabled/>)
	}

	// * For game phase
	return (<Button
		sx={{
			bgcolor: "#1a202f",
			borderRadius: 0,
			boxShadow: '0 0 3px #1976d2',
			maxWidth: '40px',
			maxHeight: '40px',
			minWidth: '40px',
			minHeight: '40px'
		}}
		disabled={itsGoTime || !yourTurn}
		endIcon={hitMissChecker ? hitIcon : missIcon}
		onClick={() => handleClick(y, x)}/>)
}

export default EnemyCords;