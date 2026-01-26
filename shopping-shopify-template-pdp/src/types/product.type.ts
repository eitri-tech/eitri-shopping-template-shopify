// Nem todos os campos estão tipados

export interface Price {
	amount: number
	currencyCode: string
}

export interface SelectedOption {
	name: string
	value: string
}

export interface Option {
	id: string
	name: string
	optionValues: {
		id: string
		name: string
	}[]
}

export interface ProductVariant {
	id: string
	title: string
	barcode: string
	availableForSale: string
	selectedOptions: {
		name: string
		value: string
	}[]
	price: Price
	sku: string
}

export interface Product {
	title: string
	priceRange: {
		minVariantPrice: Price
		maxVariantPrice: Price
	}
	handle: string
	options: Option[]
	images: {
		nodes: {
			url: string
			height: number
			width: number
			id: string
		}[]
	}
	selectedOrFirstAvailableVariant: {
		selectedOptions: SelectedOption[]
	}
	variants: {
		nodes: ProductVariant[]
	}
}

export interface OptionWithAvailable extends Option {
	optionValues: {
		id: string
		name: string
		available: boolean
	}[]
}
