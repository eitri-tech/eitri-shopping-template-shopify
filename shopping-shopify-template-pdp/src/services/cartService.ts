import { Shopify, Cart, UpdateCartInput } from 'shopping-shopify-template-sdk'

export const getCurrentOrCreateCart = async (): Promise<Cart> => {
	const cart = await Shopify.cart.getCurrentOrCreateCart()
	console.log('cart:', cart)
	return cart
}

export const addToCart = async (cartId: string, item: UpdateCartInput): Promise<Cart> => {
	const cart = await Shopify.cart.addItemToCart(item)
	console.log('cart', cart)
	return cart
}
