import React, { useState, useEffect, useRef } from 'react'
import WAVES from 'vanta/dist/vanta.waves.min'
import {Box} from "@mui/material";


const Wave = (props) => {
	const [vantaEffect, setVantaEffect] = useState(0)
	const myRef = useRef(null)
	useEffect(() => {
		if (!vantaEffect) {
			setVantaEffect(WAVES({
				el: myRef.current,
				mouseControls: false,
				color: 0x142a,
			}))
		}
		return () => {
			if (vantaEffect) vantaEffect.destroy()
		}
	}, [vantaEffect])
	return <Box sx={{position: 'absolute', height: '100vh', width: '100vw' ,zIndex: '-1'}} ref={myRef}/>
}
export default Wave;