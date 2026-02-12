import { useTranslation } from 'eitri-i18n'
import Eitri from 'eitri-bifrost'
import { Text, View, Image, Loading, Page } from 'eitri-luminus'
import {
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText,
	CustomButton,
	BottomInset
} from 'shopping-shopify-template-shared'
import { FiPackage, FiTruck, FiMapPin, FiCreditCard, FiExternalLink, FiAlertCircle } from 'react-icons/fi'

import { Shopify } from 'eitri-shopping-shopify-shared'
import { useEffect, useState } from 'react'

const financialStatusStyles = {
	PAID: 'bg-green-100 text-green-700',
	PENDING: 'bg-yellow-100 text-yellow-700',
	REFUNDED: 'bg-gray-100 text-gray-600',
	PARTIALLY_REFUNDED: 'bg-gray-100 text-gray-600',
	VOIDED: 'bg-red-100 text-red-600',
	EXPIRED: 'bg-red-100 text-red-600',
	AUTHORIZED: 'bg-blue-100 text-blue-700',
	PARTIALLY_PAID: 'bg-yellow-100 text-yellow-700'
}

const fulfillmentStatusStyles = {
	FULFILLED: 'bg-green-100 text-green-700',
	UNFULFILLED: 'bg-orange-100 text-orange-700',
	PARTIALLY_FULFILLED: 'bg-blue-100 text-blue-700',
	IN_PROGRESS: 'bg-blue-100 text-blue-700',
	ON_HOLD: 'bg-yellow-100 text-yellow-700'
}

const localeMap = {
	pt: 'pt-BR',
	en: 'en-US',
	es: 'es-ES'
}

function getIntlLocale(i18nLang) {
	return localeMap[i18nLang] || i18nLang || 'pt-BR'
}

function formatCurrency(money, locale) {
	if (!money || !money.amount) return ''
	const amount = parseFloat(money.amount)
	if (isNaN(amount)) return ''
	const currency = money.currencyCode || 'BRL'
	try {
		return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
	} catch {
		return `${currency} ${amount.toFixed(2)}`
	}
}

function formatDate(dateString, locale) {
	if (!dateString) return ''
	try {
		return new Intl.DateTimeFormat(locale, {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		}).format(new Date(dateString))
	} catch {
		return dateString
	}
}

