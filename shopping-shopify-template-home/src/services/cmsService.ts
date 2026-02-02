import cmsMock from '../mocks/cms.mock.json'
import cmsCategoryMock from '../mocks/cms.categories.mock.json'
import { CmsContent } from '../types/cmscontent.type'

export const getCmsContent = async (page: string): Promise<CmsContent | null> => {
	try {
		if (page === 'categories') {
			return cmsCategoryMock
		}

		return cmsMock
	} catch (e) {
		console.error('Error trying get content', e)
		return null
	}
}
