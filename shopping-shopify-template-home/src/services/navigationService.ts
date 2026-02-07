import Eitri from 'eitri-bifrost'

export const openProduct = product => {
	try {
		Eitri.nativeNavigation.open({
			slug: 'pdp',
			initParams: { product }
		})
	} catch (e) {
		console.error('navigate to PDP: Error trying to open PDP', e)
	}
}

export const openProductByHandle = (handle: string) => {
	try {
		Eitri.nativeNavigation.open({
			slug: 'pdp',
			initParams: { handle }
		})
	} catch (e) {
		console.error('navigate to PDP: Error trying to open PDP', e)
	}
}
