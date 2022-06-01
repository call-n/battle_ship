
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import { Link} from 'react-router-dom'

const Navigation = () => {
	return (
		<Navbar variant='dark' style={{background: 'transparent'}}>
			<Container>
				<Navbar.Brand as={Link} to="/">Battle_Ship</Navbar.Brand>
			</Container>
		</Navbar>
	)
}

export default Navigation