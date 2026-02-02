import { CmsContent, CMSPage } from '../types/cmscontent.type'
import Eitri from 'eitri-bifrost'

type RemoteConfig = {
	providerInfo: {
		cmsUrl: string
	}
}

export const getCmsContent = async (page: string = 'home'): Promise<CmsContent | null> => {
	try {
		const remoteConfig = (await Eitri.environment.getRemoteConfigs()) as RemoteConfig

		const response = await Eitri.http.get(remoteConfig.providerInfo.cmsUrl)

		const pages: CMSPage[] = response.data.docs

		let _page = pages?.find(doc => doc.type === page)

		return _page.sections as CmsContent
	} catch (e) {
		console.error('Error trying get content', e)
		return null
	}
}
