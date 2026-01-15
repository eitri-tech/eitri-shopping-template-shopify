// @ts-ignore
import { Text, View, Image, Button, Page } from 'eitri-luminus'
import { useEffect, useState } from 'react'
// @ts-ignore
import { HeaderContentWrapper, HeaderLogo } from 'shopping-shopify-template-shared'
import { getCmsContent } from '../services/cmsService'
import CmsContentRender from '../components/CmsContentRender/CmsContentRender'
import { CmsContent } from '../types/cmscontent.type'

export default function Home(props) {
	const [cmsContent, setCmsContent] = useState<CmsContent>()

	useEffect(() => {
		start()
	}, [])

	const start = async () => {
		const _csmContent = await getCmsContent()
		setCmsContent(_csmContent)
	}

	return (
		<Page title='Home'>
			<HeaderContentWrapper>
				<HeaderLogo />
			</HeaderContentWrapper>
			<View>
				<CmsContentRender cmsContent={cmsContent} />
			</View>
		</Page>
	)
}
