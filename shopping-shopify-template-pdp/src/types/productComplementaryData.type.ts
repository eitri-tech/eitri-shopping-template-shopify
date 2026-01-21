// Nem todos os campos estão tipados

export interface ProductComplementaryDataVariant {
	id: number
	product_id: number
	title: string
	price: string
	sku: string
	position: number
	compare_at_price: string | null
	fulfillment_service: string
	inventory_management: string | null
	option1: string | null
	option2: string | null
	option3: string | null
	created_at: string
	updated_at: string
	taxable: boolean
	barcode: string | null
	grams: number
	image_id: number | null
	weight: number
	requires_shipping: boolean
	price_currency: string
	compare_at_price_currency: string | null
}

export interface ProductComplementaryData {
	variants: ProductComplementaryDataVariant[]
}
