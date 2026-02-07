import { Shopify, ProductRecommendationsInput, Product } from 'shopping-shopify-template-sdk'

export const productRecommendations = async (item: ProductRecommendationsInput): Promise<Product[]> => {
	try {
		const res = await Shopify.catalog.productRecommendations(item)
		return res
	} catch (e) {
		console.log('error on productRecommendations', e)
	}
}

export const getProduct = async (handle: string): Promise<Product[]> => {
	try {
		const res = await Shopify.catalog.product({ handle })
		return res
	} catch (e) {
		console.log('error on productRecommendations', e)
	}
}
