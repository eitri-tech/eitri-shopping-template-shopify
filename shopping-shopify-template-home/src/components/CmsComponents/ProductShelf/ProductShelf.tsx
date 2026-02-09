import { useEffect, useState } from 'react'
import Eitri from 'eitri-bifrost'
// @ts-ignore
import { View } from 'eitri-luminus'
import { ProductShelfContent } from '../../../types/cmscontent.type'
import { collection, getProductsService, search } from '../../../services/productService'
import ProductCard from '../../ProductCard/ProductCard'
import { title } from '_shopping-shopify-template-sdk/eitri-app.conf'

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

	const seeMore = async () => {
		const params = {
			type: data?.params.type,
			handle: data?.params?.value
		}

		await Eitri.navigation.navigate({ path: 'ProductCatalog', state: { params,title: data?.title } })
	}

	return (
		<View>
			<View className={'flex justify-between px-4'}>
				<View className='text-xl font-bold mb-4 '>{data?.title}</View>
				<View onClick={seeMore}>Ver tudo</View>
			</View>
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
