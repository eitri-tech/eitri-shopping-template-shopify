import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { Text, View, Page } from 'eitri-luminus'
import {
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText,
	CustomButton,
	BottomInset
} from 'shopping-shopify-template-shared'
import { FiUser, FiShoppingBag, FiHeart, FiMapPin } from 'react-icons/fi'

import { Shopify } from 'eitri-shopping-shopify-shared'
import { useEffect, useState } from 'react'
import Profile from './Profile'

export default function Home(props) {
	const { t } = useTranslation()
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const title = t('account.title', 'Minha Conta')

	useEffect(() => {
		Shopify.customer.isAuthenticated().then(isAuthenticated => {
			setIsAuthenticated(isAuthenticated)
			if (isAuthenticated) {
				Eitri.navigation.navigate({ path: '/Profile', replace: true })
			}
		})
	}, [])

	const makeLogin = async () => {
		setIsLoading(true)
		try {
			await Shopify.customer.auth.login()
			await Eitri.navigation.navigate({ path: '/Profile', replace: true })
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Page title={title}>
			<HeaderContentWrapper className={`justify-between`}>
				<View className={`flex items-center gap-4`}>
					<HeaderReturn />
					<HeaderText text={title} />
				</View>
			</HeaderContentWrapper>

			{!isAuthenticated ? (
				<View className={`flex flex-col items-center px-6 pt-12`}>
					<View
						className={`flex items-center justify-center w-[96px] h-[96px] rounded-full bg-primary/10 mb-6`}>
						<FiUser
							size={40}
							className='text-primary'
						/>
					</View>

					<Text className={`text-xl font-bold text-center mb-2`}>
						{t('account.welcome', 'Entre na sua conta')}
					</Text>

					<Text className={`text-sm text-gray-500 text-center mb-8 px-4`}>
						{t(
							'account.loginDescription',
							'Faça login para acompanhar seus pedidos, salvar seus favoritos e ter uma experiência personalizada.'
						)}
					</Text>

					<View className={`flex flex-row justify-center gap-8 mb-10`}>
						<View className={`flex flex-col items-center gap-2`}>
							<View
								className={`flex items-center justify-center w-[48px] h-[48px] rounded-full bg-gray-100`}>
								<FiShoppingBag
									size={20}
									className='text-gray-600'
								/>
							</View>
							<Text className={`text-xs text-gray-500`}>{t('account.ordersLabel', 'Pedidos')}</Text>
						</View>

						<View className={`flex flex-col items-center gap-2`}>
							<View
								className={`flex items-center justify-center w-[48px] h-[48px] rounded-full bg-gray-100`}>
								<FiHeart
									size={20}
									className='text-gray-600'
								/>
							</View>
							<Text className={`text-xs text-gray-500`}>{t('account.favoritesLabel', 'Favoritos')}</Text>
						</View>

						<View className={`flex flex-col items-center gap-2`}>
							<View
								className={`flex items-center justify-center w-[48px] h-[48px] rounded-full bg-gray-100`}>
								<FiMapPin
									size={20}
									className='text-gray-600'
								/>
							</View>
							<Text className={`text-xs text-gray-500`}>{t('account.addressesLabel', 'Endereços')}</Text>
						</View>
					</View>

					<View className={`w-full px-2`}>
						<CustomButton
							label={t('account.loginButton', 'Entrar na minha conta')}
							onClick={makeLogin}
							isLoading={isLoading}
						/>

						<Text className={`text-xs text-gray-400 text-center mt-4`}>
							{t('account.loginHint', 'Você será redirecionado para uma página segura de login.')}
						</Text>
					</View>
				</View>
			) : (
				<Profile />
			)}

			<BottomInset />
		</Page>
	)
}
