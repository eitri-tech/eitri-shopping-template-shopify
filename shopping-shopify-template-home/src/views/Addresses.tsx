// @ts-ignore
import { Text, View, TextInput, Button, Page, ScrollView } from 'eitri-luminus'
import { useState, useEffect } from 'react'
import { HeaderContentWrapper, HeaderReturn, HeaderText, BottomInset } from 'shopping-shopify-template-shared'
import { Shopify } from 'shopping-shopify-template-sdk'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'

export default function Addresses() {
	const { t } = useTranslation()

	const [customer, setCustomer] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const [addresses, setAddresses] = useState<any[]>([])
	const [showAddForm, setShowAddForm] = useState(false)
	const [editingAddress, setEditingAddress] = useState<any>(null)
	const [deletingAddress, setDeletingAddress] = useState<string | null>(null)
	const [form, setForm] = useState({
		firstName: '',
		lastName: '',
		address1: '',
		address2: '',
		city: '',
		province: '',
		country: '',
		zip: '',
		phone: ''
	})
	const [error, setError] = useState<string | null>(null)

	// Load customer data and addresses
	useEffect(() => {
		loadCustomerData()
	}, [])

	const loadCustomerData = async () => {
		try {
			const customerData = await Shopify.customer.getCurrentCustomer()
			if (customerData) {
				setCustomer(customerData)
				setAddresses(customerData.addresses?.edges?.map((edge: any) => edge.node) || [])
			}
		} catch (err) {
			console.error('[Addresses] Erro ao carregar dados do cliente:', err)
			setError(t('addresses.loadError', 'Erro ao carregar endereços'))
		} finally {
			setLoading(false)
		}
	}

	const handleFormChange = (field: string, value: string) => {
		setForm(prev => ({
			...prev,
			[field]: value
		}))
	}

	const resetForm = () => {
		setForm({
			firstName: '',
			lastName: '',
			address1: '',
			address2: '',
			city: '',
			province: '',
			country: '',
			zip: '',
			phone: ''
		})
	}

	const handleAddAddress = async () => {
		if (!validateForm()) return

		try {
			const result = await Shopify.customer.createAddress({
				firstName: form.firstName || undefined,
				lastName: form.lastName || undefined,
				address1: form.address1 || undefined,
				address2: form.address2 || undefined,
				city: form.city || undefined,
				province: form.province || undefined,
				country: form.country || undefined,
				zip: form.zip || undefined,
				phone: form.phone || undefined
			})

			if (result.userErrors && result.userErrors.length > 0) {
				setError(result.userErrors[0].message)
				return
			}

			if (result.address) {
				setAddresses(prev => [...prev, result.address])
				setShowAddForm(false)
				resetForm()
			}
		} catch (err) {
			console.error('[Addresses] Erro ao adicionar endereço:', err)
			setError(t('addresses.addError', 'Erro ao adicionar endereço'))
		}
	}

	const handleUpdateAddress = async () => {
		if (!editingAddress || !validateForm()) return

		try {
			const result = await Shopify.customer.updateAddress(editingAddress.id, {
				firstName: form.firstName || undefined,
				lastName: form.lastName || undefined,
				address1: form.address1 || undefined,
				address2: form.address2 || undefined,
				city: form.city || undefined,
				province: form.province || undefined,
				country: form.country || undefined,
				zip: form.zip || undefined,
				phone: form.phone || undefined
			})

			if (result.userErrors && result.userErrors.length > 0) {
				setError(result.userErrors[0].message)
				return
			}

			if (result.address) {
				setAddresses(prev => prev.map(addr => addr.id === editingAddress.id ? result.address : addr))
				setEditingAddress(null)
				setShowAddForm(false)
				resetForm()
			}
		} catch (err) {
			console.error('[Addresses] Erro ao atualizar endereço:', err)
			setError(t('addresses.updateError', 'Erro ao atualizar endereço'))
		}
	}

	const handleDeleteAddress = async (addressId: string) => {
		try {
			const result = await Shopify.customer.deleteAddress(addressId)

			if (result.userErrors && result.userErrors.length > 0) {
				setError(result.userErrors[0].message)
				return
			}

			if (result.success) {
				setAddresses(prev => prev.filter(addr => addr.id !== addressId))
				setDeletingAddress(null)
			}
		} catch (err) {
			console.error('[Addresses] Erro ao excluir endereço:', err)
			setError(t('addresses.deleteError', 'Erro ao excluir endereço'))
		}
	}

	const validateForm = (): boolean => {
		if (!form.firstName || !form.lastName || !form.address1 || !form.city || !form.country || !form.zip) {
			setError(t('addresses.requiredFields', 'Por favor, preencha todos os campos obrigatórios'))
			return false
		}
		return true
	}

	const startEditAddress = (address: any) => {
		setEditingAddress(address)
		setForm({
			firstName: address.firstName || '',
			lastName: address.lastName || '',
			address1: address.address1 || '',
			address2: address.address2 || '',
			city: address.city || '',
			province: address.province || '',
			country: address.country || '',
			zip: address.zip || '',
			phone: address.phone || ''
		})
		setShowAddForm(true)
	}

	const cancelEdit = () => {
		setEditingAddress(null)
		setShowAddForm(false)
		resetForm()
	}

	if (loading) {
		return (
			<Page title={t('addresses.title', 'Endereços')}>
				<HeaderContentWrapper>
					<HeaderReturn />
					<HeaderText text={t('addresses.title', 'Endereços')} />
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
		<Page title={t('addresses.title', 'Endereços')}>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('addresses.title', 'Endereços')} />
				<View className='w-10' />
			</HeaderContentWrapper>

			<ScrollView className="flex-1">
				<View className='p-4'>
					{error && (
						<View className='bg-red-50 p-3 rounded-lg mb-4'>
							<Text className='text-red-600 text-sm'>{error}</Text>
						</View>
					)}

					{!showAddForm ? (
						<>
							<Button
								className='btn btn-primary w-full mb-4 rounded-lg'
								onClick={() => {
									resetForm()
									setShowAddForm(true)
								}}
							>
								<Text className='text-white font-semibold'>{t('addresses.addNew', 'Adicionar Novo Endereço')}</Text>
							</Button>

							{addresses.length === 0 ? (
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
											<path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
											<circle cx='12' cy='10' r='3'></circle>
										</svg>
									</View>
									<Text className='text-lg font-medium mb-2'>{t('addresses.noAddresses', 'Nenhum endereço cadastrado')}</Text>
									<Text className='text-gray-500'>{t('addresses.noAddressesDescription', 'Adicione um endereço para facilitar suas compras futuras')}</Text>
								</View>
							) : (
								<View className='space-y-4'>
									{addresses.map((address) => (
										<View key={address.id} className='bg-white rounded-xl shadow-sm p-4'>
											<View className='flex flex-row justify-between items-start'>
												<View className='flex-1'>
													<Text className='font-semibold'>
														{address.firstName} {address.lastName}
													</Text>
													<Text className='text-gray-600 mt-1'>
														{address.address1}{address.address2 ? `, ${address.address2}` : ''}
													</Text>
													<Text className='text-gray-600'>
														{address.city}, {address.province} {address.zip}
													</Text>
													<Text className='text-gray-600'>
														{address.country}
													</Text>
													{address.phone && (
														<Text className='text-gray-600'>
															{address.phone}
														</Text>
													)}
												</View>
												<View className='flex flex-col space-y-2 ml-2'>
													<Button
														className='btn btn-ghost btn-sm'
														onClick={() => startEditAddress(address)}
													>
														<svg 
															xmlns='http://www.w3.org/2000/svg' 
															width='16' 
															height='16' 
															viewBox='0 0 24 24' 
															fill='none' 
															stroke='currentColor' 
															strokeWidth='2' 
															strokeLinecap='round' 
															strokeLinejoin='round'
														>
															<path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path>
															<path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path>
														</svg>
													</Button>
													<Button
														className='btn btn-ghost btn-sm'
														onClick={() => setDeletingAddress(address.id)}
													>
														<svg 
															xmlns='http://www.w3.org/2000/svg' 
															width='16' 
															height='16' 
															viewBox='0 0 24 24' 
															fill='none' 
															stroke='currentColor' 
															strokeWidth='2' 
															strokeLinecap='round' 
															strokeLinejoin='round'
														>
															<path d='M3 6h18'></path>
															<path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>
														</svg>
													</Button>
												</View>
											</View>
											
											{customer.defaultAddress?.id === address.id && (
												<View className='mt-2 pt-2 border-t border-gray-100'>
													<Text className='text-xs text-blue-600 font-medium'>{t('addresses.defaultAddress', 'ENDEREÇO PRINCIPAL')}</Text>
												</View>
											)}
										</View>
									))}
								</View>
							)}
						</>
					) : (
						<View className='bg-white rounded-xl shadow-sm p-4'>
							<Text className='text-lg font-semibold mb-4'>
								{editingAddress ? t('addresses.editAddress', 'Editar Endereço') : t('addresses.addAddress', 'Adicionar Endereço')}
							</Text>
							
							<View className='space-y-4'>
								<View className='flex flex-row gap-4'>
									<View className='flex-1'>
										<Text className='text-sm font-medium mb-1'>{t('addresses.firstName', 'Nome')}</Text>
										<TextInput
											type='text'
											value={form.firstName}
											onChange={e => handleFormChange('firstName', e.target.value)}
											placeholder={t('addresses.firstNamePlaceholder', 'Seu nome')}
											className='input input-bordered w-full h-12 px-4 py-3 rounded-lg'
											autoComplete='given-name'
										/>
									</View>
									<View className='flex-1'>
										<Text className='text-sm font-medium mb-1'>{t('addresses.lastName', 'Sobrenome')}</Text>
										<TextInput
											type='text'
											value={form.lastName}
											onChange={e => handleFormChange('lastName', e.target.value)}
											placeholder={t('addresses.lastNamePlaceholder', 'Seu sobrenome')}
											className='input input-bordered w-full h-12 px-4 py-3 rounded-lg'
											autoComplete='family-name'
										/>
									</View>
								</View>

								<View>
									<Text className='text-sm font-medium mb-1'>{t('addresses.addressLine1', 'Endereço')}</Text>
									<TextInput
										type='text'
										value={form.address1}
										onChange={e => handleFormChange('address1', e.target.value)}
										placeholder={t('addresses.addressLine1Placeholder', 'Rua, número, complemento')}
										className='input input-bordered w-full h-12 px-4 py-3 rounded-lg'
										autoComplete='address-line1'
									/>
								</View>

								<View>
									<Text className='text-sm font-medium mb-1'>{t('addresses.addressLine2', 'Complemento (opcional)')}</Text>
									<TextInput
										type='text'
										value={form.address2}
										onChange={e => handleFormChange('address2', e.target.value)}
										placeholder={t('addresses.addressLine2Placeholder', 'Apartamento, bloco, etc.')}
										className='input input-bordered w-full h-12 px-4 py-3 rounded-lg'
										autoComplete='address-line2'
									/>
								</View>

								<View className='flex flex-row gap-4'>
									<View className='flex-1'>
										<Text className='text-sm font-medium mb-1'>{t('addresses.city', 'Cidade')}</Text>
										<TextInput
											type='text'
											value={form.city}
											onChange={e => handleFormChange('city', e.target.value)}
											placeholder={t('addresses.cityPlaceholder', 'Sua cidade')}
											className='input input-bordered w-full h-12 px-4 py-3 rounded-lg'
											autoComplete='address-level2'
										/>
									</View>
									<View className='flex-1'>
										<Text className='text-sm font-medium mb-1'>{t('addresses.state', 'Estado')}</Text>
										<TextInput
											type='text'
											value={form.province}
											onChange={e => handleFormChange('province', e.target.value)}
											placeholder={t('addresses.statePlaceholder', 'Seu estado')}
											className='input input-bordered w-full h-12 px-4 py-3 rounded-lg'
											autoComplete='address-level1'
										/>
									</View>
								</View>

								<View className='flex flex-row gap-4'>
									<View className='flex-1'>
										<Text className='text-sm font-medium mb-1'>{t('addresses.country', 'País')}</Text>
										<TextInput
											type='text'
											value={form.country}
											onChange={e => handleFormChange('country', e.target.value)}
											placeholder={t('addresses.countryPlaceholder', 'Seu país')}
											className='input input-bordered w-full h-12 px-4 py-3 rounded-lg'
											autoComplete='country'
										/>
									</View>
									<View className='flex-1'>
										<Text className='text-sm font-medium mb-1'>{t('addresses.zipCode', 'CEP')}</Text>
										<TextInput
											type='text'
											value={form.zip}
											onChange={e => handleFormChange('zip', e.target.value)}
											placeholder={t('addresses.zipCodePlaceholder', '00000-000')}
											className='input input-bordered w-full h-12 px-4 py-3 rounded-lg'
											autoComplete='postal-code'
										/>
									</View>
								</View>

								<View>
									<Text className='text-sm font-medium mb-1'>{t('addresses.phone', 'Telefone (opcional)')}</Text>
									<TextInput
										type='tel'
										value={form.phone}
										onChange={e => handleFormChange('phone', e.target.value)}
										placeholder={t('addresses.phonePlaceholder', '(00) 00000-0000')}
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
										onClick={cancelEdit}
									>
										<Text className='text-gray-700'>{t('addresses.cancel', 'Cancelar')}</Text>
									</Button>
									<Button
										className='btn btn-primary flex-1 rounded-lg'
										onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
									>
										<Text className='text-white'>
											{editingAddress ? t('addresses.save', 'Salvar') : t('addresses.add', 'Adicionar')}
										</Text>
									</Button>
								</View>
							</View>
						</View>
					)}
				</View>
			</ScrollView>

			{/* Delete Confirmation Modal */}
			{deletingAddress && (
				<View className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<View className='bg-white rounded-xl p-6 w-full max-w-md'>
						<Text className='text-lg font-semibold mb-2'>{t('addresses.deleteTitle', 'Excluir Endereço')}</Text>
						<Text className='text-gray-600 mb-6'>{t('addresses.deleteMessage', 'Tem certeza que deseja excluir este endereço? Esta ação não pode ser desfeita.')}</Text>
						
						<View className='flex flex-row gap-2'>
							<Button
								className='btn btn-outline flex-1 rounded-lg'
								onClick={() => setDeletingAddress(null)}
							>
								<Text className='text-gray-700'>{t('addresses.cancel', 'Cancelar')}</Text>
							</Button>
							<Button
								className='btn btn-error flex-1 rounded-lg'
								onClick={() => handleDeleteAddress(deletingAddress)}
							>
								<Text className='text-white'>{t('addresses.delete', 'Excluir')}</Text>
							</Button>
						</View>
					</View>
				</View>
			)}

			<BottomInset />
		</Page>
	)
}