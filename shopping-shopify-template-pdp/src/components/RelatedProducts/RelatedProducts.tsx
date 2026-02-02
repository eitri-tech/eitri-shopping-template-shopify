// @ts-ignore
import { View, Text } from 'eitri-luminus'
import { useTranslation } from 'eitri-i18n'
import ProductCard from '../ProductCard/ProductCard'
import { Product } from '../../types/product.type'
import { useEffect, useState } from 'react'
import { productRecommendations } from '../../services/productService'

type RelatedProductsProps = {
	product: Product
}

export default function RelatedProducts(props: RelatedProductsProps) {
	const { product } = props
	const { t } = useTranslation()
	const [relatedProducts, setRelatedProducts] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (!product) return
		loadRelatedProducts(product?.handle)
	}, [product])

	const loadRelatedProducts = async handle => {
		try {
			setIsLoading(true)
			let relatedProducts = await productRecommendations({ productHandle: handle })
			setRelatedProducts(relatedProducts)
			return relatedProducts
		} catch (e) {
			console.log('loadRelatedProducts: Error', e)
		} finally {
			setIsLoading(false)
		}
	}

	if (!relatedProducts && !isLoading) return null

	return (
		<View className='mt-6'>
			<View className='px-4 mb-4'>
				<Text className='text-lg font-semibold'>{t('relatedProducts.title', 'Você também pode gostar')}</Text>
			</View>

			{isLoading ? (
				<View className='flex overflow-x-auto'>
					<View className='flex gap-4 px-4 py-2'>
						<View className='mt-2 min-w-[50vw] h-[388px] bg-gray-200 rounded animate-pulse' />
						<View className='mt-2 min-w-[50vw] h-[388px] bg-gray-200 rounded animate-pulse' />
						<View className='mt-2 min-w-[50vw] h-[388px] bg-gray-200 rounded animate-pulse' />
					</View>
				</View>
			) : (
				<View className='flex overflow-x-auto'>
					<View className='flex gap-4 px-4 py-2'>
						{relatedProducts.map(product => (
							<View
								className='w-[calc((100vw-32px-16px)/2)]'
								key={product.id}>
								<ProductCard product={product} />
							</View>
						))}
					</View>
				</View>
			)}
		</View>
	)
}
