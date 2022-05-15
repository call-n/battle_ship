import {Button} from "@mui/material";
import {useState} from "react";




// Battlefield
const BattlefieldBox = ({text}) => {
	const [hit, setHit] = useState(false);
	const [colored, setColored] = useState('#1a202f')


	const checkButton = (event) => {
		const target = event.target;
		setHit(true);
		(target.id === '5D') ? setColored('#5dd219') : setColored('#ff5454');
	}



	return (
		<Button
			id={text}
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


// Render Battlefield Grid
const Battlefield = () => {
	const horizontal = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	const vertical = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	return (
		<div style={{display: "flex", alignItems: 'center', flexDirection: 'column'}}>
			{vertical.map(letter => (
				<div key={letter}>
					{
						horizontal.map(number => <BattlefieldBox
							key={letter + number}
							text={letter + number}/>)
					}
				</div>
			))}
		</div>
	)

}

export default Battlefield;