import { Shopify, ProductsConnection, SearchQueryArguments } from 'shopping-shopify-template-sdk'

export const search = async params => {
	const res = await Shopify.catalog.search(params)
	return res?.data?.search
}

export const collection = async params => {
	const res = await Shopify.catalog.collection(params)
	return res?.products
}

export interface ProductSearchParams {
	handle?: string
	type?: 'collection' | 'search'
	after?: string
	filters?: any[]
	sortKey?: 'BEST_SELLING' | 'COLLECTION_DEFAULT' | 'CREATED' | 'ID' | 'MANUAL' | 'PRICE' | 'RELEVANCE' | 'TITLE'
	reverse?: boolean
}

export const getProductsService = async (params: ProductSearchParams): Promise<ProductsConnection> => {
	if (params.type === 'collection') {
		const res = await Shopify.catalog.collection(params)
		return res?.products
	}

	const { productFilters, ...rest } = await Shopify.catalog.search(params as SearchQueryArguments)

	return {
		...rest,
		filters: productFilters
	}
}

export const predictiveSearch = async (productId: string): Promise<any> => {}
