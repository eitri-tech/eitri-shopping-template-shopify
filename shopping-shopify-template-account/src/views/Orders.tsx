import { useTranslation } from 'eitri-i18n'
import Eitri from 'eitri-bifrost'
import { Text, View, Image, Loading, Page } from 'eitri-luminus'
import { HeaderContentWrapper, HeaderReturn, HeaderText, CustomButton, BottomInset } from 'shopping-shopify-template-shared'
import { FiPackage, FiShoppingBag, FiChevronRight } from 'react-icons/fi'

import { Shopify } from 'eitri-shopping-shopify-shared'
import { useInfiniteQuery } from '@tanstack/react-query'

const ORDERS_PER_PAGE = 10

const financialStatusStyles = {
	PAID: 'bg-green-100 text-green-700',
	PENDING: 'bg-yellow-100 text-yellow-700',
	REFUNDED: 'bg-gray-100 text-gray-600',
	PARTIALLY_REFUNDED: 'bg-gray-100 text-gray-600',
	VOIDED: 'bg-red-100 text-red-600',
	EXPIRED: 'bg-red-100 text-red-600',
	AUTHORIZED: 'bg-blue-100 text-blue-700',
	PARTIALLY_PAID: 'bg-yellow-100 text-yellow-700',
}

const fulfillmentStatusStyles = {
	FULFILLED: 'bg-green-100 text-green-700',
	UNFULFILLED: 'bg-orange-100 text-orange-700',
	PARTIALLY_FULFILLED: 'bg-blue-100 text-blue-700',
	IN_PROGRESS: 'bg-blue-100 text-blue-700',
	ON_HOLD: 'bg-yellow-100 text-yellow-700',
}

const localeMap = {
	pt: 'pt-BR',
	en: 'en-US',
	es: 'es-ES',
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
			year: 'numeric',
		}).format(new Date(dateString))
	} catch {
		return dateString
	}
}

export default function Orders(props) {
	const { t, i18n } = useTranslation()
	const locale = getIntlLocale(i18n.language)

	const {
		data,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ['orders'],
		queryFn: ({ pageParam }) =>
			Shopify.customer.getOrders({ first: ORDERS_PER_PAGE, after: pageParam }),
		getNextPageParam: (lastPage) => {
			if (!lastPage?.pageInfo?.hasNextPage) return undefined
			const edges = lastPage?.orders || []
			return edges.length > 0 ? edges[edges.length - 1].cursor : undefined
		},
	})

	const orders = data?.pages?.flatMap((page) => page?.orders || []) || []
	const title = t('account.orders.title', 'Meus Pedidos')

	return (
		<Page title={title}>
			<HeaderContentWrapper className='justify-between'>
				<View className='flex items-center gap-4'>
					<HeaderReturn />
					<HeaderText text={title} />
				</View>
			</HeaderContentWrapper>

			{isLoading ? (
				<View className='flex flex-col items-center justify-center pt-20'>
					<Loading />
				</View>
			) : orders.length === 0 ? (
				<EmptyOrders t={t} />
			) : (
				<View className='flex flex-col px-4 pt-4 gap-4 pb-4'>
					{orders.map((edge, index) => {
						const order = edge?.node || edge
						return (
							<OrderCard key={order?.id || index} order={order} t={t} locale={locale} />
						)
					})}

					{hasNextPage && (
						<View className='mt-2'>
							<CustomButton
								label={t('account.orders.loadMore', 'Carregar mais pedidos')}
								onClick={() => fetchNextPage()}
								isLoading={isFetchingNextPage}
								outlined
							/>
						</View>
					)}
				</View>
			)}

			<BottomInset />
		</Page>
	)
}

function EmptyOrders({ t }) {
	return (
		<View className='flex flex-col items-center justify-center pt-16 px-6'>
			<View className='flex items-center justify-center w-[80px] h-[80px] rounded-full bg-gray-100 mb-5'>
				<FiShoppingBag size={32} className='text-gray-400' />
			</View>

			<Text className='text-lg font-bold text-center mb-2'>
				{t('account.orders.empty', 'Nenhum pedido ainda')}
			</Text>

			<Text className='text-base text-gray-500 text-center px-4'>
				{t('account.orders.emptyDesc', 'Quando você fizer uma compra, seus pedidos aparecerão aqui.')}
			</Text>
		</View>
	)
}

function OrderCard({ order, t, locale }) {
	if (!order) return null

	const financialStyle = financialStatusStyles[order.financialStatus] || 'bg-gray-100 text-gray-600'
	const fulfillmentStyle = fulfillmentStatusStyles[order.fulfillmentStatus] || 'bg-gray-100 text-gray-600'

	const lineItems = order.lineItems?.edges?.map((e) => e.node) || []
	const visibleItems = lineItems.slice(0, 3)
	const remainingCount = lineItems.length - visibleItems.length

	// Use subtotal if totalPrice is zero (e.g. expired orders)
	const displayPrice = (parseFloat(order.totalPrice?.amount) === 0 && parseFloat(order.subtotal?.amount) > 0)
		? order.subtotal
		: order.totalPrice

	const handlePress = () => {
		Eitri.navigation.navigate({ path: `Order/${encodeURIComponent(order.id)}` })
	}

	return (
		<View
			onClick={handlePress}
			className='flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden active:scale-[0.98] transition-transform'>
			{/* Order Header */}
			<View className='flex flex-row items-center justify-between px-4 pt-4 pb-3'>
				<View className='flex flex-row items-center gap-2'>
					<FiPackage size={16} className='text-primary' />
					<Text className='text-base font-bold'>{order.name || `#${order.number}`}</Text>
				</View>
				<View className='flex flex-row items-center gap-2'>
					<Text className='text-sm text-gray-400'>
						{formatDate(order.processedAt || order.createdAt, locale)}
					</Text>
					<FiChevronRight size={16} className='text-gray-400' />
				</View>
			</View>

			{/* Status Badges */}
			<View className='flex flex-row px-4 pb-3 gap-2'>
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

			{/* Line Items */}
			{visibleItems.length > 0 && (
				<View className='flex flex-col px-4 pb-3 gap-2'>
					{visibleItems.map((item) => (
						<View key={item.id} className='flex flex-row items-center gap-3'>
							{item.image?.url ? (
								<Image
									src={item.image.url}
									className='w-[44px] h-[44px] rounded bg-gray-50 object-cover'
								/>
							) : (
								<View className='flex items-center justify-center w-[44px] h-[44px] rounded bg-gray-100'>
									<FiPackage size={16} className='text-gray-300' />
								</View>
							)}
							<View className='flex flex-col flex-1 min-w-0'>
								<Text className='text-sm font-medium line-clamp-1'>{item.title}</Text>
								<Text className='text-xs text-gray-400'>
									{t('account.orders.qty', 'Qtd')}: {item.quantity} · {formatCurrency(item.price, locale)}
								</Text>
							</View>
						</View>
					))}
					{remainingCount > 0 && (
						<Text className='text-xs text-gray-400 pl-[56px]'>
							+{remainingCount} {remainingCount === 1
								? t('account.orders.moreItem', 'item')
								: t('account.orders.moreItems', 'itens')}
						</Text>
					)}
				</View>
			)}

			{/* Order Total */}
			<View className='flex flex-row items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100'>
				<Text className='text-sm text-gray-500'>{t('account.orders.total', 'Total')}</Text>
				<Text className='text-base font-bold'>{formatCurrency(displayPrice, locale)}</Text>
			</View>
		</View>
	)
}
