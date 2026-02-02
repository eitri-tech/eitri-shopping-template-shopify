import Eitri from 'eitri-bifrost'
// @ts-ignore
import { useTranslation } from 'eitri-i18n'
import { useRef } from 'react'
// @ts-ignore
import { Text, View, Image, Button, Page } from 'eitri-luminus'
import { Price, Product } from '../../types/product.type'

type MainDescriptionProps = {
	product: Product
}

export default function MainDescription(props: MainDescriptionProps) {
	const { product } = props

	const { t } = useTranslation()

	const count = useRef(5)

	const discoverInstallments = item => {
		try {
			const mainSeller = item.sellers.find(seller => seller.sellerDefault)
			if (mainSeller) {
				const betterInstallment = mainSeller.commertialOffer.Installments.reduce((acc, installment) => {
					if (!acc) {
						acc = installment
						return acc
					} else {
						if (installment.NumberOfInstallments > acc.NumberOfInstallments) {
							acc = installment
						}
						return acc
					}
				}, null)

				if (betterInstallment.NumberOfInstallments === 1) return ''

				return `${t('mainDescription.txtUntil')} ${betterInstallment.NumberOfInstallments}x ${t('mainDescription.txtOf')} ${betterInstallment.Value}`
			}
			return ''
		} catch (error) {
			return ''
		}
	}

	// const copyCheckoutId = () => {
	// 	if (count.current > 0) {
	// 		count.current -= 1
	// 		return
	// 	}
	// 	Eitri.clipboard.setText({
	// 		text: product?.productId
	// 	})
	// 	count.current = 5
	// }

	// const mainSeller = currentSku?.sellers?.find(seller => seller.sellerDefault) || currentSku?.sellers?.[0]

	const getPrice = (price: Price) => {
		return Number(price?.amount)?.toLocaleString('pt-BR', { style: 'currency', currency: price?.currencyCode })
	}

	return (
		<View className='flex flex-col px-4'>
			<View>
				<Text className='text font-bold'>{product.title}</Text>
			</View>
			<View className='mt-4'>
				{/*{mainSeller?.commertialOffer?.Price < mainSeller?.commertialOffer?.ListPrice && (*/}
				{/*	<Text className='text-sm text-neutral-content line-through'>*/}
				{/*		{mainSeller?.commertialOffer?.ListPrice}*/}
				{/*	</Text>*/}
				{/*)}*/}
				<View>
					<Text className='text-primary font-bold'>{getPrice(product?.priceRange?.minVariantPrice)}</Text>
				</View>

				{/*{discoverInstallments(currentSku) && (*/}
				{/*	<Text className='text-sm text-neutral-content'>{discoverInstallments(currentSku)}</Text>*/}
				{/*)}*/}
			</View>
		</View>
	)
}