export default function OrderDetails(props) {
	const { id } = props.match.params
	const { t, i18n } = useTranslation()
	const locale = getIntlLocale(i18n.language)

	const [order, setOrder] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)

	useEffect(() => {
		loadOrder()
	}, [])

	const loadOrder = async () => {
		setLoading(true)
		setError(false)
		try {
			const result = await Shopify.customer.getOrder(decodeURIComponent(id))
			setOrder(result)
		} catch (err) {
			console.error(err)
			setError(true)
		} finally {
			setLoading(false)
		}
	}

	const title = t('account.orderDetail.title', 'Detalhes do Pedido')

	if (loading) {
		return (
			<Page title={title}>
				<HeaderContentWrapper className='justify-between'>
					<View className='flex items-center gap-4'>
						<HeaderReturn />
						<HeaderText text={title} />
					</View>
				</HeaderContentWrapper>
				<View className='flex flex-col items-center justify-center pt-20'>
					<Loading />
				</View>
			</Page>
		)
	}

	if (error || !order) {
		return (
			<Page title={title}>
				<HeaderContentWrapper className='justify-between'>
					<View className='flex items-center gap-4'>
						<HeaderReturn />
						<HeaderText text={title} />
					</View>
				</HeaderContentWrapper>
				<View className='flex flex-col items-center justify-center pt-16 px-6'>
					<View className='flex items-center justify-center w-[80px] h-[80px] rounded-full bg-red-50 mb-5'>
						<FiAlertCircle
							size={32}
							className='text-red-400'
						/>
					</View>
					<Text className='text-lg font-bold text-center mb-2'>
						{t('account.orderDetail.errorTitle', 'Erro ao carregar')}
					</Text>
					<Text className='text-base text-gray-500 text-center px-4 mb-6'>
						{t('account.orderDetail.errorDesc', 'Não foi possível carregar os detalhes do pedido.')}
					</Text>
					<CustomButton
						label={t('account.orderDetail.retry', 'Tentar novamente')}
						onClick={loadOrder}
					/>
				</View>
				<BottomInset />
			</Page>
		)
	}

	const lineItems = order.lineItems?.edges?.map(e => e.node) || []
	const fulfillments = order.fulfillments || []
	const shippingAddress = order.shippingAddress
	const financialStyle = financialStatusStyles[order.financialStatus] || 'bg-gray-100 text-gray-600'
	const fulfillmentStyle = fulfillmentStatusStyles[order.fulfillmentStatus] || 'bg-gray-100 text-gray-600'

	return (
		<Page title={`${title} ${order.name || ''}`}>
			<HeaderContentWrapper className='justify-between'>
				<View className='flex items-center gap-4'>
					<HeaderReturn />
					<HeaderText text={order.name || title} />
				</View>
			</HeaderContentWrapper>

			<View className='flex flex-col px-4 pt-4 gap-4 pb-4'>
				{/* Status Section */}
				<StatusSection
					order={order}
					t={t}
					locale={locale}
					financialStyle={financialStyle}
					fulfillmentStyle={fulfillmentStyle}
				/>

				{/* Line Items Section */}
				{lineItems.length > 0 && (
					<LineItemsSection
						items={lineItems}
						t={t}
						locale={locale}
					/>
				)}

				{/* Price Summary Section */}
				<PriceSummarySection
					order={order}
					t={t}
					locale={locale}
				/>

				{/* Fulfillment / Tracking Section */}
				{fulfillments.length > 0 && (
					<FulfillmentSection
						fulfillments={fulfillments}
						t={t}
						locale={locale}
					/>
				)}

				{/* Shipping Address Section */}
				{shippingAddress && (
					<ShippingAddressSection
						address={shippingAddress}
						t={t}
					/>
				)}

				{/* Payment Section */}
				{order.transactions && order.transactions.length > 0 && (
					<PaymentSection
						transactions={order.transactions}
						t={t}
						locale={locale}
					/>
				)}

				{/* View Status Button */}
				{order.statusPageUrl && (
					<View className='mt-2'>
						<CustomButton
							label={t('account.orderDetail.viewStatus', 'Ver status na loja')}
							onClick={() => Eitri.openBrowser({ url: order.statusPageUrl, inApp: true })}
							outlined
						/>
					</View>
				)}
			</View>

			<BottomInset />
		</Page>
	)
}

function StatusSection({ order, t, locale, financialStyle, fulfillmentStyle }) {
	return (
		<View className='flex flex-col bg-white rounded-lg border border-gray-200 p-4 gap-3'>
			{/* Badges */}
			<View className='flex flex-row flex-wrap gap-2'>
				{order.financialStatus && (
					<View className={`px-2 py-0.5 rounded-full ${financialStyle}`}>
						<Text className={`text-xs font-medium ${financialStyle}`}>
							{t(`account.orders.financial.${order.financialStatus}`, order.financialStatus)}
						</Text>
					</View>
				)}
				{order.fulfillmentStatus && (
					<View className={`px-2 py-0.5 rounded-full ${fulfillmentStyle}`}>
						<Text className={`text-xs font-medium ${fulfillmentStyle}`}>
							{t(`account.orders.fulfillment.${order.fulfillmentStatus}`, order.fulfillmentStatus)}
						</Text>
					</View>
				)}
			</View>

			{/* Order Date */}
			<View className='flex flex-row items-center gap-2'>
				<Text className='text-sm text-gray-500'>{t('account.orderDetail.orderDate', 'Data do pedido')}:</Text>
				<Text className='text-sm font-medium'>{formatDate(order.processedAt || order.createdAt, locale)}</Text>
			</View>
		</View>
	)
}

