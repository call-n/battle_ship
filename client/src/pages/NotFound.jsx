import {Container, Typography} from "@mui/material";

const NotFound = () => <Container
	children={<Typography variant='h3' sx={{textAlign: 'center', mt: '40vh'}} children={'Sorry, that page could not be found 😔'}/>}/>

export default NotFound