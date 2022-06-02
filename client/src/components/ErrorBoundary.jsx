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

	static getDerivedStateFromError() {return {error: true};}

	render() {
		if (this.state.error === true) return <Portal
			children={<Alert sx={{position: 'absolute', bottom: '10px', left: '10px', zIndex: '999999', bgcolor: 'rgba(47,26,26,0.7)', color: '#fff'}}
			                 severity="error" children={'Something Went Wrong - Reset page'}/>}/>
		return this.props.insideElement;
	}
}

export default ErrorBoundary;