import { useEffect, useState } from 'react'
// @ts-ignore
import { Text, View, Image, Button, Page } from 'eitri-luminus'
import { OptionWithAvailable, Product, SelectedOption } from '../../types/product.type'
import { colorMap } from '../../utils/colorMap'

type SkuSelectorProps = {
	product: Product
	selectedVariantOptions: SelectedOption[]
	variantsOptions: OptionWithAvailable[]
	onSelectVariant: (option: SelectedOption) => void
}

export default function SkuSelector(props: SkuSelectorProps) {
	const { product, selectedVariantOptions, variantsOptions, onSelectVariant } = props
	const [skuVariations, setSkuVariations] = useState([])

	// console.log('product', product.options)

	useEffect(() => {}, [])

	const handleSkuChange = (skuName: string, valueName: string) => {
		onSelectVariant({ name: skuName, value: valueName })
	}

	const isCurrentSku = (optionName: string, optionValue: string): boolean => {
		return selectedVariantOptions?.some(option => option.name === optionName && option.value === optionValue)
	}

	const optionIsAvailable = (optionName: string, optionValue: string): boolean => {
		return true
	}

	const renderOption = (optionName: string, optionValue: string, available: boolean) => {
		const isSelected = isCurrentSku(optionName, optionValue)
		const isColor = optionName.toLowerCase() === 'cor'

		// Mapeia cores para classes do Tailwind
		const getColorClass = (color: string) => {
			const normalizedColor = color.toLowerCase().trim().replace(' ', '-')
			return colorMap[normalizedColor] || 'bg-gray-400'
		}

		if (isColor) {
			return (
				<View
					onClick={available ? () => handleSkuChange(optionName, optionValue) : undefined}
					className={`relative flex flex-col justify-center items-center gap-3 ${!available ? 'opacity-40' : ''}`}>
					<View
						style={{ backgroundColor: getColorClass(optionValue) }}
						className={`
							w-12 h-12 rounded-full border-4 transition-all
							${isSelected ? 'border-blue-500' : 'border-gray-200'}
							${available && 'active:scale-95'}
							${!available ? 'relative overflow-hidden' : ''}
          				`}>
						{!available && (
							<View className='absolute inset-0 flex items-center justify-center'>
								<View className='w-full h-0.5 bg-red-500 rotate-45 transform' />
							</View>
						)}
					</View>
					<Text
						className={`text-xs text-center ${isSelected ? 'text-blue-500 font-semibold' : 'text-gray-600'} ${!available ? 'line-through' : ''}`}>
						{optionValue}
					</Text>
				</View>
			)
		}

		return (
			<View
				onClick={available ? () => handleSkuChange(optionName, optionValue) : undefined}
				className={`
					relative px-4 py-2.5 rounded-lg border-2 transition-all
					${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}
					${available ? 'cursor-pointer active:scale-95 hover:border-blue-300' : 'cursor-not-allowed bg-gray-50 opacity-60'}
			  `}>
				<Text
					className={`
						  font-semibold text-sm
						  ${isSelected ? 'text-blue-600' : 'text-gray-700'}
						  ${!available ? 'line-through text-gray-400' : ''}
					`}>
					{optionValue}
				</Text>

				{isSelected && (
					<View className='absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center'>
						<Text className='text-white text-xs'>✓</Text>
					</View>
				)}

				{!available && (
					<View className='absolute inset-0 flex items-center justify-center'>
						<Text className='text-xs text-red-500 font-bold bg-white px-2 py-0.5 rounded'>
							{optionValue}
						</Text>
					</View>
				)}
			</View>
		)
	}

	return (
		<View className={`flex flex-col gap-2`}>
			{variantsOptions?.length > 0 &&
				variantsOptions.map(option => (
					<View key={option?.id}>
						<Text className='text font-semibold px-4'>{`${option?.name}`}</Text>
						<View className='flex overflow-x-auto mt-2 gap-2 px-4'>
							{option?.optionValues?.map(optionValue => (
								<View key={optionValue.name}>
									{renderOption(option.name, optionValue.name, optionValue.available)}
								</View>
							))}
						</View>
					</View>
				))}
		</View>
	)
}
