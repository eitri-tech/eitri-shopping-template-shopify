// @ts-ignore
import { Text, View, Button, Page, ScrollView } from 'eitri-luminus'
import { useState, useEffect } from 'react'
import { HeaderContentWrapper, HeaderReturn, HeaderText, BottomInset } from 'shopping-shopify-template-shared'
import { Shopify } from 'shopping-shopify-template-sdk'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'

export default function Orders() {
	const { t } = useTranslation()

	const [customer, setCustomer] = useState<any>(null)
	const [orders, setOrders] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Load customer orders
	useEffect(() => {
		loadOrders()
	}, [])

	const loadOrders = async () => {
		try {
			const customerData = await Shopify.customer.getCurrentCustomer()
			if (customerData) {
				setCustomer(customerData)
				setOrders(customerData.orders?.edges?.map((edge: any) => edge.node) || [])
			}
		} catch (err) {
			console.error('[Orders] Erro ao carregar pedidos:', err)
			setError(t('orders.loadError', 'Erro ao carregar pedidos'))
		} finally {
			setLoading(false)
		}
	}

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'paid':
			case 'fulfilled':
				return 'text-green-600 bg-green-100'
			case 'pending':
			case 'processing':
				return 'text-yellow-600 bg-yellow-100'
			case 'cancelled':
				return 'text-red-600 bg-red-100'
			case 'refunded':
				return 'text-gray-600 bg-gray-100'
			default:
				return 'text-blue-600 bg-blue-100'
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		})
	}

	if (loading) {
		return (
			<Page title={t('orders.title', 'Meus Pedidos')}>
				<HeaderContentWrapper>
					<HeaderReturn />
					<HeaderText text={t('orders.title', 'Meus Pedidos')} />
					<View className='w-10' />
				</HeaderContentWrapper>
				
				<View className='flex-1 flex items-center justify-center'>
					<View className='loading loading-spinner loading-lg' />
				</View>
				
				<BottomInset />
			</Page>
		)
	}

	return (
		<Page title={t('orders.title', 'Meus Pedidos')}>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('orders.title', 'Meus Pedidos')} />
				<View className='w-10' />
			</HeaderContentWrapper>

			<ScrollView className="flex-1">
				<View className='p-4'>
					{error && (
						<View className='bg-red-50 p-3 rounded-lg mb-4'>
							<Text className='text-red-600 text-sm'>{error}</Text>
						</View>
					)}

					{orders.length === 0 ? (
						<View className='bg-white rounded-xl shadow-sm p-8 text-center'>
							<View className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
								<svg 
									xmlns='http://www.w3.org/2000/svg' 
									width='32' 
									height='32' 
									viewBox='0 0 24 24' 
									fill='none' 
									stroke='currentColor' 
									strokeWidth='2' 
									strokeLinecap='round' 
									strokeLinejoin='round'
									className='text-gray-400'
								>
									<circle cx='9' cy='21' r='1'></circle>
									<circle cx='20' cy='21' r='1'></circle>
									<path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'></path>
								</svg>
							</View>
							<Text className='text-lg font-medium mb-2'>{t('orders.noOrders', 'Nenhum pedido encontrado')}</Text>
							<Text className='text-gray-500'>{t('orders.noOrdersDescription', 'Você ainda não realizou nenhum pedido conosco')}</Text>
						</View>
					) : (
						<View className='space-y-4'>
							{orders.map((order) => (
								<View key={order.id} className='bg-white rounded-xl shadow-sm p-4'>
									<View className='flex flex-row justify-between items-start mb-3'>
										<View>
											<Text className='font-semibold text-lg'>#{order.orderNumber}</Text>
											<Text className='text-gray-500 text-sm'>{formatDate(order.processedAt)}</Text>
										</View>
										<View className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.financialStatus)}`}>
											{t(`orders.status.${order.financialStatus.toLowerCase()}`, order.financialStatus)}
										</View>
									</View>
									
									<View className='flex flex-row justify-between items-center'>
										<View>
											<Text className='text-gray-600 text-sm'>{t('orders.total', 'Total')}</Text>
											<Text className='font-semibold'>{order.totalPrice.amount} {order.totalPrice.currencyCode}</Text>
										</View>
										
										<Button
											className='btn btn-outline btn-sm'
											onClick={() => Eitri.navigation.navigate({ path: `/Order/${order.id}` })}
										>
											<Text>{t('orders.viewDetails', 'Ver Detalhes')}</Text>
										</Button>
									</View>
								</View>
							))}
						</View>
					)}
				</View>
			</ScrollView>

			<BottomInset />
		</Page>
	)
}