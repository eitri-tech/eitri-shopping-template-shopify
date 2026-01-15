// @ts-ignore
import { Text, View, Image, Button, Page } from 'eitri-luminus'
import { useEffect, useState } from 'react'
// @ts-ignore
import { HeaderContentWrapper, HeaderLogo } from 'shopping-shopify-template-shared'
import { getCmsContent } from '../services/cmsService'
import CmsContentRender from '../components/CmsContentRender/CmsContentRender'
import { CmsContent } from '../types/cmscontent.type'
import Eitri from 'eitri-bifrost'

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
            <Button
                className='btn btn-primary w-full text-lg py-3'
                onClick={() => {
                    Eitri.navigation.navigate({ path: '/Cart' })
                }}>
                Carrinho
            </Button>
		</Page>
	)
}
