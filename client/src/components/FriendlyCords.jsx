import {useEffect, useState} from 'react';
import {Button} from "@mui/material";
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import ClearIcon from '@mui/icons-material/Clear';

function FriendlyCords({index, x, y, handleChoice, takenCords, choosingCords, disabled, shotCords, }) {
	///////STATES///////
	const [hit, setHit] = useState(false);
	const [chosen, setChosen] = useState(false);
	const [missTrigger, setMissTrigger] = useState(false);
	///////GLOBAL VARIABLES///////
	const hitIcon = takenCords.find(cord => cord.y === y && cord.x === x && cord.hit === true) ?
		<DirectionsBoatIcon sx={{color: 'rgba(25,118,210,0.8)', ml: -1.6, width: '40px', height: '40px', bgcolor: '#1a202f'}}/> : null;
	const missIcon = takenCords.find(cord => cord.y === y && cord.x === x && cord.miss === true) ?
		<ClearIcon sx={{color: 'rgba(26,32,47,0.5)', mr: -1.6, width: '40px', height: '40px', background: '#f50057'}}/> : null;


	///////EFFECTS///////
	useEffect(() => {
		takenCords.find(cord => cord.y === y && cord.x === x) ? setChosen(true) : setChosen(false);
		takenCords.find(cord => cord.y === y && cord.x === x && cord.miss === false) ? setMissTrigger(true) : setMissTrigger(false);
	}, [takenCords, y, x]);


	///////FUNCTIONS///////
	const handleClick = (y, x) => (!hit) ? handleChoice(y, x) : null

	///////RENDER HTML///////
	// * For prep phase
	if (disabled) {
		return (<Button
			sx={{
				bgcolor: chosen ? '#2196f3' : '#1a202f',
				borderRadius: 0,
				boxShadow: '0 0 3px #1976d2',
				maxWidth: '40px',
				maxHeight: '40px',
				minWidth: '40px',
				minHeight: '40px'
			}}
			disabled={disabled}
			children={x}/>)
	}
	// * For game phase
	return (<Button
		sx={{
			bgcolor: chosen ? '#2196f3' : '#1a202f',
			borderRadius: 0,
			boxShadow: '0 0 3px #1976d2',
			maxWidth: '40px',
			maxHeight: '40px',
			minWidth: '40px',
			minHeight: '40px'
		}}
		onClick={() => {
			if (!choosingCords) return
			handleClick(y, x)
		}}
		endIcon={hitIcon}
		startIcon={!missTrigger ? missIcon : null}
	/>)

}

export default FriendlyCords;