import { Shopify, Cart, UpdateCartInput } from 'eitri-shopping-shopify-shared'

export const getCurrentOrCreateCart = async (): Promise<Cart> => {
	const cart = await Shopify.cart.getCurrentOrCreateCart()
	return cart
}

export const addToCart = async (item: UpdateCartInput): Promise<Cart> => {
	const res = await Shopify.cart.addItemToCart(item)
	return res.cart
}
