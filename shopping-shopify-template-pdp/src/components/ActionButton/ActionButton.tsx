import { CustomButton, BottomInset } from 'shopping-shopify-template-shared'
import { useTranslation } from 'eitri-i18n'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { useEffect, useState } from 'react'
// @ts-ignore
import { Text, View, Image, Button, Page } from 'eitri-luminus'
import { Option, ProductEnriched, ProductVariantEnriched, SelectedOption } from '../../types/product.type'

// import { openCart } from '../../services/NavigationService'

type ActionButtonProps = {
	currentVariant: ProductVariantEnriched
}

export default function ActionButton(props: ActionButtonProps) {
	const { cart, addItemToCart } = useLocalShoppingCart()
	const { t } = useTranslation()
	const { currentVariant } = props
	const [isAvailable, setIsAvailable] = useState(true)
	const [isLoading, setLoading] = useState(false)

	useEffect(() => {
		// const mainSeller = currentSku.sellers.find(seller => seller.sellerDefault)
		// const isAvailable = mainSeller?.commertialOffer?.AvailableQuantity > 0
		// setIsAvailable(isAvailable)
	}, [])

	const isItemOnCart = () => {
		// return cart?.items?.some(cartItem => cartItem.id === currentSku?.itemId)
	}

	const getButtonLabel = () => {
		return 'Comprar'
		// if (!isAvailable) return t('product.errorNoProduct')
		// return isItemOnCart() ? t('product.labelGoToCart') : t('product.labelAddToCart')
	}

	const handleButtonClick = async () => {
		console.log('cart', cart.id)
		console.log('==>', { merchandiseId: currentVariant.id, quantity: 1 })
		const res = await addItemToCart(cart.id, { merchandiseId: currentVariant.id, quantity: 1 })

		console.log('res', res)
		// if (!isAvailable) return
		// setLoading(true)
		// if (isItemOnCart()) {
		// 	openCart()
		// } else {
		// 	addItem(currentSku)
		// }
		// setLoading(false)
	}

	return (
		<>
			<View className='fixed bottom-0 left-0 right-0 z-[999] bg-white border-t border-gray-300'>
				<View className='p-4'>
					<CustomButton
						onClick={handleButtonClick}
						isLoading={isLoading}
						backgroundColor={isAvailable ? 'primary-700' : 'neutral-300'}
						className='rounded-pill w-full'
						label={getButtonLabel()}
					/>
				</View>

				<BottomInset />
			</View>
			<View>
				<View className='h-[77px] w-full' />
			</View>
		</>
	)
}
