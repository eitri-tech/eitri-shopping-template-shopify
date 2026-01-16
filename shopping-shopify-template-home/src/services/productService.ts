import { Shopify } from 'shopping-shopify-template-sdk'

export const search = async params => {
	const res = await Shopify.catalog.search(params)

	const values = res?.data?.search

	return {
		values,
		nodes: values?.edges?.reduce(edge => {
			return [...edge, edge.node]
		}, [])
	}
}