function LineItemsSection({ items, t, locale }) {
	return (
		<View className='flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden'>
			<View className='px-4 pt-4 pb-2'>
				<Text className='text-base font-semibold'>{t('account.orderDetail.items', 'Itens')}</Text>
			</View>

			<View className='flex flex-col px-4 pb-4 gap-3'>
				{items.map(item => (
					<View
						key={item.id}
						className='flex flex-row gap-3'>
						{item.image?.url ? (
							<Image
								src={item.image.url}
								className='w-[56px] h-[56px] rounded bg-gray-50 object-cover'
							/>
						) : (
							<View className='flex items-center justify-center w-[56px] h-[56px] rounded bg-gray-100'>
								<FiPackage
									size={20}
									className='text-gray-300'
								/>
							</View>
						)}
						<View className='flex flex-col flex-1 min-w-0'>
							<Text className='text-sm font-medium line-clamp-2'>{item.title}</Text>
							{item.variantTitle && (
								<Text className='text-xs text-gray-400'>
									{t('account.orderDetail.variant', 'Variante')}: {item.variantTitle}
								</Text>
							)}
							<View className='flex flex-row items-center justify-between mt-1'>
								<Text className='text-xs text-gray-400'>
									{t('account.orderDetail.qty', 'Qtd')}: {item.quantity}
								</Text>
								<Text className='text-sm font-medium'>
									{formatCurrency(item.totalPrice || item.price, locale)}
								</Text>
							</View>
							{item.discountAllocations && item.discountAllocations.length > 0 && (
								<Text className='text-xs text-green-600'>
									-{formatCurrency(item.discountAllocations[0].allocatedAmount, locale)}{' '}
									{t('account.orderDetail.discount', 'Desconto')}
								</Text>
							)}
						</View>
					</View>
				))}
			</View>
		</View>
	)
}

function PriceSummarySection({ order, t, locale }) {
	const shippingLine = order.shippingLine
	const hasDiscount = order.totalDiscounts && parseFloat(order.totalDiscounts.amount) > 0
	const hasTax = order.totalTax && parseFloat(order.totalTax.amount) > 0
	const hasRefund = order.totalRefunded && parseFloat(order.totalRefunded.amount) > 0

	return (
		<View className='flex flex-col bg-white rounded-lg border border-gray-200 p-4 gap-2'>
			{/* Subtotal */}
			<View className='flex flex-row items-center justify-between'>
				<Text className='text-sm text-gray-500'>{t('account.orderDetail.subtotal', 'Subtotal')}</Text>
				<Text className='text-sm'>{formatCurrency(order.subtotal, locale)}</Text>
			</View>

			{/* Shipping */}
			{shippingLine && (
				<View className='flex flex-row items-center justify-between'>
					<Text className='text-sm text-gray-500'>
						{t('account.orderDetail.shipping', 'Frete')}
						{shippingLine.title ? ` (${shippingLine.title})` : ''}
					</Text>
					<Text className='text-sm'>
						{parseFloat(shippingLine.originalPrice?.amount || '0') === 0
							? t('account.orderDetail.freeShipping', 'Grátis')
							: formatCurrency(shippingLine.originalPrice, locale)}
					</Text>
				</View>
			)}

			{/* Tax */}
			{hasTax && (
				<View className='flex flex-row items-center justify-between'>
					<Text className='text-sm text-gray-500'>{t('account.orderDetail.tax', 'Impostos')}</Text>
					<Text className='text-sm'>{formatCurrency(order.totalTax, locale)}</Text>
				</View>
			)}

			{/* Discounts */}
			{hasDiscount && (
				<View className='flex flex-row items-center justify-between'>
					<Text className='text-sm text-green-600'>{t('account.orderDetail.discount', 'Desconto')}</Text>
					<Text className='text-sm text-green-600'>-{formatCurrency(order.totalDiscounts, locale)}</Text>
				</View>
			)}

			{/* Total */}
			<View className='flex flex-row items-center justify-between pt-2 mt-1 border-t border-gray-100'>
				<Text className='text-base font-bold'>{t('account.orderDetail.total', 'Total')}</Text>
				<Text className='text-base font-bold'>{formatCurrency(order.totalPrice, locale)}</Text>
			</View>

			{/* Refunded */}
			{hasRefund && (
				<View className='flex flex-row items-center justify-between'>
					<Text className='text-sm text-gray-500'>{t('account.orderDetail.refunded', 'Reembolsado')}</Text>
					<Text className='text-sm text-gray-500'>{formatCurrency(order.totalRefunded, locale)}</Text>
				</View>
			)}
		</View>
	)
}

