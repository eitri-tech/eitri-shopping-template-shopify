import React, { createContext, useContext, useState } from 'react'
import { Cart, UpdateCartInput, CartLineUpdateInput } from 'shopping-shopify-template-sdk'
import { addToCart, getCurrentOrCreateCart, removeItemFromCart, updateCartLines } from '../services/cartService'

type CartContext = {
	cart: Cart | null
	setCart: (arg0: Cart) => void
	cartIsLoading: boolean
	startCart: () => Promise<Cart>
	addItemToCart: (item: UpdateCartInput) => Promise<Cart>
	updateCartLines: (lines: CartLineUpdateInput[]) => Promise<Cart>
	removeItemFromCart: (lines: string[]) => Promise<Cart>
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

	const addItemToCart = async (item: UpdateCartInput) => {
		return executeCartOperation(addToCart, item)
	}

	const _updateCartLines = async (lines: CartLineUpdateInput[]) => {
		return executeCartOperation(updateCartLines, lines)
	}

	const _removeItemFromCart = async (lines: string[]) => {
		return executeCartOperation(removeItemFromCart, lines)
	}

	return (
		<LocalCart.Provider
			value={{
				startCart,
				setCart,
				addItemToCart,
				updateCartLines: _updateCartLines,
				removeItemFromCart: _removeItemFromCart,
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
