import { Shopify } from 'shopping-shopify-template-sdk'
import { ProductComplementaryData } from '../types/productComplementaryData.type'
import { Product, ProductEnriched } from '../types/product.type'

export const getProductJson = async (handle: string): Promise<ProductComplementaryData> => {
	const res = await Shopify.catalog.getProductJson(handle)
	return res?.product
}

export const resolveProduct = async (product?: Product): Promise<ProductEnriched> => {
	const productComplementary = await getProductJson(product?.handle)
	product?.variants.nodes.forEach(variant => {
		const pc = productComplementary.variants.find(pc => pc.sku === variant.sku)
		if (pc) variant['product_id'] = pc.product_id
	})

	return product as ProductEnriched
}
