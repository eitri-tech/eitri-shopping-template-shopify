// @ts-ignore
import { Text, View, TextInput, Button, Page, ScrollView } from 'eitri-luminus'
import { useState, useEffect } from 'react'
import { HeaderContentWrapper, HeaderReturn, HeaderText, BottomInset } from 'shopping-shopify-template-shared'
import { Shopify } from 'shopping-shopify-template-sdk'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'

export default function Account() {
	const { t } = useTranslation()

	const [customer, setCustomer] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const [updating, setUpdating] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [editing, setEditing] = useState(false)
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: ''
	})
	const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false)

	// Load customer data on component mount
	useEffect(() => {
		loadCustomerData()
	}, [])

	const loadCustomerData = async () => {
		try {
			const customerData = await Shopify.customer.getCurrentCustomer()
			if (customerData) {
				setCustomer(customerData)
				setFormData({
					firstName: customerData.firstName || '',
					lastName: customerData.lastName || '',
					email: customerData.email || '',
					phone: customerData.phone || ''
				})
			}
		} catch (err) {
			console.error('[Account] Erro ao carregar dados do cliente:', err)
			setError(t('account.loadError', 'Erro ao carregar dados da conta'))
		} finally {
			setLoading(false)
		}
	}

	const handleEditToggle = () => {
		if (editing) {
			// Cancel editing and revert to saved data
			if (customer) {
				setFormData({
					firstName: customer.firstName || '',
					lastName: customer.lastName || '',
					email: customer.email || '',
					phone: customer.phone || ''
				})
			}
		}
		setEditing(!editing)
	}

	const handleSave = async () => {
		if (!customer) return
		
		setUpdating(true)
		setError(null)
		
		try {
			const result = await Shopify.customer.updateCustomer({
				firstName: formData.firstName || undefined,
				lastName: formData.lastName || undefined,
				email: formData.email || undefined,
				phone: formData.phone || undefined
			})
			
			if (result.userErrors && result.userErrors.length > 0) {
				setError(result.userErrors[0].message)
				setUpdating(false)
				return
			}
			
			if (result.customer) {
				setCustomer(result.customer)
				setEditing(false)
			}
		} catch (err) {
			console.error('[Account] Erro ao atualizar dados do cliente:', err)
			setError(t('account.updateError', 'Erro ao atualizar dados da conta'))
		} finally {
			setUpdating(false)
		}
	}

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}))
	}

	const handleSignOut = async () => {
		try {
			await Shopify.customer.signOut()
			Eitri.navigation.navigate({ path: '/SignIn' })
		} catch (err) {
			console.error('[Account] Erro ao sair:', err)
			setError(t('account.signOutError', 'Erro ao sair da conta'))
		}
	}

	if (loading) {
		return (
			<Page title={t('account.title', 'Minha Conta')}>
				<HeaderContentWrapper>
					<HeaderReturn />
					<HeaderText text={t('account.title', 'Minha Conta')} />
					<View className='w-10' />
				</HeaderContentWrapper>
				
				<View className='flex-1 flex items-center justify-center'>
					<View className='loading loading-spinner loading-lg' />
				</View>
				
				<BottomInset />
			</Page>
		)
	}

	if (!customer) {
		return (
			<Page title={t('account.title', 'Minha Conta')}>
				<HeaderContentWrapper>
					<HeaderReturn />
					<HeaderText text={t('account.title', 'Minha Conta')} />
					<View className='w-10' />
				</HeaderContentWrapper>
				
				<View className='flex-1 flex flex-col items-center justify-center p-4'>
					<Text className='text-lg mb-4'>{t('account.notLoggedIn', 'Você não está conectado')}</Text>
					<Button 
						className='btn btn-primary'
						onClick={() => Eitri.navigation.navigate({ path: '/SignIn' })}
					>
						<Text className='text-white'>{t('account.signIn', 'Fazer login')}</Text>
					</Button>
				</View>
				
				<BottomInset />
			</Page>
		)
	}

	return (
		<Page title={t('account.title', 'Minha Conta')}>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('account.title', 'Minha Conta')} />
				<View className='w-10' />
			</HeaderContentWrapper>

			<ScrollView className="flex-1">
				<View className='p-4'>
					{/* Profile Section */}
					<View className='bg-white rounded-xl shadow-sm p-4 mb-4'>
						<View className='flex flex-row items-center mb-4'>
							<View className='w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4'>
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
									className='text-gray-500'
								>
									<path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
									<circle cx='12' cy='7' r='4'></circle>
								</svg>
							</View>
							<View>
								<Text className='text-lg font-semibold'>
									{customer.displayName || `${formData.firstName} ${formData.lastName}`.trim() || t('account.guest', 'Visitante')}
								</Text>
								<Text className='text-gray-500 text-sm'>{customer.email}</Text>
							</View>
						</View>

						{editing ? (
							<View className='space-y-4'>
								<View className='flex flex-row gap-4'>
									<View className='flex-1'>
										<Text className='text-sm font-medium mb-1'>{t('account.firstName', 'Nome')}</Text>
										<TextInput
											type='text'
											value={formData.firstName}
											onChange={e => handleInputChange('firstName', e.target.value)}
											placeholder={t('account.firstNamePlaceholder', 'Seu nome')}
											className='input input-bordered w-full h-12 px-4 py-3 rounded-lg'
											autoComplete='given-name'
										/>
									</View>
									<View className='flex-1'>
										<Text className='text-sm font-medium mb-1'>{t('account.lastName', 'Sobrenome')}</Text>
										<TextInput
											type='text'
											value={formData.lastName}
											onChange={e => handleInputChange('lastName', e.target.value)}
											placeholder={t('account.lastNamePlaceholder', 'Seu sobrenome')}
											className='input input-bordered w-full h-12 px-4 py-3 rounded-lg'
											autoComplete='family-name'
										/>
									</View>
								</View>

								<View>
									<Text className='text-sm font-medium mb-1'>{t('account.email', 'Email')}</Text>
									<TextInput
										type='email'
										value={formData.email}
										onChange={e => handleInputChange('email', e.target.value)}
										placeholder={t('account.emailPlaceholder', 'seu@email.com')}
										className='input input-bordered w-full h-12 px-4 py-3 rounded-lg'
										autoComplete='email'
									/>
								</View>

								<View>
									<Text className='text-sm font-medium mb-1'>{t('account.phone', 'Telefone')}</Text>
									<TextInput
										type='tel'
										value={formData.phone}
										onChange={e => handleInputChange('phone', e.target.value)}
										placeholder={t('account.phonePlaceholder', '(00) 00000-0000')}
										className='input input-bordered w-full h-12 px-4 py-3 rounded-lg'
										autoComplete='tel'
									/>
								</View>

								{error && (
									<View className='bg-red-50 p-3 rounded-lg'>
										<Text className='text-red-600 text-sm'>{error}</Text>
									</View>
								)}

								<View className='flex flex-row gap-2 mt-4'>
									<Button
										className='btn btn-outline flex-1 rounded-lg'
										onClick={handleEditToggle}
									>
										<Text className='text-gray-700'>{t('account.cancel', 'Cancelar')}</Text>
									</Button>
									<Button
										className='btn btn-primary flex-1 rounded-lg'
										onClick={handleSave}
										disabled={updating}
									>
										{updating ? (
											<View className='loading loading-spinner loading-xs' />
										) : (
											<Text className='text-white'>{t('account.save', 'Salvar')}</Text>
										)}
									</Button>
								</View>
							</View>
						) : (
							<View>
								<View className='grid grid-cols-2 gap-4 mb-4'>
									<View>
										<Text className='text-xs text-gray-500 uppercase'>{t('account.firstName', 'Nome')}</Text>
										<Text className='font-medium'>
											{customer.firstName || t('account.notProvided', 'Não informado')}
										</Text>
									</View>
									<View>
										<Text className='text-xs text-gray-500 uppercase'>{t('account.lastName', 'Sobrenome')}</Text>
										<Text className='font-medium'>
											{customer.lastName || t('account.notProvided', 'Não informado')}
										</Text>
									</View>
								</View>

								<View className='mb-4'>
									<Text className='text-xs text-gray-500 uppercase'>{t('account.email', 'Email')}</Text>
									<Text className='font-medium'>{customer.email}</Text>
								</View>

								<View className='mb-4'>
									<Text className='text-xs text-gray-500 uppercase'>{t('account.phone', 'Telefone')}</Text>
									<Text className='font-medium'>
										{customer.phone || t('account.notProvided', 'Não informado')}
									</Text>
								</View>

								<View className='mb-4'>
									<Text className='text-xs text-gray-500 uppercase'>{t('account.memberSince', 'Membro desde')}</Text>
									<Text className='font-medium'>
										{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : t('account.unknown', 'Desconhecido')}
									</Text>
								</View>

								<Button
									className='btn btn-outline w-full rounded-lg'
									onClick={handleEditToggle}
								>
									<Text className='text-gray-700'>{t('account.editProfile', 'Editar Perfil')}</Text>
								</Button>
							</View>
						)}
					</View>

					{/* Account Actions */}
					<View className='bg-white rounded-xl shadow-sm p-4 mb-4'>
						<Text className='text-lg font-semibold mb-3'>{t('account.accountActions', 'Ações da Conta')}</Text>
						
						<View className='space-y-2'>
							<Button
								className='btn btn-ghost w-full justify-start p-3 rounded-lg'
								onClick={() => Eitri.navigation.navigate({ path: '/Orders' })}
							>
								<View className='flex flex-row items-center'>
									<svg 
										xmlns='http://www.w3.org/2000/svg' 
										width='20' 
										height='20' 
										viewBox='0 0 24 24' 
										fill='none' 
										stroke='currentColor' 
										strokeWidth='2' 
										strokeLinecap='round' 
										strokeLinejoin='round'
										className='mr-3'
									>
										<circle cx='9' cy='21' r='1'></circle>
										<circle cx='20' cy='21' r='1'></circle>
										<path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'></path>
									</svg>
									<Text>{t('account.myOrders', 'Meus Pedidos')}</Text>
								</View>
							</Button>
							
							<Button
								className='btn btn-ghost w-full justify-start p-3 rounded-lg'
								onClick={() => Eitri.navigation.navigate({ path: '/Addresses' })}
							>
								<View className='flex flex-row items-center'>
									<svg 
										xmlns='http://www.w3.org/2000/svg' 
										width='20' 
										height='20' 
										viewBox='0 0 24 24' 
										fill='none' 
										stroke='currentColor' 
										strokeWidth='2' 
										strokeLinecap='round' 
										strokeLinejoin='round'
										className='mr-3'
									>
										<path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
										<circle cx='12' cy='10' r='3'></circle>
									</svg>
									<Text>{t('account.addressBook', 'Livro de Endereços')}</Text>
								</View>
							</Button>
							
							<Button
								className='btn btn-ghost w-full justify-start p-3 rounded-lg'
								onClick={() => Eitri.navigation.navigate({ path: '/PaymentMethods' })}
							>
								<View className='flex flex-row items-center'>
									<svg 
										xmlns='http://www.w3.org/2000/svg' 
										width='20' 
										height='20' 
										viewBox='0 0 24 24' 
										fill='none' 
										stroke='currentColor' 
										strokeWidth='2' 
										strokeLinecap='round' 
										strokeLinejoin='round'
										className='mr-3'
									>
										<rect x='3' y='5' width='18' height='14' rx='2'></rect>
										<line x1='3' y1='10' x2='21' y2='10'></line>
										<line x1='7' y1='15' x2='7.01' y2='15'></line>
										<line x1='11' y1='15' x2='13' y2='15'></line>
									</svg>
									<Text>{t('account.paymentMethods', 'Métodos de Pagamento')}</Text>
								</View>
							</Button>
						</View>
					</View>

					{/* Security Section */}
					<View className='bg-white rounded-xl shadow-sm p-4'>
						<Text className='text-lg font-semibold mb-3'>{t('account.security', 'Segurança')}</Text>
						
						<View className='space-y-2'>
							<Button
								className='btn btn-ghost w-full justify-start p-3 rounded-lg'
								onClick={() => Eitri.navigation.navigate({ path: '/ChangePassword' })}
							>
								<View className='flex flex-row items-center'>
									<svg 
										xmlns='http://www.w3.org/2000/svg' 
										width='20' 
										height='20' 
										viewBox='0 0 24 24' 
										fill='none' 
										stroke='currentColor' 
										strokeWidth='2' 
										strokeLinecap='round' 
										strokeLinejoin='round'
										className='mr-3'
									>
										<rect x='3' y='11' width='18' height='11' rx='2'></rect>
										<path d='M7 11V7a5 5 0 0 1 10 0v4'></path>
									</svg>
									<Text>{t('account.changePassword', 'Alterar Senha')}</Text>
								</View>
							</Button>
							
							<Button
								className='btn btn-ghost w-full justify-start p-3 rounded-lg text-red-600'
								onClick={() => setShowSignOutConfirmation(true)}
							>
								<View className='flex flex-row items-center'>
									<svg 
										xmlns='http://www.w3.org/2000/svg' 
										width='20' 
										height='20' 
										viewBox='0 0 24 24' 
										fill='none' 
										stroke='currentColor' 
										strokeWidth='2' 
										strokeLinecap='round' 
										strokeLinejoin='round'
										className='mr-3'
									>
										<path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'></path>
										<polyline points='16 17 21 12 16 7'></polyline>
										<line x1='21' y1='12' x2='9' y2='12'></line>
									</svg>
									<Text>{t('account.signOut', 'Sair da Conta')}</Text>
								</View>
							</Button>
						</View>
					</View>
				</View>
			</ScrollView>

			{/* Sign Out Confirmation Modal */}
			{showSignOutConfirmation && (
				<View className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<View className='bg-white rounded-xl p-6 w-full max-w-md'>
						<Text className='text-lg font-semibold mb-2'>{t('account.signOutTitle', 'Sair da Conta')}</Text>
						<Text className='text-gray-600 mb-6'>{t('account.signOutMessage', 'Tem certeza que deseja sair da sua conta?')}</Text>
						
						<View className='flex flex-row gap-2'>
							<Button
								className='btn btn-outline flex-1 rounded-lg'
								onClick={() => setShowSignOutConfirmation(false)}
							>
								<Text className='text-gray-700'>{t('account.cancel', 'Cancelar')}</Text>
							</Button>
							<Button
								className='btn btn-error flex-1 rounded-lg'
								onClick={handleSignOut}
							>
								<Text className='text-white'>{t('account.signOut', 'Sair')}</Text>
							</Button>
						</View>
					</View>
				</View>
			)}

			<BottomInset />
		</Page>
	)
}