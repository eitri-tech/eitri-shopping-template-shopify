// @ts-ignore
import { Text, View, Image, Button, Page } from 'eitri-luminus'
import { useEffect, useState } from 'react'
import { HeaderContentWrapper, HeaderLogo, BottomInset, HeaderCart } from 'shopping-shopify-template-shared'
import { getCmsContent } from '../services/cmsService'
import CmsContentRender from '../components/CmsContentRender/CmsContentRender'
import { CmsContent } from '../types/cmscontent.type'
import { App, Shopify } from 'shopping-shopify-template-sdk'
import { search } from '../services/productService'
import Eitri from 'eitri-bifrost'
import { FiSearch } from 'react-icons/fi'
import { useLocalShoppingCart } from '../providers/LocalCart'
import MainHeader from '../components/MainHeader/MainHeader'

export default function Home(props) {
	const [cmsContent, setCmsContent] = useState<CmsContent>()

	const { cart, startCart } = useLocalShoppingCart()

	useEffect(() => {
		start()
	}, [])

	const start = async () => {
		await App.configure({ verbose: false })

		await Eitri.navigation.navigate({ path: "/Signin" })

		startCart()

		const startParams = await Eitri.getInitializationInfos()

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
			<MainHeader cart={cart} />
			<View>
				<CmsContentRender cmsContent={cmsContent} />
			</View>
			<BottomInset />\
		</Page>
	)
}
