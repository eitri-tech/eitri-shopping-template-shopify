// @ts-ignore
import { Shopify } from 'eitri-shopping-shopify-shared'
import { ProductCardFullImage } from 'shopping-shopify-template-shared'
import { openProduct } from '../../services/navigationService'
import { useLocalShoppingCart } from '../../providers/LocalCart'

export default function ProductCard({ product }) {
	const { addItemToCart } = useLocalShoppingCart()

	const getPrice = () => {
		const price = product?.variants?.nodes?.[0]?.price
		return Number(price?.amount)?.toLocaleString('pt-BR', {
			style: 'currency',
			currency: price?.currencyCode || 'BRL'
		})
	}

	const getListPrice = () => {
		const price = product?.variants?.nodes?.[0]?.compareAtPrice
		return Number(price?.amount)?.toLocaleString('pt-BR', {
			style: 'currency',
			currency: price?.currencyCode || 'BRL'
		})
	}

	const goToProduct = () => {
		openProduct(product)
	}

	const productProps = {
		image: product?.images?.nodes?.[0]?.url,
		name: product?.title,
		price: getPrice(),
		listPrice: getListPrice(),
		showListItem: true,
		actionLabel: 'Comprar',
		onPressOnCard: goToProduct
	}

	return (
		<ProductCardFullImage
			{...productProps}
			onPressCartButton={async () => {
				addItemToCart({
					merchandiseId: product.variants.nodes[0].id,
					quantity: 1
				})
			}}
		/>
	)
}
