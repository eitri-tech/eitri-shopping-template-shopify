import { Shopify } from 'shopping-shopify-template-sdk'

export const search = async params => {
	const res = await Shopify.catalog.search(params)
	return res?.data?.search
}

export const collection = async params => {
	const res = await Shopify.catalog.collection(params)
	return res?.data?.collection?.products
}
