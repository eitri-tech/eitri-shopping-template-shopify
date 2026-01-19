import React, { createContext, useContext, useState } from 'react'
import { Cart } from '../types/cart.type'

type CartContext = {
	cart: Cart | null
	setCart: (arg0: Cart) => void
	cartIsLoading: boolean
	startCart: () => Promise<Cart>
}

const LocalCart = createContext<CartContext>(null)

export default function CartProvider({ children }) {
	const [cart, setCart] = useState(null)
	const [cartIsLoading, setCartInLoading] = useState(false)

	const executeCartOperation = async (operation: (arg0: any) => any, ...args: undefined[]): Promise<Cart> => {
		setCartInLoading(true)
		// @ts-ignore
		const newCart = await operation(...args)
		if (newCart) {
			setCart(newCart)
			return newCart
		}
		setCartInLoading(false)
		return null
	}

	const startCart = async () => {
		// return executeCartOperation(getCart)
		return cart
	}

	return (
		<LocalCart.Provider
			value={{
				startCart,
				setCart,
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
