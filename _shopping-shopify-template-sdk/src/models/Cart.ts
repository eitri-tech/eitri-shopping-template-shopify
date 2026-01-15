export interface CartResponse {
	cart: Cart
}

export interface Cart {
	id: string
	createdAt: Date
	updatedAt: Date
	checkoutUrl: string
	totalQuantity: number
	note: string
	attributes: Attribute[]
	cost: CartCost
	lines: Lines
	discountCodes: any[]
	discountAllocations: any[]
	buyerIdentity: BuyerIdentity
}

export interface Attribute {
	key: string
	value: string
}

export interface BuyerIdentity {
	email: null
	phone: null
	countryCode: string
	preferences: Preferences
}

export interface Preferences {
	wallet: string[]
}

export interface CartCost {
	totalAmount: SubtotalAmount
	subtotalAmount: SubtotalAmount
	totalTaxAmount: null
	totalDutyAmount: null
}

export interface SubtotalAmount {
	amount: string
	currencyCode: string
}

export interface Lines {
	edges: Edge[]
}

export interface Edge {
	node: Node
}

export interface Node {
	id: string
	quantity: number
	merchandise: Merchandise
	attributes: any[]
	cost: NodeCost
}

export interface NodeCost {
	totalAmount: SubtotalAmount
	amountPerQuantity: SubtotalAmount
}

export interface Merchandise {
	id: string
	title: string
	priceV2: SubtotalAmount
	product: Product
	selectedOptions: SelectedOption[]
	availableForSale: boolean
}

export interface Product {
	id: string
	title: string
	handle: string
	description: string
	featuredImage: FeaturedImage
}

export interface FeaturedImage {
	url: string
	altText: string
}

export interface SelectedOption {
	name: string
	value: string
}
