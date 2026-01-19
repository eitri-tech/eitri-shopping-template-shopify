import { useEffect, useState } from 'react'
// @ts-ignore
import { View } from 'eitri-luminus'
import { ProductShelfContent } from '../../../types/cmscontent.type'
import { collection, search } from '../../../services/productService'
import ProductCard from '../../ProductCard/ProductCard'

interface ProductShelfProps {
	data: ProductShelfContent
}

export default function ProductShelf({ data }: ProductShelfProps) {
	const [currentProducts, setCurrentProducts] = useState([])
	const [isLoadingProducts, setIsLoadingProducts] = useState(false)
	const [searchParams, setSearchParams] = useState()
	const [products, setProducts] = useState([])

	useEffect(() => {
		executeProductSearch()
	}, [])

	const executeProductSearch = async () => {
		try {
			setIsLoadingProducts(true)

			const results = await collection({ handle: 'homem' })
			setProducts(results.nodes)

			// const params = {
			// 	facets: data.facets || [],
			// 	query: data.term ?? '',
			// 	sort: data.sort ?? '',
			// 	to: data.numberOfItems || 8
			// }
			//
			// const result = await getProductsService(params)
			// if (result) {
			// 	setCurrentProducts(result.products)
			// 	setSearchParams({ facets: data?.facets, ...params })
			// }
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
