import Bokeh from "./components/bokeh/Bokeh";
import {Container} from "@mui/material";
import GameLobby from "./components/gameLobby/GameLobby";
import ErrorBoundary from "./components/errorBoundary/ErrorBoundary";
import Battlefield from "./components/battlefield/Battlefield";

function App() {
	return (
		<>
			<Container>
				{/*GameLobby*/}
				<ErrorBoundary insideElement={<GameLobby/>}/>

				{/*Battlefield*/}
				<ErrorBoundary insideElement={<Battlefield/>}/>
			</Container>

			{/*Bokeh aka blured balls on the background*/}
			<Bokeh/>
		</>
	);
}

export default App;
