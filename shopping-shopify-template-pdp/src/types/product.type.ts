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
		available: boolean // não pertence ao schema original
	}[]
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
		nodes: {
			id: string
			title: string
			barcode: string
			selectedOptions: {
				name: string
				value: string
			}[]
			price: Price
			sku: string
		}[]
	}
}

/* Variante enriquecida */
export type ProductVariantEnriched = Product['variants']['nodes'][number] & {
	product_id: string
}

/* Produto enriquecido */
export interface ProductEnriched extends Omit<Product, 'variants'> {
	variants: {
		nodes: ProductVariantEnriched[]
	}
}
