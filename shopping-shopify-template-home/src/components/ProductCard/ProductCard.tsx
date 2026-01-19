// @ts-ignore
import { ProductCardFullImage } from 'shopping-shopify-template-shared'
import { openProduct } from '../../services/navigationService'

export default function ProductCard({ product }) {
	const getPrice = () => {
		const price = product?.variants?.nodes?.[0]?.price
		return Number(price?.amount)?.toLocaleString('pt-BR', { style: 'currency', currency: price?.currencyCode })
	}

	const getListPrice = () => {
		const price = product?.variants?.nodes?.[0]?.compareAtPrice
		return Number(price?.amount)?.toLocaleString('pt-BR', { style: 'currency', currency: price?.currencyCode })
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
		onPressOnCard: goToProduct
	}

	return <ProductCardFullImage {...productProps} />
}
