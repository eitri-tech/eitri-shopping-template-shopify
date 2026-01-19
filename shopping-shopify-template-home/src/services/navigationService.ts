import Eitri from 'eitri-bifrost'

export const openProduct = async product => {
	try {
		Eitri.nativeNavigation.open({
			slug: 'pdp',
			initParams: { product }
		})
	} catch (e) {
		console.error('navigate to PDP: Error trying to open PDP', e)
	}
}
