import React, { createContext, useContext, useState } from 'react'
import { Cart, UpdateCartInput } from 'shopping-shopify-template-sdk'
import { addToCart, getCurrentOrCreateCart } from '../services/cartService'

type CartContext = {
	cart: Cart | null
	setCart: (arg0: Cart) => void
	cartIsLoading: boolean
	startCart: () => Promise<Cart>
	addItemToCart: (cartId: string, item: UpdateCartInput) => Promise<Cart>
}

const LocalCart = createContext<CartContext>(null)

export default function CartProvider({ children }) {
	const [cart, setCart] = useState(null)
	const [cartIsLoading, setCartInLoading] = useState(false)

	const executeCartOperation = async <Args extends any[]>(
		operation: (...args: Args) => Promise<Cart>,
		...args: Args
	): Promise<Cart | null> => {
		setCartInLoading(true)

		const newCart = await operation(...args)

		if (newCart) {
			setCart(newCart)
			return newCart
		}

		setCartInLoading(false)
		return null
	}
	const startCart = async () => {
		return executeCartOperation(getCurrentOrCreateCart)
	}

	const addItemToCart = async (cartId: string, item: UpdateCartInput) => {
		return executeCartOperation(addToCart, cartId, item)
	}

	return (
		<LocalCart.Provider
			value={{
				startCart,
				setCart,
				addItemToCart,
				cart,
				cartIsLoading
			}}>
			{children}
		</LocalCart.Provider>
	)
}
export function useLocalShoppingCart() {
	return useContext(LocalCart)
}
