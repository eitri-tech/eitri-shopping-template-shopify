// @ts-ignore
import { Text, View, Image, Button, Page } from 'eitri-luminus'
// @ts-ignore
import { HeaderContentWrapper, HeaderLogo, BottomInset } from 'shopping-shopify-template-shared'

// @ts-ignore
import { App, Shopify } from 'shopping-shopify-template-sdk'
import { useEffect, useState } from 'react'
import Eitri from 'eitri-bifrost'
import { Cart } from '../types/cart.type'
import {
	EnrichedOptions,
	Option,
	Product,
	ProductEnriched,
	ProductVariantEnriched,
	SelectedOption
} from '../types/product.type'
import MainHeader from '../components/MainHeader/MainHeader'
import ImageCarousel from '../components/ImageCarousel/ImageCarousel'
import MainDescription from '../components/MainDescription/MainDescription'
import SkuSelector from '../components/SkuSelector/SkuSelector'
import { getProductJson, resolveProduct } from '../services/productService'
import { ProductComplementaryData, ProductComplementaryDataVariant } from '../types/productComplementaryData.type'

type StartParams = {
	product: Product | null
}

export default function Home(props) {
	const [product, setProduct] = useState<ProductEnriched>()
	const [productComplementaryData, setProductComplementaryData] = useState<ProductComplementaryData>()
	const [currentVariant, setCurrentVariant] = useState<ProductVariantEnriched>()
	const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([])
	const [variantsOptions, setVariantsOptions] = useState<Option[]>([])

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
			const enrichedProduct = await resolveProduct(product)

			const selected = enrichedProduct?.variants?.nodes?.find(
				variant =>
					variant.selectedOptions.length ===
						enrichedProduct?.selectedOrFirstAvailableVariant?.selectedOptions?.length &&
					variant.selectedOptions.every(opt =>
						enrichedProduct?.selectedOrFirstAvailableVariant?.selectedOptions?.some(
							t => t.name === opt.name && t.value === opt.value
						)
					)
			)

			setCurrentVariant(selected)
			setSelectedOptions(enrichedProduct?.selectedOrFirstAvailableVariant?.selectedOptions)
			setVariantsOptions(product.options)
			setProduct(enrichedProduct)
			setMainLoading(false)
		}
	}

	const selectVariant = (option: SelectedOption) => {
		console.log('op', option)
		const newSelectedOptions = selectedOptions.map(so => {
			if (so.name === option.name) {
				return option
			}
			return so
		})

		const variantsWithThisOption = product?.variants?.nodes?.filter(variant =>
			variant.selectedOptions.some(opt => opt.name === option.name && opt.value === option.value)
		)

		const available = variantsOptions.map(option => {
			return {
				...option,
				optionValues: option.optionValues.map(value => {
					return {
						...value,
						available: variantsWithThisOption.some(variant =>
							variant.selectedOptions.some(opt => opt.name === option.name && opt.value === value.name)
						)
					}
				})
			}
		})
		// console.log('available', available)
		setVariantsOptions(available)
		setSelectedOptions(newSelectedOptions)
	}

	return (
		<Page>
			<MainHeader />

			{product && (
				<View className={'flex flex-col gap-4 p-4'}>
					<ImageCarousel product={product} />

					<MainDescription product={product} />

					<SkuSelector
						product={product}
						selectedOptions={selectedOptions}
						onSelectVariant={selectVariant}
					/>
				</View>
			)}

			<BottomInset />
		</Page>
	)
}
