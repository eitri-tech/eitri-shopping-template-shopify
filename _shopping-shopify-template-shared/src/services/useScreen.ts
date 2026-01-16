import { useState, useEffect } from 'react'
import Eitri from 'eitri-bifrost'

export default function useScreen() {
	const [availableHeight, setAvailableHeight] = useState(0)
	const [availableWidth, setAvailableWidth] = useState(0)

	useEffect(() => {
		load()
	}, [])

	useEffect(() => {
		function update() {
			setAvailableWidth(window.innerWidth)
		}

		update() // chama logo após montar
		window.addEventListener('resize', update)
		return () => window.removeEventListener('resize', update)
	}, [])

	const load = async () => {
		const configs = await Eitri.getConfigs()
		const headerHeight = document.getElementById('header-container')
		const bottom = configs?.superAppData?.safeAreaInsets?.bottom
		let _bottomValue = bottom
		if (configs?.superAppData?.platform === 'android') {
			_bottomValue = bottom / window.devicePixelRatio
		}
		setAvailableHeight(window.innerHeight - headerHeight.offsetHeight - _bottomValue)
	}

	return { availableHeight, availableWidth }
}
