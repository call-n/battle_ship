import {useEffect, useState} from 'react'
import {useGameContext} from '../contexts/GameContextProvider'
import {useNavigate} from 'react-router-dom'
import {AccountCircle} from "@mui/icons-material";
import {Box, Chip, Container, List, ListItem, ListItemButton, ListItemText, TextField} from "@mui/material";
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import VideogameAssetOffIcon from '@mui/icons-material/VideogameAssetOff';

const Lobby = () => {
	const {setGameUsername, socket} = useGameContext();
	const [roomList, setRoomList] = useState([]);

	useEffect(() => {
		console.log("Requesting room list from server...");

		socket.emit('get-room-list', rooms => setRoomList(rooms));

		// this is just to update the client for possible full rooms
		socket.on('check4gamers', () => socket.emit('get-room-list', rooms => setRoomList(rooms)));

		return () => {
			console.log("Running cleanup");
			// stop listening to events
			socket.off('check4gamers');
		};

	}, [socket]);

	// RENDER HTML
	return <RoomWindow roomList={roomList} setGameUsername={setGameUsername}/>
}
const RoomWindow = ({roomList, setGameUsername}) => {
	// STATES
	const [username, setUsername] = useState('');
	// ROUTES
	const navigate = useNavigate();

	// RENDER HTML
	return (<div className='lobby'>
		<Container sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
			{/*INPUT*/}
			<Box sx={{display: 'flex', alignItems: 'flex-end', marginBottom: 10}}>
				<AccountCircle sx={{color: '#1976d2', mr: 1, my: 0.5}}/>
				<TextField required
				           inputProps={{style: {color: '#fff'}}}
				           InputLabelProps={{style: {color: '#1976d2'}}}
				           label={'Username'}
				           variant="standard"
				           value={username}
				           onChange={({target}) => setUsername(target.value)}/>
			</Box>

			{/* LOBBY ROOMS */}
			<Box>
				<List sx={{width: '100%', minWidth: 320, bgcolor: 'rgba(26,32,47,0.6)'}}>
					{roomList.map(({id, joinable, name, users}) => <ListItem
						disablePadding
						key={id}
						disabled={!(joinable && username.length > 1)}
						onClick={() => {
							setGameUsername(username);
							navigate(`/rooms/${id}`);
						}}>
						<ListItemButton children={<ListItemText
							secondaryTypographyProps={{style: {color: '#1976d2'}}}
							primary={name}
							secondary={`${Object.values(users).join(' vs ')} `}/>}/>
						<Chip sx={{height: 24, mr: 1}} label={joinable ? 'Joinable' : 'Full'} color="primary"  icon={joinable ? <VideogameAssetIcon/> : <VideogameAssetOffIcon/>}/>
					</ListItem>)}
				</List>
			</Box>
		</Container>
	</div>)
}

export default Lobby