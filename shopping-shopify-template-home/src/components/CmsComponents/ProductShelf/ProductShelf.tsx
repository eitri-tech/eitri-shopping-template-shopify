import { useEffect, useState } from 'react'
// @ts-ignore
import { View } from 'eitri-luminus'
import { ProductShelfContent } from '../../../types/cmscontent.type'
import { search } from '../../../services/productService'

interface ProductShelfProps {
	data: ProductShelfContent
}

export default function ProductShelf({ data }: ProductShelfProps) {
	const [currentProducts, setCurrentProducts] = useState([])
	const [isLoadingProducts, setIsLoadingProducts] = useState(false)
	const [searchParams, setSearchParams] = useState()

	useEffect(() => {
		executeProductSearch()
	}, [])

	const executeProductSearch = async () => {
		setIsLoadingProducts(true)

		await search({ query: 'Camisa', first: 1 })

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
	}

	return <View></View>
}
