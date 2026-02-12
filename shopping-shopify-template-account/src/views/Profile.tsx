import { useTranslation } from 'eitri-i18n'
import Eitri from 'eitri-bifrost'
import { Text, View, Loading } from 'eitri-luminus'
import { FiUser, FiShoppingBag, FiMapPin, FiChevronRight, FiMail, FiPhone, FiLogOut } from 'react-icons/fi'

import { Shopify, App } from 'eitri-shopping-shopify-shared'
import { useEffect, useState } from 'react'
import { HeaderContentWrapper, HeaderReturn, HeaderText } from 'shopping-shopify-template-shared'

export default function Profile(props) {
	const { t } = useTranslation()
	const [customer, setCustomer] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		App.configure({ verbose: true }).then(() => {
			loadCustomer()
		})
	}, [])

	const loadCustomer = async () => {
		try {
			const data = await Shopify.customer.getCurrentCustomer()
			setCustomer(data)
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	const goToOrders = () => {
		Eitri.navigation.navigate({ path: 'Orders' })
	}

	const goToAddresses = () => {
		Eitri.navigation.navigate({ path: 'Addresses' })
	}

	const handleLogout = async () => {
		try {
			await Shopify.customer.auth.logout()
			Eitri.navigation.back(-1)
		} catch (error) {
			console.error(error)
		}
	}

	if (loading) {
		return (
			<View className='flex flex-col items-center justify-center pt-20'>
				<Loading />
			</View>
		)
	}

	const initials = [customer?.firstName?.[0], customer?.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'

	return (
		<View className='flex flex-col pb-6'>
			<HeaderContentWrapper className={`justify-between`}>
				<View className={`flex items-center gap-4`}>
					<HeaderReturn />
					<HeaderText text={t('account.profile.title', 'Perfil')} />
				</View>
			</HeaderContentWrapper>
			{/* Profile Header */}
			<View className='flex flex-col items-center pt-6 pb-8 px-6'>
				<View className='flex items-center justify-center w-[80px] h-[80px] rounded-full bg-primary mb-4'>
					<Text className='text-2xl font-bold text-primary-content'>{initials}</Text>
				</View>

				<Text className='text-lg font-bold text-center'>
					{customer?.displayName || t('account.profile.unnamed', 'Usuário')}
				</Text>

				{customer?.emailAddress?.emailAddress && (
					<View className='flex items-center gap-1 mt-1'>
						<FiMail
							size={14}
							className='text-gray-400'
						/>
						<Text className='text-base text-gray-500'>{customer.emailAddress.emailAddress}</Text>
					</View>
				)}

				{customer?.phoneNumber?.phoneNumber && (
					<View className='flex items-center gap-1 mt-1'>
						<FiPhone
							size={14}
							className='text-gray-400'
						/>
						<Text className='text-base text-gray-500'>{customer.phoneNumber.phoneNumber}</Text>
					</View>
				)}
			</View>

			{/* Menu Cards */}
			<View className='flex flex-col px-4 gap-3'>
				{/* Orders Card */}
				<View
					onClick={goToOrders}
					className='flex flex-row items-center justify-between p-4 bg-white rounded-lg border border-gray-200 active:scale-[0.98] transition-transform'>
					<View className='flex flex-row items-center gap-3'>
						<View className='flex items-center justify-center w-[40px] h-[40px] rounded-full bg-primary/10'>
							<FiShoppingBag
								size={18}
								className='text-primary'
							/>
						</View>
						<View className='flex flex-col'>
							<Text className='text-base font-semibold'>{t('account.profile.orders', 'Meus Pedidos')}</Text>
							<Text className='text-sm text-gray-400'>
								{t('account.profile.ordersDesc', 'Acompanhe seus pedidos')}
							</Text>
						</View>
					</View>
					<FiChevronRight
						size={20}
						className='text-gray-400'
					/>
				</View>

				{/* Addresses Card */}
				<View
					onClick={goToAddresses}
					className='flex flex-row items-center justify-between p-4 bg-white rounded-lg border border-gray-200 active:scale-[0.98] transition-transform'>
					<View className='flex flex-row items-center gap-3'>
						<View className='flex items-center justify-center w-[40px] h-[40px] rounded-full bg-primary/10'>
							<FiMapPin
								size={18}
								className='text-primary'
							/>
						</View>
						<View className='flex flex-col'>
							<Text className='text-base font-semibold'>
								{t('account.profile.addresses', 'Meus Endereços')}
							</Text>
							<Text className='text-sm text-gray-400'>
								{t('account.profile.addressesDesc', 'Gerencie seus endereços')}
							</Text>
						</View>
					</View>
					<FiChevronRight
						size={20}
						className='text-gray-400'
					/>
				</View>

				{/* Personal Data Card */}
				<View
					onClick={() => Eitri.navigation.navigate({ path: 'EditProfile', state: { customer } })}
					className='flex flex-row items-center justify-between p-4 bg-white rounded-lg border border-gray-200 active:scale-[0.98] transition-transform'>
					<View className='flex flex-row items-center gap-3'>
						<View className='flex items-center justify-center w-[40px] h-[40px] rounded-full bg-primary/10'>
							<FiUser
								size={18}
								className='text-primary'
							/>
						</View>
						<View className='flex flex-col'>
							<Text className='text-base font-semibold'>
								{t('account.profile.personalData', 'Dados Pessoais')}
							</Text>
							<Text className='text-sm text-gray-400'>
								{t('account.profile.personalDataDesc', 'Edite suas informações')}
							</Text>
						</View>
					</View>
					<FiChevronRight
						size={20}
						className='text-gray-400'
					/>
				</View>
			</View>

			{/* Default Address Preview */}
			{customer?.defaultAddress && (
				<View className='flex flex-col mx-4 mt-6'>
					<Text className='text-base font-semibold mb-2 px-1'>
						{t('account.profile.defaultAddress', 'Endereço principal')}
					</Text>
					<View className='flex flex-col p-4 bg-gray-50 rounded-lg border border-gray-100'>
						<Text className='text-base text-gray-700'>
							{[customer.defaultAddress.address1, customer.defaultAddress.address2]
								.filter(Boolean)
								.join(', ')}
						</Text>
						<Text className='text-sm text-gray-500 mt-1'>
							{[
								customer.defaultAddress.city,
								customer.defaultAddress.province,
								customer.defaultAddress.zip
							]
								.filter(Boolean)
								.join(' - ')}
						</Text>
					</View>
				</View>
			)}

			{/* Logout */}
			<View className='px-4 mt-8'>
				<View
					onClick={handleLogout}
					className='flex flex-row items-center justify-center gap-2 p-3 rounded-lg border border-red-200 active:scale-[0.98] transition-transform'>
					<FiLogOut
						size={16}
						className='text-red-500'
					/>
					<Text className='text-base font-medium text-red-500'>
						{t('account.profile.logout', 'Sair da conta')}
					</Text>
				</View>
			</View>
		</View>
	)
}
