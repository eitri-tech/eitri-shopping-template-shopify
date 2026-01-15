import cmsMock from '../mocks/cms.mock.json'
import { CmsContent } from '../types/cmscontent.type'

export const getCmsContent = async (): Promise<CmsContent | null> => {
	try {
		return cmsMock
	} catch (e) {
		console.error('Error trying get content', e)
		return null
	}
}
