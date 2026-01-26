// @ts-ignore
import { View, Page, Text, Image, Button, TextInput, Loading } from 'eitri-luminus'
import { useEffect, useState } from 'react'
import Eitri from 'eitri-bifrost'
import { App, Cart, Shopify, DeliveryGroups } from 'shopping-shopify-template-sdk'
import { HeaderContentWrapper } from 'shopping-shopify-template-shared'
import { FiTrash2, FiPlus, FiMinus, FiChevronUp, FiChevronDown } from 'react-icons/fi'

export default function CartPage() {
	const [cart, setCart] = useState<Cart | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [discountCode, setDiscountCode] = useState('')
	const [loadingDiscount, setLoadingDiscount] = useState(false)
	const [summaryExpanded, setSummaryExpanded] = useState(false)
	const [loadingDeliveryOptions, setLoadingDeliveryOptions] = useState(false)
	const [cep, setCep] = useState('')
	const [deliveryOptions, setDeliveryOptions] = useState<DeliveryGroups | null>(null)

	const load = async () => {
		setLoading(true)
		await App.configure({ verbose: true })

		Shopify.cart
			.getCurrentOrCreateCart()
			.then(data => {
				setCart(data)
				setLoading(false)

				const deliveryAddress = data.buyerIdentity?.deliveryAddressPreferences?.[0]
				if (deliveryAddress && deliveryAddress.zip) {
					setCep(deliveryAddress.zip)
					fetchDeliveryOptions(data.id)
				}
			})
			.catch(err => {
				setError(err.message)
				setLoading(false)
			})
	}

	const fetchDeliveryOptions = async (cartId: string) => {
		setLoadingDeliveryOptions(true)
		setDeliveryOptions(null)

		try {
			await Shopify.cart.getDeliveryOptionsWithCarrierRates(
				cartId,
				cartData => {
					if (cartData.cost) {
						setCart(prev => (prev ? { ...prev, cost: cartData.cost! } : prev))
					}
				},
				groups => {
					console.log('Opções de entrega:', groups)
					setDeliveryOptions(groups)
					setLoadingDeliveryOptions(false)
				}
			)
		} catch (err) {
			console.error('Erro ao buscar opções de entrega:', err)
			setLoadingDeliveryOptions(false)
		}
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

	const handleCalculateShipping = async () => {
		const cleanCep = cep.replace(/\D/g, '')
		if (cleanCep.length !== 8) return

		setDeliveryOptions(null)
		setLoadingDeliveryOptions(true)

		try {
			const address = await Shopify.address.getAddressFromCep(cleanCep)

			if (!address) {
				console.error('CEP não encontrado')
				setLoadingDeliveryOptions(false)
				return
			}

			await Shopify.cart.updateDeliveryAddress(cart!.id, address)
			await fetchDeliveryOptions(cart!.id)
		} catch (err) {
			console.error('Erro ao calcular frete:', err)
			setLoadingDeliveryOptions(false)
		}
	}

	const goToCheckout = async (checkoutUrl: string) => {
		try {
			const modules = await Eitri.modules()
			const startCheckoutFn = modules?.shopify?.startCheckout
			if (startCheckoutFn) {
				const res = await startCheckoutFn({
					checkoutUrl
				})
			}
		} catch (error) {
			console.error(error)
		}
	}

	if (loading) {
		return (
			<Page
				title='Sacola'
				topInset
				bottomInset>
				<HeaderContentWrapper>
					<Text className='text-xl font-bold !text-white'>Sacola</Text>
				</HeaderContentWrapper>
				<View className='min-h-screen bg-base-100 flex flex-col items-center justify-center'>
					<View className='animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full' />
					<Text className='mt-4 text-base-content/70'>Carregando sacola...</Text>
				</View>
			</Page>
		)
	}

	if (error) {
		return (
			<Page
				title='Sacola'
				topInset
				bottomInset>
				<HeaderContentWrapper>
					<Text className='text-xl font-bold !text-white'>Sacola</Text>
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

	if (!cart || cart.lines.nodes.length === 0) {
		return (
			<Page
				title='Sacola'
				topInset
				bottomInset>
				<HeaderContentWrapper>
					<Text className='text-xl font-bold !text-white'>Sacola</Text>
				</HeaderContentWrapper>
				<View className='min-h-screen bg-base-100 flex flex-col items-center justify-center p-4'>
					<View className='w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-4'>
						<Text className='text-4xl'>🛒</Text>
					</View>
					<Text className='text-xl font-semibold text-base-content mb-2'>Sacola vazia</Text>
					<Text className='text-base-content/70 text-center'>Adicione produtos para continuar</Text>
				</View>
			</Page>
		)
	}

	const calculateTotalDiscount = () => {
		const cartDiscount =
			cart?.discountAllocations?.reduce(
				(acc, allocation) => acc + parseFloat(allocation.discountedAmount.amount),
				0
			) || 0
		const lineDiscount =
			cart?.lines?.nodes.reduce((acc, node) => {
				return (
					acc +
					(node.discountAllocations?.reduce(
						(lineAcc, allocation) => lineAcc + parseFloat(allocation.discountedAmount.amount),
						0
					) || 0)
				)
			}, 0) || 0
		return cartDiscount + lineDiscount
	}

	const hasDiscount =
		(cart?.discountAllocations?.length ?? 0) > 0 ||
		cart?.lines.nodes.some(node => (node.discountAllocations?.length ?? 0) > 0)

	return (
		<Page
			title='Sacola'
			topInset
			bottomInset>
			<HeaderContentWrapper>
				<Text className='text-xl font-bold !text-white'>Sacola</Text>
			</HeaderContentWrapper>
			<View className='min-h-screen bg-base-100 flex flex-col pb-60'>
				{/* Cart Items */}
				<View className='flex-col px-4 py-4 space-y-4'>
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
								<View className='w-20 h-24 rounded-lg overflow-hidden bg-base-200 flex-shrink-0'>
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
										<Text className='font-medium text-base-content text-sm leading-tight flex-1 pr-2'>
											{product.title}
										</Text>
										{/* Remove Button */}
										<Button
											className='!btn !btn-ghost btn-sm p-0'
											onClick={() => handleRemoveItem(item.id)}>
											<FiTrash2
												className='text-base-content/50'
												size={18}
											/>
										</Button>
									</View>

									{item.merchandise.selectedOptions?.length > 0 && (
										<Text className='text-xs text-base-content/60 mt-1'>
											{item.merchandise.selectedOptions
												.map(opt => `${opt.name}: ${opt.value}`)
												.join(' | ')}
										</Text>
									)}

									{/* Prices */}
									<View className='flex flex-col mt-1'>
										{hasItemDiscount && (
											<Text className='text-xs text-base-content/50 line-through'>
												{formatCurrency(
													compareAtPrice.toString(),
													item.merchandise.compareAtPrice?.currencyCode || 'BRL'
												)}
											</Text>
										)}
										<Text className='font-bold text-primary text-base'>
											{formatCurrency(
												item.cost.totalAmount.amount,
												item.cost.totalAmount.currencyCode
											)}
										</Text>
									</View>

									{/* Quantity Controls */}
									<View className='flex flex-row items-center mt-2'>
										<View className='flex flex-row items-center border border-base-300 rounded-lg'>
											<Button
												className='!btn !btn-ghost !btn-sm px-3 py-1'
												onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}>
												<FiMinus
													size={14}
													className='text-base-content/70'
												/>
											</Button>
											<Text className='font-medium text-base-content px-3 min-w-[30px] text-center'>
												{item.quantity}
											</Text>
											<Button
												className='btn !btn-ghost btn-sm px-3 py-1'
												onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}>
												<FiPlus
													size={14}
													className='text-primary'
												/>
											</Button>
										</View>
									</View>
								</View>
							</View>
						)
					})}
				</View>

				{/* Discount Codes Section */}
				<View className='px-4 py-4 bg-base-100 border-t border-base-200'>
					<Text className='font-semibold text-base-content mb-2'>Cupom de Desconto</Text>
					<View className='flex flex-row'>
						<TextInput
							className='input input-bordered flex-1 mr-2 h-10 text-sm'
							placeholder='Código do cupom'
							value={discountCode}
							onChange={e => setDiscountCode(e.target.value)}
						/>
						<Button
							className='!btn !btn-outline !btn-sm h-10 px-4'
							onClick={handleAddDiscount}>
							{loadingDiscount ? <Loading classname='loading loading-spinner loading-sm' /> : 'Aplicar'}
						</Button>
					</View>

					{/* List of applied discount codes */}
					{cart.discountCodes && cart.discountCodes.length > 0 && (
						<View className='mt-2 space-y-2'>
							{cart.discountCodes.map(dc => (
								<View
									key={dc.code}
									className='flex flex-row justify-between items-center bg-base-200 p-2 rounded-lg'>
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
											<Loading classname='loading loading-spinner loading-xs' />
										) : (
											'Remover'
										)}
									</Button>
								</View>
							))}
						</View>
					)}
				</View>

				{/* Shipping Calculation Section */}
				<View className='px-4 py-4 bg-base-100 border-t border-base-200'>
					<Text className='font-semibold text-base-content mb-2'>Calcular Frete</Text>
					<View className='flex flex-row'>
						<TextInput
							className='input input-bordered flex-1 mr-2 h-10 text-sm'
							placeholder='Digite seu CEP'
							value={cep}
							onChange={e => setCep(e.target.value)}
						/>
						<Button
							className='!btn !btn-outline !btn-sm h-10 px-4'
							onClick={handleCalculateShipping}
							disabled={loadingDeliveryOptions}>
							Calcular
						</Button>
					</View>
				</View>

				{/* Delivery Options */}
				{loadingDeliveryOptions && (
					<View className='px-4 py-4 bg-base-100 border-t border-base-200'>
						<Text className='font-semibold text-base-content mb-2'>Opções de Entrega</Text>
						<View className='flex flex-row items-center justify-center py-4'>
							<View className='animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full' />
							<Text className='ml-2 text-base-content/70 text-sm'>Calculando fretes...</Text>
						</View>
					</View>
				)}

				{deliveryOptions && deliveryOptions.edges.length > 0 && (
					<View className='px-4 py-4 bg-base-100 border-t border-base-200'>
						<Text className='font-semibold text-base-content mb-2'>Opções de Entrega</Text>
						<View className='space-y-2'>
							{deliveryOptions.edges.map((edge, index) =>
								edge.node.deliveryOptions.map((option, optIndex) => (
									<View
										key={`${index}-${optIndex}`}
										className={`bg-base-200 p-3 rounded-lg ${
											edge.node.selectedDeliveryOption?.handle === option.handle
												? 'border-2 border-primary'
												: 'border border-base-300'
										}`}>
										<View className='flex flex-row justify-between items-center'>
											<View className='flex flex-col'>
												<Text className='font-semibold text-sm'>{option.title}</Text>
												<Text className='text-xs text-base-content/70'>
													{option.deliveryMethodType}
												</Text>
											</View>
											<Text className='font-bold text-primary'>
												{formatCurrency(
													option.estimatedCost.amount,
													option.estimatedCost.currencyCode
												)}
											</Text>
										</View>
									</View>
								))
							)}
						</View>
					</View>
				)}

				{/* Fixed Bottom Summary */}
				<View
					className='fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-3xl'
					bottomInset>
					{/* Expandable Summary Section */}
					{summaryExpanded && (
						<View className='px-4 pt-4 pb-2 border-b border-base-200'>
							{/* Subtotal */}
							<View className='flex flex-row justify-between items-center mb-2'>
								<Text className='text-base-content/70 text-sm'>Subtotal</Text>
								<Text className='text-base-content text-sm'>
									{formatCurrency(
										cart.cost.subtotalAmount.amount,
										cart.cost.subtotalAmount.currencyCode
									)}
								</Text>
							</View>

							{/* Discount */}
							{hasDiscount && (
								<View className='flex flex-row justify-between items-center mb-2'>
									<Text className='text-base-content/70 text-sm'>Descontos</Text>
									<Text className='text-green-500 text-sm'>
										-
										{formatCurrency(
											calculateTotalDiscount().toString(),
											cart.cost.totalAmount.currencyCode
										)}
									</Text>
								</View>
							)}
						</View>
					)}

					{/* Toggle Area */}
					<Button
						className='w-full flex flex-row items-center justify-center py-2 !btn-ghost !bg-transparent'
						onClick={() => setSummaryExpanded(!summaryExpanded)}>
						{summaryExpanded ? (
							<FiChevronDown
								size={20}
								className='text-base-content/50'
							/>
						) : (
							<FiChevronUp
								size={20}
								className='text-base-content/50'
							/>
						)}
					</Button>

					{/* Total Row */}
					{/* <View className='flex flex-row justify-between items-center px-4 mb-3'>
						<Text className='text-base font-semibold text-base-content'>Total</Text>
						<Text className='text-lg font-bold text-base-content'>
							{formatCurrency(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}
						</Text>
					</View> */}

					{/* Checkout Button */}
					<View className='px-4 pb-6'>
						<Button
							className='btn btn-primary w-full !text-white text-base py-3'
							onClick={() => {
								goToCheckout(cart.checkoutUrl)
							}}>
							Finalizar Compra •{' '}
							{formatCurrency(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}
						</Button>
					</View>
				</View>
			</View>
		</Page>
	)
}
