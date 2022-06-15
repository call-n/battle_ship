import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import GameContextProvider from './contexts/GameContextProvider'
import App from './components/app/App'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(
	<BrowserRouter>
		<GameContextProvider>
			<App/>
		</GameContextProvider>
	</BrowserRouter>
);