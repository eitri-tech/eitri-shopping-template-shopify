import { useEffect, useState } from 'react'
// @ts-ignore
import { View } from 'eitri-luminus'

export default function ProductShelf(props) {
	const { data } = props

	const [currentProducts, setCurrentProducts] = useState([])
	const [isLoadingProducts, setIsLoadingProducts] = useState(false)
	const [searchParams, setSearchParams] = useState()

	// useEffect(() => {
	// 	executeProductSearch()
	// }, [])

	// const executeProductSearch = async () => {
	// 	setIsLoadingProducts(true)
	//
	// 	const params = {
	// 		facets: data.facets || [],
	// 		query: data.term ?? '',
	// 		sort: data.sort ?? '',
	// 		to: data.numberOfItems || 8
	// 	}
	//
	// 	const result = await getProductsService(params)
	// 	if (result) {
	// 		setCurrentProducts(result.products)
	// 		setSearchParams({ facets: data?.facets, ...params })
	// 	}
	// 	setIsLoadingProducts(false)
	// }

	return <View></View>
}