function FulfillmentSection({ fulfillments, t, locale }) {
	return (
		<View className='flex flex-col gap-3'>
			{fulfillments.map((fulfillment, index) => {
				const tracking = fulfillment.trackingInfo?.[0]
				return (
					<View
						key={index}
						className='flex flex-col bg-white rounded-lg border border-gray-200 p-4 gap-3'>
						<View className='flex flex-row items-center gap-2'>
							<FiTruck
								size={16}
								className='text-primary'
							/>
							<Text className='text-base font-semibold'>
								{t('account.orderDetail.tracking', 'Rastreamento')}
							</Text>
						</View>

						{fulfillment.status && (
							<View className='flex flex-row items-center gap-2'>
								<View
									className={`px-2 py-0.5 rounded-full ${fulfillmentStatusStyles[fulfillment.status] || 'bg-gray-100 text-gray-600'}`}>
									<Text
										className={`text-xs font-medium ${fulfillmentStatusStyles[fulfillment.status] || 'bg-gray-100 text-gray-600'}`}>
										{t(`account.orders.fulfillment.${fulfillment.status}`, fulfillment.status)}
									</Text>
								</View>
							</View>
						)}

						{tracking?.company && (
							<View className='flex flex-row items-center justify-between'>
								<Text className='text-sm text-gray-500'>
									{t('account.orderDetail.carrier', 'Transportadora')}
								</Text>
								<Text className='text-sm font-medium'>{tracking.company}</Text>
							</View>
						)}

						{tracking?.number && (
							<View className='flex flex-row items-center justify-between'>
								<Text className='text-sm text-gray-500'>
									{t('account.orderDetail.trackingNumber', 'Código de rastreio')}
								</Text>
								<Text className='text-sm font-medium'>{tracking.number}</Text>
							</View>
						)}

						{fulfillment.estimatedDeliveryAt && (
							<View className='flex flex-row items-center justify-between'>
								<Text className='text-sm text-gray-500'>
									{t('account.orderDetail.estimatedDelivery', 'Previsão de entrega')}
								</Text>
								<Text className='text-sm font-medium'>
									{formatDate(fulfillment.estimatedDeliveryAt, locale)}
								</Text>
							</View>
						)}

						{tracking?.url && (
							<View
								onClick={() => Eitri.openBrowser({ url: tracking.url, inApp: true })}
								className='flex flex-row items-center justify-center gap-2 p-2 rounded-lg border border-primary active:scale-[0.98] transition-transform mt-1'>
								<FiExternalLink
									size={14}
									className='text-primary'
								/>
								<Text className='text-sm font-medium text-primary'>
									{t('account.orderDetail.trackShipment', 'Rastrear envio')}
								</Text>
							</View>
						)}
					</View>
				)
			})}
		</View>
	)
}

function ShippingAddressSection({ address, t }) {
	const lines = [
		[address.firstName, address.lastName].filter(Boolean).join(' '),
		[address.address1, address.address2].filter(Boolean).join(', '),
		[address.city, address.province, address.zip].filter(Boolean).join(' - '),
		address.country
	].filter(Boolean)

	return (
		<View className='flex flex-col bg-white rounded-lg border border-gray-200 p-4 gap-3'>
			<View className='flex flex-row items-center gap-2'>
				<FiMapPin
					size={16}
					className='text-primary'
				/>
				<Text className='text-base font-semibold'>
					{t('account.orderDetail.shippingAddress', 'Endereço de entrega')}
				</Text>
			</View>

			<View className='flex flex-col gap-0.5'>
				{lines.map((line, i) => (
					<Text
						key={i}
						className='text-sm text-gray-700'>
						{line}
					</Text>
				))}
			</View>

			{address.phone && <Text className='text-sm text-gray-500'>{address.phone}</Text>}
		</View>
	)
}

function PaymentSection({ transactions, t, locale }) {
	return (
		<View className='flex flex-col bg-white rounded-lg border border-gray-200 p-4 gap-3'>
			<View className='flex flex-row items-center gap-2'>
				<FiCreditCard
					size={16}
					className='text-primary'
				/>
				<Text className='text-base font-semibold'>{t('account.orderDetail.payment', 'Pagamento')}</Text>
			</View>

			{transactions.map((tx, index) => (
				<View
					key={index}
					className='flex flex-col gap-1'>
					{tx.gateway && <Text className='text-sm font-medium'>{tx.gateway}</Text>}
					{tx.amount && <Text className='text-sm text-gray-500'>{formatCurrency(tx.amount, locale)}</Text>}
					{tx.status && (
						<View
							className={`self-start px-2 py-0.5 rounded-full ${financialStatusStyles[tx.status] || 'bg-gray-100 text-gray-600'}`}>
							<Text
								className={`text-xs font-medium ${financialStatusStyles[tx.status] || 'bg-gray-100 text-gray-600'}`}>
								{tx.status}
							</Text>
						</View>
					)}
				</View>
			))}
		</View>
	)
}
