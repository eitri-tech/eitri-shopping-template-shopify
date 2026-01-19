// @ts-ignore
import { Text, View, Image, Button, Page } from 'eitri-luminus'
// @ts-ignore
import { HeaderContentWrapper, HeaderLogo, BottomInset } from 'shopping-shopify-template-shared'

// @ts-ignore
import { App, Shopify } from 'shopping-shopify-template-sdk'
import { useEffect, useState } from 'react'
import Eitri from 'eitri-bifrost'
import { Cart } from '../types/cart.type'
import { Product } from '../types/product.type'
import MainHeader from '../components/MainHeader/MainHeader'
import ImageCarousel from '../components/ImageCarousel/ImageCarousel'
import MainDescription from '../components/MainDescription/MainDescription'

type StartParams = {
	product: Product | null
}

export default function Home(props) {
	const [product, setProduct] = useState<Product>()
	const [mainLoading, setMainLoading] = useState<Boolean>(true)

	useEffect(() => {
		window.scroll(0, 0)

		startHome()

		Eitri.navigation.setOnResumeListener(() => {
			startHome()
		})
	}, [])

	const startHome = async () => {
		await App.configure({ verbose: false })

		const startParams: StartParams = (await Eitri.getInitializationInfos()) as StartParams

		let product = startParams.product
		if (product) {
			setProduct(product)
			setMainLoading(false)
		}
	}

	return (
		<Page>
			<MainHeader />

			{product && (
				<View>
					<ImageCarousel product={product} />

					<MainDescription product={product} />
				</View>
			)}
		</Page>
	)
}
