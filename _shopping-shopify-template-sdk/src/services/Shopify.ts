import { CartService } from './cart/CartService'
import CatalogService from './catalog/CatalogService'
import { AddressService } from './AddressService'

export default class Shopify {
	static catalog = CatalogService
	static cart = CartService
	static address = AddressService
}
