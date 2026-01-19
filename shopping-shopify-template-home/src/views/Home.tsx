// @ts-ignore
import { Text, View, Image, Button, Page } from 'eitri-luminus'
import { useEffect, useState } from 'react'
// @ts-ignore
import { HeaderContentWrapper, HeaderLogo, BottomInset } from 'shopping-shopify-template-shared'
import { getCmsContent } from '../services/cmsService'
import CmsContentRender from '../components/CmsContentRender/CmsContentRender'
import { CmsContent } from '../types/cmscontent.type'
// @ts-ignore
import { App, Shopify } from 'shopping-shopify-template-sdk'
import { search } from '../services/productService'
import Eitri from 'eitri-bifrost'

export default function Home(props) {
	const [cmsContent, setCmsContent] = useState<CmsContent>()

	useEffect(() => {
		start()
	}, [])

	const start = async () => {
		await App.configure({ verbose: false })

		const startParams = await Eitri.getInitializationInfos()
		console.log('startParams', startParams)
		if (startParams) {
			const openRoute = processDeepLink(startParams)
			if (openRoute) {
				Eitri.navigation.navigate({ ...openRoute })
				return
			}
		}

		const _csmContent = await getCmsContent()
		setCmsContent(_csmContent)
	}

	const processDeepLink = startParams => {
		if (startParams?.route) {
			console.log('Deeplink', startParams)
			let { route, ...rest } = startParams
			return {
				path: route,
				state: rest,
				replace: true
			}
		}
		const tabIndex = startParams?.tabIndex
		if (tabIndex || (typeof tabIndex === 'number' && tabIndex >= 0)) {
			const parsedTabIndex = parseInt(tabIndex)

			if (parsedTabIndex === 2) {
				return { replace: true, path: '/Cart' }
			}
		}
	}

	return (
		<Page title='Home'>
			<HeaderContentWrapper>
				<HeaderLogo />
			</HeaderContentWrapper>
			<View>
				<CmsContentRender cmsContent={cmsContent} />
			</View>

			<BottomInset />
			{/*<Button*/}
			{/*	className='btn btn-primary w-full text-lg py-3'*/}
			{/*	onClick={() => {*/}
			{/*		Eitri.navigation.navigate({ path: '/Cart' })*/}
			{/*	}}>*/}
			{/*	Carrinho*/}
			{/*</Button>*/}
		</Page>
	)
}
