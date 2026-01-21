import { useEffect, useState } from 'react'
// @ts-ignore
import { Text, View, Image, Button, Page } from 'eitri-luminus'
import { Product, ProductEnriched, SelectedOption } from '../../types/product.type'

type SkuSelectorProps = {
	product: ProductEnriched
	selectedOptions: SelectedOption[]
	onSelectVariant: (option: SelectedOption) => void
}

export default function SkuSelector(props: SkuSelectorProps) {
	const { product, selectedOptions, onSelectVariant } = props
	const [skuVariations, setSkuVariations] = useState([])

	// console.log('product', product.options)

	useEffect(() => {}, [])

	const handleSkuChange = (skuName: string, valueName: string) => {
		onSelectVariant({ name: skuName, value: valueName })
	}

	const isCurrentSku = (optionName: string, optionValue: string): boolean => {
		return selectedOptions.some(option => option.name === optionName && option.value === optionValue)
	}

	const optionIsAvailable = (optionName: string, optionValue: string): boolean => {
		return true
	}

	const renderOption = (optionName: string, optionValue: string) => {
		return (
			<View
				onClick={() => handleSkuChange(optionName, optionValue)}
				className={`flex items-center gap-2 px-2 py-1 border-2 rounded ${isCurrentSku(optionName, optionValue) ? 'border-primary' : 'border-neutral-500'}`}>
				<Text
					className={`${isCurrentSku(optionName, optionValue) ? 'text-primary' : 'text-neutral-500'}  font-bold`}>
					{optionValue}
				</Text>
			</View>
		)
	}

	return (
		<View className={`flex flex-col gap-2 bg-white rounded shadow-sm border border-gray-300 p-4 w-full`}>
			{product?.options?.length > 0 &&
				product?.options.map(option => (
					<View key={option?.id}>
						<Text className='text-lg font-semibold'>{`${option?.name}`}</Text>
						<View className='flex flex-wrap mt-2 gap-2'>
							{option?.optionValues?.map(value => renderOption(option.name, value.name))}
						</View>
					</View>
				))}
		</View>
	)
}
