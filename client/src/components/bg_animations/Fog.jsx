import React, { useState, useEffect, useRef } from 'react'
import FOG from 'vanta/dist/vanta.fog.min'
import {Box} from "@mui/material";


const Fog = (props) => {
	const [vantaEffect, setVantaEffect] = useState(0)
	const myRef = useRef(null)
	useEffect(() => {
		if (!vantaEffect) {
			setVantaEffect(FOG({
				el: myRef.current,
				highlightColor: 0xc58ac,
				midtoneColor: 0x50c48,
				lowlightColor: 0x2104b6,
				baseColor: 0x8a6d7
			}))
		}
		return () => {
			if (vantaEffect) vantaEffect.destroy()
		}
	}, [vantaEffect])
	return <Box sx={{position: 'absolute', height: '100vh', width: '100vw', zIndex: '-1'}} ref={myRef}/>
}
export default Fog;