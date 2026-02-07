// @ts-ignore
import { View, Page } from 'eitri-luminus'
import { BottomInset } from 'shopping-shopify-template-shared'
import { App } from 'shopping-shopify-template-sdk'
import { useEffect, useState } from 'react'
import Eitri from 'eitri-bifrost'
import { OptionWithAvailable, Product, ProductVariant, SelectedOption } from '../types/product.type'
import MainHeader from '../components/MainHeader/MainHeader'
import ImageCarousel from '../components/ImageCarousel/ImageCarousel'
import MainDescription from '../components/MainDescription/MainDescription'
import SkuSelector from '../components/SkuSelector/SkuSelector'
import ActionButton from '../components/ActionButton/ActionButton'
import { useLocalShoppingCart } from '../providers/LocalCart'
import Description from '../components/Description/Description'
import RelatedProducts from '../components/RelatedProducts/RelatedProducts'
import { getProduct } from '../services/productService'

type StartParams = {
	product: Product | null
	handle: string | null
	id: string | null
}

export default function Home(props) {
	const [product, setProduct] = useState<Product>()
	const [currentVariant, setCurrentVariant] = useState<ProductVariant>()
	const [selectedVariantOptions, setSelectedVariantOptions] = useState<SelectedOption[]>([])
	const [variantsOptions, setVariantsOptions] = useState<OptionWithAvailable[]>([])

	const [mainLoading, setMainLoading] = useState<Boolean>(true)

	const { startCart } = useLocalShoppingCart()

	useEffect(() => {
		window.scroll(0, 0)

		startHome()

		Eitri.navigation.setOnResumeListener(startCart)
	}, [])

	const startHome = async () => {
		await App.configure({ verbose: false })

		startCart()

		const startParams: StartParams = (await Eitri.getInitializationInfos()) as StartParams

		let product = startParams.product

		if (product) {
			const selectedOptions = product?.selectedOrFirstAvailableVariant?.selectedOptions
			const selectedVariant = getSelectedVariant(selectedOptions, product)

			const optionsWithAvailability = product?.options?.map<OptionWithAvailable>(opt => {
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

			setCurrentVariant(selectedVariant)
			setSelectedVariantOptions(selectedOptions)
			setVariantsOptions(optionsWithAvailability)
			setProduct(product)
			setMainLoading(false)
		} else if (startParams.handle) {
			const _product = await getProduct(startParams.handle)
			console.log('p', _product)
		}
	}

	const getSelectedVariant = (selectedOptions: SelectedOption[], product: Product): ProductVariant | null => {
		return product?.variants?.nodes?.find(variant =>
			variant.selectedOptions.every(opt =>
				selectedOptions?.some(t => t.name === opt.name && t.value === opt.value)
			)
		)
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

		const selectedVariant = getSelectedVariant(newSelectedOptions, product)

		setCurrentVariant(selectedVariant)
		setVariantsOptions(variantsOptionsAvailability)
		setSelectedVariantOptions(newSelectedOptions)
	}

	return (
		<Page>
			<MainHeader />

			{product && (
				<View>
					<ImageCarousel product={product} />

					<View className={'flex flex-col gap-6 mt-5'}>
						<MainDescription product={product} />

						<SkuSelector
							product={product}
							variantsOptions={variantsOptions}
							selectedVariantOptions={selectedVariantOptions}
							onSelectVariant={selectVariant}
						/>

						<Description product={product} />

						<RelatedProducts product={product} />
					</View>

					<ActionButton currentVariant={currentVariant} />
				</View>
			)}

			<BottomInset />
		</Page>
	)
}
