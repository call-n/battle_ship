import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import {Alert} from "@mui/material";

const Portal = (props) => {
	const node = document.createElement('div');
	document.body.appendChild(node);
	return ReactDOM.createPortal(props.children, node);
}


class ErrorBoundary extends Component {
	state = {error: false}

	static getDerivedStateFromError() {return { error: true };}

	render() {
		if (this.state.error === true) return (
			<Portal>
				<Alert style={{position: 'absolute', bottom: '10px', left: '10px', zIndex: '999999',}} severity="error">Something Went Wrong - Reset page</Alert>
			</Portal>
		)
		return this.props.insideElement;
	}
}

export default ErrorBoundary;