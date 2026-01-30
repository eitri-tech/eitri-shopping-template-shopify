import { useEffect, useState } from 'react'
// @ts-ignore
import { View } from 'eitri-luminus'
import { ProductShelfContent } from '../../../types/cmscontent.type'
import { collection, getProductsService, search } from '../../../services/productService'
import ProductCard from '../../ProductCard/ProductCard'

interface ProductShelfProps {
	data: ProductShelfContent
}

export default function ProductShelf({ data }: ProductShelfProps) {
	const [isLoadingProducts, setIsLoadingProducts] = useState(false)
	const [products, setProducts] = useState([])

	useEffect(() => {
		executeProductSearch()
	}, [])

	const executeProductSearch = async () => {
		try {
			setIsLoadingProducts(true)

			const results = await getProductsService({ type: data?.params?.type, handle: data?.params?.value })
			setProducts(results.nodes)

			setIsLoadingProducts(false)
		} catch (e) {
			console.log('error', e)
		}
	}

	return (
		<View>
			<>
				{isLoadingProducts ? (
					<View className='flex overflow-x-auto'>
						<View className='flex gap-4 px-4 py-2'>
							<View className='mt-2 min-w-[50vw] h-[388px] bg-gray-200 rounded animate-pulse' />
							<View className='mt-2 min-w-[50vw] h-[388px] bg-gray-200 rounded animate-pulse' />
							<View className='mt-2 min-w-[50vw] h-[388px] bg-gray-200 rounded animate-pulse' />
						</View>
					</View>
				) : (
					<View className='flex overflow-x-auto'>
						<View className='flex gap-4 px-4'>
							{products.map(product => (
								<View
									key={product.id}
									className='w-[calc((100vw-32px-16px)/2)]'>
									<ProductCard
										key={product.id}
										product={product}
									/>
								</View>
							))}
						</View>
					</View>
				)}
			</>
		</View>
	)
}
