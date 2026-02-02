// @ts-ignore
import { View, Page, Text, Image, Button, TextInput, Loading } from 'eitri-luminus'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { formatCurrency } from '../utils/formatCurrency'
import { FiTrash2, FiPlus, FiMinus, FiChevronUp, FiChevronDown } from 'react-icons/fi'

export default function CartItems(props) {
	const { cart, updateCartLines, removeItemFromCart } = useLocalShoppingCart()

	const handleUpdateQuantity = async (lineId: string, currentQuantity: number, delta: number) => {
		const newQuantity = currentQuantity + delta
		if (newQuantity < 1) return

		try {
			await updateCartLines([{ id: lineId, quantity: newQuantity }])
		} catch (err) {
			console.error('Erro ao atualizar quantidade:', err)
		}
	}

	const handleRemoveItem = async (lineId: string) => {
		try {
			await removeItemFromCart([lineId])
		} catch (err) {
			console.error('Erro ao remover item:', err)
		}
	}

	return (
		<View className='flex flex-col p-4 gap-5'>
			{cart?.lines?.nodes.map(node => {
				const item = node
				const product = item.merchandise.product
				const unitPrice = parseFloat(item.cost.amountPerQuantity?.amount || '0')
				const compareAtPrice = parseFloat(item.merchandise.compareAtPrice?.amount || '0')
				const hasItemDiscount = compareAtPrice > 0 && compareAtPrice > unitPrice

				return (
					<View
						key={item.id}
						className='bg-base-100 border-b border-base-200 pb-4 flex flex-row'>
						{/* Product Image */}
						<View className='w-20 h-24 rounded overflow-hidden bg-base-200 flex-shrink-0'>
							{product.featuredImage?.url ? (
								<Image
									src={product.featuredImage.url}
									className='w-full h-full object-cover'
								/>
							) : (
								<View className='w-full h-full flex items-center justify-center'>
									<Text className='text-3xl'>📦</Text>
								</View>
							)}
						</View>

						{/* Product Info */}
						<View className='flex-1 ml-3 flex-col'>
							<View className='flex flex-row justify-between items-start'>
								<Text className='font-bold text-base-content text-sm leading-tight flex-1 pr-2'>
									{product.title}
								</Text>
								{/* Remove Button */}
								<FiTrash2
									className='text-base-content/50'
									size={18}
									onClick={() => handleRemoveItem(item.id)}
								/>
							</View>

							{item.merchandise.selectedOptions?.length > 0 && (
								<Text className='text-xs text-base-content/60 mt-2'>
									{item.merchandise.selectedOptions
										.map(opt => `${opt.name}: ${opt.value}`)
										.join(' | ')}
								</Text>
							)}

							{/* Prices */}
							<View className='flex flex-col mt-2'>
								{hasItemDiscount && (
									<Text className='text-xs text-base-content/50 line-through'>
										{formatCurrency(
											compareAtPrice.toString(),
											item.merchandise.compareAtPrice?.currencyCode || 'BRL'
										)}
									</Text>
								)}
								<View className='flex flex-row justify-between items-center'>
									<Text className='font-bold text-primary text-base'>
										{formatCurrency(
											item.cost.totalAmount.amount,
											item.cost.totalAmount.currencyCode
										)}
									</Text>
									{/* Quantity Controls */}
									<View className='flex flex-row items-center bg-base-300/70 rounded-lg px-2 py-1 gap-3'>
										<FiMinus
											size={14}
											className='text-base-content/70'
											onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
										/>
										<Text className='font-medium text-base-content px-3 min-w-[30px] text-center'>
											{item.quantity}
										</Text>
										<FiPlus
											size={14}
											className='text-primary'
											onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
										/>
									</View>
								</View>
							</View>
						</View>
					</View>
				)
			})}
		</View>
	)
}
