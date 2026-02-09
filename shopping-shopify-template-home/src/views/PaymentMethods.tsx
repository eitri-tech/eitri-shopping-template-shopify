// @ts-ignore
import { Text, View, Button, Page, ScrollView } from 'eitri-luminus'
import { useState, useEffect } from 'react'
import { HeaderContentWrapper, HeaderReturn, HeaderText, BottomInset } from 'shopping-shopify-template-shared'
import { Shopify } from 'shopping-shopify-template-sdk'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'

export default function PaymentMethods() {
	const { t } = useTranslation()

	const [paymentMethods, setPaymentMethods] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Load payment methods
	useEffect(() => {
		loadPaymentMethods()
	}, [])

	const loadPaymentMethods = async () => {
		try {
			// Note: Shopify's GraphQL API doesn't directly expose stored payment methods
			// This is a simulated implementation showing how it would work
			// In a real implementation, you would need to integrate with Shopify's Payment API
			// or use a third-party payment processor that supports stored payment methods
			
			// Simulated payment methods for demonstration
			setPaymentMethods([
				{
					id: 'card-1',
					type: 'credit_card',
					lastFour: '4242',
					expiry: '12/25',
					holder: 'John Doe',
					isDefault: true
				},
				{
					id: 'card-2',
					type: 'debit_card',
					lastFour: '1234',
					expiry: '06/24',
					holder: 'John Doe',
					isDefault: false
				}
			])
		} catch (err) {
			console.error('[PaymentMethods] Erro ao carregar métodos de pagamento:', err)
			setError(t('paymentMethods.loadError', 'Erro ao carregar métodos de pagamento'))
		} finally {
			setLoading(false)
		}
	}

	const getCardIcon = (type: string) => {
		switch (type) {
			case 'credit_card':
				return (
					<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
						<rect x='3' y='5' width='18' height='14' rx='2'></rect>
						<line x1='3' y1='10' x2='21' y2='10'></line>
						<line x1='7' y1='15' x2='7.01' y2='15'></line>
						<line x1='11' y1='15' x2='13' y2='15'></line>
					</svg>
				)
			case 'debit_card':
				return (
					<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
						<rect x='3' y='5' width='18' height='14' rx='2'></rect>
						<line x1='3' y1='10' x2='21' y2='10'></line>
						<circle cx='12' cy='15' r='1'></circle>
					</svg>
				)
			default:
				return (
					<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
						<rect x='3' y='5' width='18' height='14' rx='2'></rect>
						<line x1='3' y1='10' x2='21' y2='10'></line>
					</svg>
				)
		}
	}

	if (loading) {
		return (
			<Page title={t('paymentMethods.title', 'Métodos de Pagamento')}>
				<HeaderContentWrapper>
					<HeaderReturn />
					<HeaderText text={t('paymentMethods.title', 'Métodos de Pagamento')} />
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
		<Page title={t('paymentMethods.title', 'Métodos de Pagamento')}>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('paymentMethods.title', 'Métodos de Pagamento')} />
				<View className='w-10' />
			</HeaderContentWrapper>

			<ScrollView className="flex-1">
				<View className='p-4'>
					{error && (
						<View className='bg-red-50 p-3 rounded-lg mb-4'>
							<Text className='text-red-600 text-sm'>{error}</Text>
						</View>
					)}

					<Button
						className='btn btn-primary w-full mb-4 rounded-lg'
						onClick={() => Eitri.navigation.navigate({ path: '/AddPaymentMethod' })}
					>
						<Text className='text-white font-semibold'>{t('paymentMethods.addNew', 'Adicionar Método de Pagamento')}</Text>
					</Button>

					{paymentMethods.length === 0 ? (
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
									<rect x='3' y='5' width='18' height='14' rx='2'></rect>
									<line x1='3' y1='10' x2='21' y2='10'></line>
									<line x1='7' y1='15' x2='7.01' y2='15'></line>
									<line x1='11' y1='15' x2='13' y2='15'></line>
								</svg>
							</View>
							<Text className='text-lg font-medium mb-2'>{t('paymentMethods.noMethods', 'Nenhum método de pagamento cadastrado')}</Text>
							<Text className='text-gray-500'>{t('paymentMethods.noMethodsDescription', 'Adicione um método de pagamento para agilizar suas próximas compras')}</Text>
						</View>
					) : (
						<View className='space-y-4'>
							{paymentMethods.map((method) => (
								<View key={method.id} className='bg-white rounded-xl shadow-sm p-4'>
									<View className='flex flex-row justify-between items-center'>
										<View className='flex flex-row items-center'>
											<View className='mr-3 text-gray-600'>
												{getCardIcon(method.type)}
											</View>
											<View>
												<Text className='font-semibold'>
													{method.type === 'credit_card' ? t('paymentMethods.creditCard', 'Cartão de Crédito') : t('paymentMethods.debitCard', 'Cartão de Débito')}
												</Text>
												<Text className='text-gray-600'>**** **** **** {method.lastFour}</Text>
												<Text className='text-gray-600 text-sm'>{t('paymentMethods.expiry', 'Válido até')} {method.expiry}</Text>
											</View>
										</View>
										
										<View className='flex flex-col items-end'>
											{method.isDefault && (
												<View className='px-2 py-1 bg-blue-100 rounded-full'>
													<Text className='text-blue-600 text-xs font-medium'>{t('paymentMethods.default', 'PRINCIPAL')}</Text>
												</View>
											)}
											<Button
												className='btn btn-ghost btn-sm mt-2'
												onClick={() => Eitri.navigation.navigate({ path: `/EditPaymentMethod/${method.id}` })}
											>
												<Text className='text-gray-600'>{t('paymentMethods.edit', 'Editar')}</Text>
											</Button>
										</View>
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