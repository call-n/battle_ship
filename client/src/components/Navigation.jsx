
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import { Link} from 'react-router-dom'

const Navigation = () => {
	return (
		<Navbar>
			<Container>
				<Navbar.Brand as={Link} to="/"  style={{color: 'white'}}>Battle_Ship</Navbar.Brand>
			</Container>
		</Navbar>
	)
}

export default Navigation