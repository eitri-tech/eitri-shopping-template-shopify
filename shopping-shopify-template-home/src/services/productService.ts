import { Shopify, ProductsConnection, SearchQueryArguments, CollectionReturn } from 'eitri-shopping-shopify-shared'
import { ActionType, SortKey } from '../types/cmscontent.type'

export const search = async params => {
	const res = await Shopify.catalog.search(params)
	return res?.data?.search
}

export const collection = async (params: ProductSearchParams): Promise<CollectionReturn> => {
	return await Shopify.catalog.collection(params)
}

export interface ProductSearchParams {
	handle?: string
	type?: ActionType
	after?: string
	filters?: any[]
	sortKey?: SortKey
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
