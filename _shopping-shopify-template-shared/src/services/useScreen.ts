import { useState, useEffect } from 'react'
import Eitri from 'eitri-bifrost'

export default function useScreen() {
	const [dimens, setDimens] = useState({
		availableHeight: 0
	})

	useEffect(() => {
		load()
	}, [])

	const load = async () => {
		const configs = await Eitri.getConfigs()
		const headerHeight = document.getElementById('header-container')
		const bottom = configs?.superAppData?.safeAreaInsets?.bottom
		let _bottomValue = bottom
		if (configs?.superAppData?.platform === 'android') {
			_bottomValue = bottom / window.devicePixelRatio
		}
		setDimens({
			...dimens,
			availableHeight: window.innerHeight - headerHeight.offsetHeight - _bottomValue
		})
	}

	return dimens
}
