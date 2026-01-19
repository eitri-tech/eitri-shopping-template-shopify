export interface Price {
	amount: number
	currencyCode: string
}

export interface Product {
	title: string
	priceRange: {
		minVariantPrice: Price
		maxVariantPrice: Price
	}
	images: {
		nodes: {
			url: string
			height: number
			width: number
			id: string
		}[]
	}
}
