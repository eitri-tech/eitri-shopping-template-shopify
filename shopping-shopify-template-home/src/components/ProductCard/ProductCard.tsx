// @ts-ignore
import { Shopify } from 'shopping-shopify-template-sdk'
import { ProductCardFullImage } from 'shopping-shopify-template-shared'

export default function ProductCard({ product }) {
	const getPrice = () => {
		const price = product?.variants?.nodes?.[0]?.price
		return Number(price?.amount)?.toLocaleString('pt-BR', { style: 'currency', currency: price?.currencyCode })
	}

	const getListPrice = () => {
		const price = product?.variants?.nodes?.[0]?.compareAtPrice
		return Number(price?.amount)?.toLocaleString('pt-BR', { style: 'currency', currency: price?.currencyCode })
	}

	const productProps = {
		image: product?.images?.nodes?.[0]?.url,
		name: product?.title,
		price: getPrice(),
		listPrice: getListPrice(),
		showListItem: true
	}

	return (
		<ProductCardFullImage
			{...productProps}
			onPressCartButton={async () => {
				const cart = await Shopify.cart.getCurrentOrCreateCart()
				await Shopify.cart.addItemToCart(cart.id, {
					merchandiseId: product.variants.nodes[0].id,
					quantity: 1
				})
			}}
		/>
	)
}
