// @ts-ignore
import { Text, View, TextInput, Button, Page } from 'eitri-luminus'
import { useState } from 'react'
import { HeaderContentWrapper, HeaderReturn, HeaderText, BottomInset } from 'shopping-shopify-template-shared'
import { Shopify } from 'eitri-shopping-shopify-shared'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'

export default function SignIn(props) {
	const { location } = props
	const { t } = useTranslation()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [showPassword, setShowPassword] = useState(false)
	const [showRecovery, setShowRecovery] = useState(false)
	const [recoveryEmail, setRecoveryEmail] = useState('')
	const [recoveryLoading, setRecoveryLoading] = useState(false)
	const [recoverySuccess, setRecoverySuccess] = useState(false)
	const [recoveryError, setRecoveryError] = useState<string | null>(null)

	const handleSignIn = async () => {
		if (!email || !password) {
			setError(t('signIn.fillAllFields', 'Preencha todos os campos'))
			return
		}

		setLoading(true)
		setError(null)

		try {
			const result = await Shopify.customer.signIn({ email, password })

			if (result.userErrors && result.userErrors.length > 0) {
				setError(result.userErrors[0].message)
				setLoading(false)
				return
			}

			if (result.accessToken) {
				const redirectTo = location?.state?.redirectTo
				if (redirectTo) {
					Eitri.navigation.navigate({ path: redirectTo, replace: true })
				} else {
					Eitri.navigation.back(-1)
				}
			}
		} catch (err) {
			console.error('[SignIn] Erro ao fazer login:', err)
			setError(t('signIn.genericError', 'Erro ao fazer login. Tente novamente.'))
		} finally {
			setLoading(false)
		}
	}

	const handleRecoverPassword = async () => {
		if (!recoveryEmail) {
			setRecoveryError(t('signIn.enterEmail', 'Digite seu email'))
			return
		}

		setRecoveryLoading(true)
		setRecoveryError(null)

		try {
			const result = await Shopify.customer.recoverPassword(recoveryEmail)

			if (result.userErrors && result.userErrors.length > 0) {
				setRecoveryError(result.userErrors[0].message)
				setRecoveryLoading(false)
				return
			}

			if (result.success) {
				setRecoverySuccess(true)
			}
		} catch (err) {
			console.error('[SignIn] Erro ao recuperar senha:', err)
			setRecoveryError(t('signIn.recoveryError', 'Erro ao enviar email de recuperação.'))
		} finally {
			setRecoveryLoading(false)
		}
	}

	const goToSignUp = () => {
		Eitri.navigation.navigate({
			path: '/SignUp',
			state: { redirectTo: location?.state?.redirectTo }
		})
	}

	if (showRecovery) {
		return (
			<Page title={t('signIn.recoverPassword', 'Recuperar Senha')}>
				<HeaderContentWrapper>
					<HeaderReturn onClick={() => setShowRecovery(false)} />
					<HeaderText text={t('signIn.recoverPassword', 'Recuperar Senha')} />
					<View className='w-10' />
				</HeaderContentWrapper>

				<View className='flex-1 p-4'>
					{recoverySuccess ? (
						<View className='flex flex-col items-center justify-center gap-4 mt-8'>
							<View className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
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
									className='text-green-600'>
									<polyline points='20 6 9 17 4 12'></polyline>
								</svg>
							</View>
							<Text className='text-lg font-semibold text-center'>
								{t('signIn.recoveryEmailSent', 'Email enviado!')}
							</Text>
							<Text className='text-gray-500 text-center'>
								{t(
									'signIn.recoveryEmailSentDescription',
									'Verifique sua caixa de entrada para redefinir sua senha.'
								)}
							</Text>
							<Button
								className='btn btn-primary w-full mt-4'
								onClick={() => {
									setShowRecovery(false)
									setRecoverySuccess(false)
									setRecoveryEmail('')
								}}>
								<Text className='text-white font-semibold'>
									{t('signIn.backToLogin', 'Voltar ao login')}
								</Text>
							</Button>
						</View>
					) : (
						<View className='flex flex-col gap-4'>
							<Text className='text-gray-500'>
								{t(
									'signIn.recoveryDescription',
									'Digite seu email e enviaremos um link para redefinir sua senha.'
								)}
							</Text>

							<View className='flex flex-col gap-2'>
								<Text className='text-sm font-medium'>{t('signIn.email', 'Email')}</Text>
								<TextInput
									type='email'
									value={recoveryEmail}
									onChange={e => setRecoveryEmail(e.target.value)}
									placeholder={t('signIn.emailPlaceholder', 'seu@email.com')}
									className='input input-bordered w-full h-12'
									autoCapitalize='none'
									autoComplete='email'
								/>
							</View>

							{recoveryError && (
								<View className='bg-red-50 p-3 rounded-lg'>
									<Text className='text-red-600 text-sm'>{recoveryError}</Text>
								</View>
							)}

							<Button
								className='btn btn-primary w-full h-12 mt-2'
								onClick={handleRecoverPassword}
								disabled={recoveryLoading}>
								{recoveryLoading ? (
									<View className='loading loading-spinner loading-sm' />
								) : (
									<Text className='text-white font-semibold'>
										{t('signIn.sendRecoveryEmail', 'Enviar email')}
									</Text>
								)}
							</Button>
						</View>
					)}
				</View>

				<BottomInset />
			</Page>
		)
	}

	return (
		<Page title={t('signIn.title', 'Entrar')}>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('signIn.title', 'Entrar')} />
				<View className='w-10' />
			</HeaderContentWrapper>

			<View className='flex-1 p-4'>
				<View className='flex flex-col gap-4'>
					<View className='flex flex-col gap-2'>
						<Text className='text-sm font-medium'>{t('signIn.email', 'Email')}</Text>
						<TextInput
							type='email'
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder={t('signIn.emailPlaceholder', 'seu@email.com')}
							className='input input-bordered w-full h-12'
							autoCapitalize='none'
							autoComplete='email'
						/>
					</View>

					<View className='flex flex-col gap-2'>
						<Text className='text-sm font-medium'>{t('signIn.password', 'Senha')}</Text>
						<View className='relative'>
							<TextInput
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={e => setPassword(e.target.value)}
								placeholder={t('signIn.passwordPlaceholder', 'Digite sua senha')}
								className='input input-bordered w-full h-12 pr-12'
								autoComplete='current-password'
							/>
							<View
								className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
								onClick={() => setShowPassword(!showPassword)}>
								{showPassword ? (
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className='text-gray-400'>
										<path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'></path>
										<line
											x1='1'
											y1='1'
											x2='23'
											y2='23'></line>
									</svg>
								) : (
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className='text-gray-400'>
										<path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
										<circle
											cx='12'
											cy='12'
											r='3'></circle>
									</svg>
								)}
							</View>
						</View>
					</View>

					<View
						className='self-end'
						onClick={() => {
							setShowRecovery(true)
							setRecoveryEmail(email)
						}}>
						<Text className='text-primary text-sm'>{t('signIn.forgotPassword', 'Esqueceu a senha?')}</Text>
					</View>

					{error && (
						<View className='bg-red-50 p-3 rounded-lg'>
							<Text className='text-red-600 text-sm'>{error}</Text>
						</View>
					)}

					<Button
						className='btn btn-primary w-full h-12 mt-2'
						onClick={handleSignIn}
						disabled={loading}>
						{loading ? (
							<View className='loading loading-spinner loading-sm' />
						) : (
							<Text className='text-white font-semibold'>{t('signIn.signInButton', 'Entrar')}</Text>
						)}
					</Button>

					<View className='flex items-center gap-2 my-4'>
						<View className='flex-1 h-px bg-gray-200' />
						<Text className='text-gray-400 text-sm'>{t('signIn.or', 'ou')}</Text>
						<View className='flex-1 h-px bg-gray-200' />
					</View>

					<View
						className='flex justify-center'
						onClick={goToSignUp}>
						<Text className='text-gray-600'>
							{t('signIn.noAccount', 'Não tem uma conta?')}{' '}
							<Text className='text-primary font-semibold'>
								{t('signIn.createAccount', 'Criar conta')}
							</Text>
						</Text>
					</View>
				</View>
			</View>

			<BottomInset />
		</Page>
	)
}
