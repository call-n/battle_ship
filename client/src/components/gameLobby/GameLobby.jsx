import {Box} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import CustomTextField from "./CustomTextField";
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import {useState} from "react";
import {LoadingButton} from "@mui/lab";
import './buttonDissabled.css'

const GameLobby = () => {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [label, setLabel] = useState('Username');

	const formValidation = () => {
		if (!message)setLabel('Username is required')
		else {
			console.log(message)
			setLoading(!loading)
		}
	}

	return (
		<div style={{display:'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
			<Box sx={{ display: 'flex', alignItems: 'flex-end', marginBottom: 10}}>
				<AccountCircle sx={{ color: '#1976d2', mr: 1, my: 0.5 }} />
				<CustomTextField required
				                 label={label}
				                 variant="standard"
				                 value={message}
				                 onKeyPress={e => (e.key === 'Enter') ? formValidation() : null}
				                 onChange={e => setMessage(e.target.value)} />
			</Box>
			<LoadingButton
				loading={loading}
				onClick={() => formValidation()}
				loadingPosition="end"
				endIcon={<VideogameAssetIcon />}
				variant="outlined">
				{(loading) ? 'Waiting for Oponent' : 'Start Game'}
			</LoadingButton>

		</div>
	);
};

export default GameLobby;