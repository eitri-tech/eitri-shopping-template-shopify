// @ts-ignore
import { View, Page, Text, Image, Button, TextInput, Loading } from 'eitri-luminus'
import { useEffect, useState } from 'react'
import Eitri from 'eitri-bifrost'
import { App, Cart, Shopify } from 'shopping-shopify-template-sdk'
import { HeaderContentWrapper } from 'shopping-shopify-template-shared'
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'

export default function CartPage() {
	const [cart, setCart] = useState<Cart | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [discountCode, setDiscountCode] = useState('')
	const [loadingDiscount, setLoadingDiscount] = useState(false)

	const load = async () => {
		setLoading(true)
		await App.configure({ verbose: true })

		Shopify.cart
			.getCurrentOrCreateCart()
			.then(data => {
				setCart(data)
				setLoading(false)
			})
			.catch(err => {
				setError(err.message)
				setLoading(false)
			})
	}

	useEffect(() => {
		load()

		Eitri.navigation.setOnResumeListener(() => {
			load()
		})
	}, [])

	const formatCurrency = (amount: string, currencyCode: string) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: currencyCode
		}).format(parseFloat(amount))
	}

	const handleUpdateQuantity = async (lineId: string, currentQuantity: number, delta: number) => {
		const newQuantity = currentQuantity + delta
		if (newQuantity < 1) return

		try {
			await Shopify.cart.updateCartLines(cart!.id, [{ id: lineId, quantity: newQuantity }])
			await load()
		} catch (err) {
			console.error('Erro ao atualizar quantidade:', err)
		}
	}

	const handleRemoveItem = async (lineId: string) => {
		try {
			await Shopify.cart.removeItemFromCart(cart!.id, [lineId])
			await load()
		} catch (err) {
			console.error('Erro ao remover item:', err)
		}
	}

	const handleAddDiscount = async () => {
		if (!discountCode) return
		setLoadingDiscount(true)
		try {
			const currentCodes = cart?.discountCodes?.map(c => c.code) || []
			// Avoid adding duplicates
			if (!currentCodes.includes(discountCode)) {
				const newCodes = [...currentCodes, discountCode]
				await Shopify.cart.updateDiscountCodes(cart!.id, newCodes)
				setDiscountCode('')
				await load()
			}
		} catch (err) {
			console.error('Erro ao adicionar cupom:', err)
		} finally {
			setLoadingDiscount(false)
		}
	}

	const handleRemoveDiscount = async (codeToRemove: string) => {
		setLoadingDiscount(true)
		try {
			const currentCodes = cart?.discountCodes?.map(c => c.code) || []
			const newCodes = currentCodes.filter(c => c !== codeToRemove)
			await Shopify.cart.updateDiscountCodes(cart!.id, newCodes)
			await load()
		} catch (err) {
			console.error('Erro ao remover cupom:', err)
		} finally {
			setLoadingDiscount(false)
		}
	}

	if (loading) {
		return (
			<Page
				title='Carrinho'
				topInset
				bottomInset>
				<HeaderContentWrapper>
					<Text className='text-xl font-bold !text-white'>Meu Carrinho</Text>
				</HeaderContentWrapper>
				<View className='min-h-screen bg-base-100 flex flex-col items-center justify-center'>
					<View className='animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full' />
					<Text className='mt-4 text-base-content/70'>Carregando carrinho...</Text>
				</View>
			</Page>
		)
	}

	if (error) {
		return (
			<Page
				title='Carrinho'
				topInset
				bottomInset>
				<HeaderContentWrapper>
					<Text className='text-xl font-bold !text-white'>Meu Carrinho</Text>
				</HeaderContentWrapper>
				<View className='min-h-screen bg-base-100 flex flex-col items-center justify-center p-4'>
					<View className='w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mb-4'>
						<Text className='text-3xl text-error'>!</Text>
					</View>
					<Text className='text-lg font-semibold text-error mb-2'>Erro ao carregar</Text>
					<Text className='text-base-content/70 text-center'>{error}</Text>
				</View>
			</Page>
		)
	}

	if (!cart || cart.lines.edges.length === 0) {
		return (
			<Page
				title='Carrinho'
				topInset
				bottomInset>
				<HeaderContentWrapper>
					<Text className='text-xl font-bold !text-white'>Meu Carrinho</Text>
				</HeaderContentWrapper>
				<View className='min-h-screen bg-base-100 flex flex-col items-center justify-center p-4'>
					<View className='w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-4'>
						<Text className='text-4xl'>🛒</Text>
					</View>
					<Text className='text-xl font-semibold text-base-content mb-2'>Carrinho vazio</Text>
					<Text className='text-base-content/70 text-center'>Adicione produtos para continuar</Text>
				</View>
			</Page>
		)
	}

	return (
		<Page
			title='Carrinho'
			topInset
			bottomInset>
			<HeaderContentWrapper>
				<Text className='text-xl font-bold !text-white'>Meu Carrinho</Text>
			</HeaderContentWrapper>
			<View className='min-h-screen bg-base-100 flex flex-col'>
				{/* Cart Items */}
				<View className='flex-1 flex-col px-4 py-4 space-y-4'>
					{cart.lines.edges.map(edge => {
						const item = edge.node
						const product = item.merchandise.product
						return (
							<View
								key={item.id}
								className='bg-base-200 rounded-xl p-4 flex flex-row shadow-md'>
								{/* Product Image */}
								<View className='w-24 h-24 rounded-lg overflow-hidden bg-base-300 flex-shrink-0'>
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
								<View className='flex-1 ml-4 flex-col justify-between'>
									<View className='flex flex-row justify-between items-start'>
										<View className='flex flex-col flex-1'>
											<Text className='font-semibold text-base-content text-sm leading-tight'>
												{product.title}
											</Text>
											{item.merchandise.selectedOptions?.length > 0 && (
												<Text className='text-xs text-base-content/60 mt-1'>
													{item.merchandise.selectedOptions
														.map(opt => `${opt.name}: ${opt.value}`)
														.join(' | ')}
												</Text>
											)}
										</View>

										{/* Remove Button */}
										<Button
											className='btn !btn-ghost btn-sm p-1 ml-2'
											onClick={() => handleRemoveItem(item.id)}>
											<FiTrash2
												className='text-error'
												size={18}
											/>
										</Button>
									</View>

									<View className='flex flex-row items-center justify-between mt-2'>
										{/* Quantity Controls */}
										<View className='flex flex-row items-center bg-base-300 rounded-lg'>
											<Button
												className='btn !btn-ghost btn-sm px-2'
												onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}>
												<FiMinus
													size={10}
													color='#000'
												/>
											</Button>
											<Text className='font-semibold text-base-content px-3'>
												{item.quantity}
											</Text>
											<Button
												className='btn !btn-ghost btn-sm px-2'
												onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}>
												<FiPlus
													size={10}
													color='#000'
												/>
											</Button>
										</View>

										{/* Price */}
										<Text className='font-bold text-primary text-md'>
											{formatCurrency(
												item.cost.totalAmount.amount,
												item.cost.totalAmount.currencyCode
											)}
										</Text>
									</View>
								</View>
							</View>
						)
					})}
				</View>

				{/* Cart Summary */}
				<View
					className='flex-col sticky bottom-0 bg-base-200 px-4 py-5 pb-8 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)]'
					bottomInset>
					{/* Discount Codes */}
					<View className='mb-4'>
						<Text className='font-bold text-base-content mb-2'>Cupom de Desconto</Text>
						<View className='flex flex-row'>
							<TextInput
								className='input input-bordered flex-1 mr-2 h-10'
								placeholder='Código do cupom'
								value={discountCode}
								onChange={e => setDiscountCode(e.target.value)}
							/>
							<Button
								className='btn btn-neutral btn-sm h-10'
								onClick={handleAddDiscount}>
								{loadingDiscount ? <Loading classname='loading loading-spinner' /> : 'Adicionar'}
							</Button>
						</View>

						{/* List of applied discount codes */}
						{cart.discountCodes && cart.discountCodes.length > 0 && (
							<View className='mt-2 space-y-2'>
								{cart.discountCodes.map(dc => (
									<View
										key={dc.code}
										className='flex flex-row justify-between items-center bg-base-100 p-2 rounded-lg'>
										<View className='flex flex-col'>
											<Text className='font-semibold text-sm'>{dc.code}</Text>
											<Text className='text-xs text-base-content/70'>
												{dc.applicable ? 'Aplicado' : 'Não aplicável'}
											</Text>
										</View>
										<Button
											className='btn !btn-ghost btn-xs !text-error'
											onClick={() => handleRemoveDiscount(dc.code)}>
											{loadingDiscount ? (
												<Loading classname='loading loading-spinner' />
											) : (
												'Remover'
											)}
										</Button>
									</View>
								))}
							</View>
						)}
					</View>

					{/* Subtotal */}
					<View className='flex flex-row justify-between items-center mb-2'>
						<Text className='text-base-content/70'>Subtotal</Text>
						<Text className='text-base-content'>
							{formatCurrency(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
						</Text>
					</View>

					{/* Discount */}
					{(cart.discountAllocations?.length > 0 ||
						cart.lines.edges.some(edge => edge.node.discountAllocations?.length > 0)) && (
						<View className='flex flex-row justify-between items-center mb-2'>
							<Text className='text-base-content/70'>Desconto</Text>
							<Text className='text-success'>
								-
								{formatCurrency(
									(
										(cart.discountAllocations?.reduce(
											(acc, allocation) => acc + parseFloat(allocation.discountedAmount.amount),
											0
										) || 0) +
										cart.lines.edges.reduce((acc, edge) => {
											return (
												acc +
												(edge.node.discountAllocations?.reduce(
													(lineAcc, allocation) =>
														lineAcc + parseFloat(allocation.discountedAmount.amount),
													0
												) || 0)
											)
										}, 0)
									).toString(),
									cart.cost.totalAmount.currencyCode
								)}
							</Text>
						</View>
					)}
					{/* Divider */}
					<View className='h-px bg-base-content/10 my-3' />

					{/* Total */}
					<View className='flex flex-row justify-between items-center mb-4'>
						<Text className='text-lg font-semibold text-base-content'>Total</Text>
						<Text className='text-2xl font-bold text-primary'>
							{formatCurrency(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}
						</Text>
					</View>

					{/* Checkout Button */}
					<Button
						className='btn btn-primary w-full !text-white text-lg py-3 mb-6'
						onClick={() => {
							if (cart.checkoutUrl) {
								Eitri.openBrowser({ url: cart.checkoutUrl, inApp: true })
							}
						}}>
						Finalizar Compra
					</Button>
				</View>
			</View>
		</Page>
	)
}
