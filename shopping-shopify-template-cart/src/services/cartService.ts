import { Shopify, Cart, UpdateCartInput, CartLineUpdateInput } from 'shopping-shopify-template-sdk'

export const getCurrentOrCreateCart = async (): Promise<Cart> => {
	const cart = await Shopify.cart.getCurrentOrCreateCart()
	return cart
}

export const addToCart = async (item: UpdateCartInput): Promise<Cart> => {
	const res = await Shopify.cart.addItemToCart(item)
	return res.cart
}

export const updateCartLines = async (lines: CartLineUpdateInput[]): Promise<Cart> => {
	const res = await Shopify.cart.updateCartLines(lines)
	return res.cart
}

export const removeItemFromCart = async (lines: string[]): Promise<Cart> => {
	const res = await Shopify.cart.removeItemFromCart(lines)
	return res.cart
}
