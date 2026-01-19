import { Cart, CartResponse, CreateCartInput, UpdateCartInput, CartLineUpdateInput } from '../../models/Cart'
import ShopifyCaller from '../_helpers/ShopifyCaller'
import {
	GET_CART,
	CREATE_CART,
	CART_ADD_ITEM,
	CART_LINES_UPDATE,
	CART_LINES_REMOVE,
	CART_GIFT_CARD_CODES_ADD,
	CART_GIFT_CARD_CODES_REMOVE,
	CART_DISCOUNT_CODES_UPDATE
} from '../../graphql/queries/cart.queries.gql'
import StorageService from '../StorageService'
import Logger from '../_helpers/Logger'

export class CartService {
	static SHOPIFY_CART_KEY = 'shopify_cart_key'
	static async getCurrentOrCreateCart() {
		const cartId = await StorageService.getStorageItem(CartService.SHOPIFY_CART_KEY)

		if (cartId) {
			return CartService.getCartById(cartId)
		} else {
			return CartService.generateNewCart({})
		}
	}

	static async getCartById(cartId: string, personalizedQuery?: string): Promise<Cart> {
		const body = {
			query: personalizedQuery || GET_CART,
			variables: {
				cartId
			}
		}

		const res = await ShopifyCaller.post(body)
		Logger.log('[CartService] Carrinho carregado:', cartId)

		const { data } = res.data as { data: CartResponse }

		return data.cart
	}

	static async generateNewCart(params: CreateCartInput) {
		const body = {
			query: CREATE_CART,
			variables: {
				input: params
			}
		}

		const res = await ShopifyCaller.post(body)
		Logger.log('[CartService] Novo carrinho criado')
		const { data } = res.data as { data: { cartCreate: CartResponse } }

		const cart = data.cartCreate.cart
		await CartService.saveCartIdOnStorage(cart.id)

		return cart
	}

	static async addItemToCart(cartId: string, item: UpdateCartInput) {
		const body = {
			query: CART_ADD_ITEM,
			variables: {
				cartId,
				lines: [item]
			}
		}

		Logger.log('[CartService] Adicionando item ao carrinho:', item.merchandiseId)

		const res = await ShopifyCaller.post(body)
		Logger.log('[CartService] Item adicionado com sucesso')

		const { data } = res.data as { data: unknown }

		return data
	}

	static async updateCartLines(cartId: string, lines: CartLineUpdateInput[]) {
		const body = {
			query: CART_LINES_UPDATE,
			variables: {
				cartId,
				lines
			}
		}

		Logger.log('[CartService] Atualizando linhas do carrinho:', lines.length, 'item(s)')

		const res = await ShopifyCaller.post(body)
		Logger.log('[CartService] Linhas atualizadas com sucesso')

		const { data } = res.data as { data: unknown }

		return data
	}

	static async removeItemFromCart(cartId: string, lineIds: string[]) {
		const body = {
			query: CART_LINES_REMOVE,
			variables: {
				cartId,
				lineIds
			}
		}

		Logger.log('[CartService] Removendo itens do carrinho:', lineIds.length, 'item(s)')

		const res = await ShopifyCaller.post(body)
		Logger.log('[CartService] Itens removidos com sucesso')

		const { data } = res.data as { data: unknown }

		return data
	}

	static async addGiftCardCode(cartId: string, giftCardCodes: string[]) {
		const body = {
			query: CART_GIFT_CARD_CODES_ADD,
			variables: {
				cartId,
				giftCardCodes
			}
		}

		Logger.log('[CartService] Adicionando gift card(s):', giftCardCodes.join(', '))

		const res = await ShopifyCaller.post(body)
		Logger.log('[CartService] Gift card(s) adicionado(s) com sucesso')

		const { data } = res.data as { data: unknown }

		return data
	}

	static async removeGiftCardCode(cartId: string, appliedGiftCardIds: string[]) {
		const body = {
			query: CART_GIFT_CARD_CODES_REMOVE,
			variables: {
				cartId,
				appliedGiftCardIds
			}
		}

		Logger.log('[CartService] Removendo gift card(s):', appliedGiftCardIds.join(', '))

		const res = await ShopifyCaller.post(body)
		Logger.log('[CartService] Gift card(s) removido(s) com sucesso')

		const { data } = res.data as { data: unknown }

		return data
	}

	static async updateDiscountCodes(cartId: string, discountCodes: string[]) {
		const body = {
			query: CART_DISCOUNT_CODES_UPDATE,
			variables: {
				cartId,
				discountCodes
			}
		}

		Logger.log('[CartService] Atualizando cupom(ns):', discountCodes.join(', '))

		const res = await ShopifyCaller.post(body)
		Logger.log('[CartService] Cupom(ns) atualizado(s) com sucesso')

		console.log(res.data)

		const { data } = res.data as { data: unknown }

		return data
	}

	static async saveCartIdOnStorage(cartId: string) {
		await StorageService.setStorageItem(CartService.SHOPIFY_CART_KEY, cartId)
	}
}
