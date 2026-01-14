import { Cart, CartResponse } from '../models/Cart'
import { GET_CART } from '../queries/get-cart.gql'
import Eitri from 'eitri-bifrost'

export class CartService {
	static async getCart(cartId: string): Promise<Cart> {
		const { cart } = await shopifyFetch<CartResponse>(GET_CART, { cartId })
		return cart
	}
}

const shopifyFetch = async <T = unknown>(query: string, variables = {}): Promise<T> => {
	const remoteConfig = (await Eitri.environment.getRemoteConfigs()) as {
		shopifyConfigs: {
			domain: string
			storefrontAccessToken: string
		}
	}

	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Storefront-Access-Token': remoteConfig.shopifyConfigs.storefrontAccessToken
			}
		}

		const response = await Eitri.http.post(
			`https://${remoteConfig.shopifyConfigs.domain}/api/2026-01/graphql.json`,
			{ query, variables },
			config
		)

		const { data } = response.data

		return data
	} catch (error) {
		console.error('Shopify API Error:', error)
		throw new Error(error.message)
	}
}
