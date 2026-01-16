import { Shopify } from 'shopping-shopify-template-sdk'

export const search = async params => {
	const res = await Shopify.catalog.search(params)
	return res?.data?.search
}
