// @ts-ignore
import { View, Page } from 'eitri-luminus'
import { BottomInset } from 'shopping-shopify-template-shared'
import { App } from 'shopping-shopify-template-sdk'
import { useEffect, useState } from 'react'
import Eitri from 'eitri-bifrost'
import { Option, Product, ProductEnriched, ProductVariantEnriched, SelectedOption } from '../types/product.type'
import MainHeader from '../components/MainHeader/MainHeader'
import ImageCarousel from '../components/ImageCarousel/ImageCarousel'
import MainDescription from '../components/MainDescription/MainDescription'
import SkuSelector from '../components/SkuSelector/SkuSelector'
import { getProductJson, resolveProduct } from '../services/productService'
import { ProductComplementaryData, ProductComplementaryDataVariant } from '../types/productComplementaryData.type'
import ActionButton from '../components/ActionButton/ActionButton'
import { useLocalShoppingCart } from '../providers/LocalCart'

type StartParams = {
	product: Product | null
}

export default function Home(props) {
	const [product, setProduct] = useState<ProductEnriched>()
	const [productComplementaryData, setProductComplementaryData] = useState<ProductComplementaryData>()
	const [currentVariant, setCurrentVariant] = useState<ProductVariantEnriched>()
	const [selectedVariantOptions, setSelectedVariantOptions] = useState<SelectedOption[]>([])
	const [variantsOptions, setVariantsOptions] = useState<Option[]>([])

	const [mainLoading, setMainLoading] = useState<Boolean>(true)

	const { startCart } = useLocalShoppingCart()

	useEffect(() => {
		window.scroll(0, 0)

		startHome()

		startCart()

		Eitri.navigation.setOnResumeListener(() => {
			startCart()
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
			setSelectedVariantOptions(enrichedProduct?.selectedOrFirstAvailableVariant?.selectedOptions)
			setVariantsOptions(
				product.options.map(opt => {
					return {
						...opt,
						optionValues: opt?.optionValues?.map(optV => {
							return {
								...optV,
								available: true
							}
						})
					}
				})
			)
			setProduct(enrichedProduct)
			setMainLoading(false)
		}
	}

	const selectVariant = (option: SelectedOption) => {
		const newSelectedOptions = selectedVariantOptions.map(so => {
			if (so.name === option.name) {
				return option
			}
			return so
		})

		const variantsWithThisOption = product?.variants?.nodes?.filter(variant =>
			variant.selectedOptions.some(opt => opt.name === option.name && opt.value === option.value)
		)

		const variantsOptionsAvailability = variantsOptions.map(vOption => {
			return {
				...vOption,
				optionValues: vOption.optionValues.map(oValue => {
					return {
						...oValue,
						available:
							vOption.name === option.name
								? true
								: variantsWithThisOption.some(variant =>
										variant.selectedOptions.some(
											opt => opt.name === vOption.name && opt.value === oValue.name
										)
									)
					}
				})
			}
		})

		const selected = product?.variants?.nodes?.find(
			variant =>
				variant.selectedOptions.length === newSelectedOptions?.length &&
				variant.selectedOptions.every(opt =>
					newSelectedOptions?.some(t => t.name === opt.name && t.value === opt.value)
				)
		)

		setCurrentVariant(selected)
		setVariantsOptions(variantsOptionsAvailability)
		setSelectedVariantOptions(newSelectedOptions)
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
						variantsOptions={variantsOptions}
						selectedVariantOptions={selectedVariantOptions}
						onSelectVariant={selectVariant}
					/>

					<ActionButton currentVariant={currentVariant} />
				</View>
			)}

			<BottomInset />
		</Page>
	)
}
