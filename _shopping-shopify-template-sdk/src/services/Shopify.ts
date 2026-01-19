import { CartService } from './cart/CartService'
import CatalogService from './catalog/CatalogService'

export default class Shopify {
	static catalog = CatalogService
	static cart = CartService
}
