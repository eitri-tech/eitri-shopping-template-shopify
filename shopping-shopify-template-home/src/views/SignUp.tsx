// @ts-ignore
import { Text, View, TextInput, Button, Page, Checkbox } from 'eitri-luminus'
import { useState } from 'react'
import { HeaderContentWrapper, HeaderReturn, HeaderText, BottomInset } from 'shopping-shopify-template-shared'
import { Shopify } from 'shopping-shopify-template-sdk'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'

export default function SignUp(props) {
	const { location } = props
	const { t } = useTranslation()

	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [phone, setPhone] = useState('')
	const [acceptsMarketing, setAcceptsMarketing] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const validateForm = (): string | null => {
		if (!email) {
			return t('signUp.emailRequired', 'Email é obrigatório')
		}

		if (!password) {
			return t('signUp.passwordRequired', 'Senha é obrigatória')
		}

		if (password.length < 5) {
			return t('signUp.passwordMinLength', 'A senha deve ter pelo menos 5 caracteres')
		}

		if (password !== confirmPassword) {
			return t('signUp.passwordMismatch', 'As senhas não coincidem')
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			return t('signUp.invalidEmail', 'Email inválido')
		}

		return null
	}

	const handleSignUp = async () => {
		const validationError = validateForm()
		if (validationError) {
			setError(validationError)
			return
		}

		setLoading(true)
		setError(null)

		try {
			const result = await Shopify.customer.signUp({
				email,
				password,
				firstName: firstName || undefined,
				lastName: lastName || undefined,
				phone: phone || undefined,
				acceptsMarketing
			})

			if (result.userErrors && result.userErrors.length > 0) {
				setError(result.userErrors[0].message)
				setLoading(false)
				return
			}

			if (result.customer) {
				const signInResult = await Shopify.customer.signIn({ email, password })

				if (signInResult.accessToken) {
					const redirectTo = location?.state?.redirectTo
					if (redirectTo) {
						Eitri.navigation.navigate({ path: redirectTo, replace: true })
					} else {
						Eitri.navigation.back(-1)
					}
				} else {
					Eitri.navigation.navigate({
						path: '/SignIn',
						state: { redirectTo: location?.state?.redirectTo },
						replace: true
					})
				}
			}
		} catch (err) {
			console.error('[SignUp] Erro ao criar conta:', err)
			setError(t('signUp.genericError', 'Erro ao criar conta. Tente novamente.'))
		} finally {
			setLoading(false)
		}
	}

	const goToSignIn = () => {
		Eitri.navigation.navigate({
			path: '/SignIn',
			state: { redirectTo: location?.state?.redirectTo }
		})
	}

	const formatPhone = (value: string) => {
		const numbers = value.replace(/\D/g, '')
		if (numbers.length <= 2) {
			return numbers
		}
		if (numbers.length <= 7) {
			return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
		}
		if (numbers.length <= 11) {
			return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
		}
		return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
	}

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const formatted = formatPhone(e.target.value)
		setPhone(formatted)
	}

	return (
		<Page title={t('signUp.title', 'Criar Conta')}>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('signUp.title', 'Criar Conta')} />
				<View className='w-10' />
			</HeaderContentWrapper>

			<View className='flex-1 p-4 overflow-y-auto'>
				<View className='flex flex-col gap-4'>
					<View className='flex flex-row gap-4'>
						<View className='flex-1 flex flex-col gap-2'>
							<Text className='text-sm font-medium'>{t('signUp.firstName', 'Nome')}</Text>
							<TextInput
								type='text'
								value={firstName}
								onChange={e => setFirstName(e.target.value)}
								placeholder={t('signUp.firstNamePlaceholder', 'Seu nome')}
								className='input input-bordered w-full h-12'
								autoComplete='given-name'
							/>
						</View>

						<View className='flex-1 flex flex-col gap-2'>
							<Text className='text-sm font-medium'>{t('signUp.lastName', 'Sobrenome')}</Text>
							<TextInput
								type='text'
								value={lastName}
								onChange={e => setLastName(e.target.value)}
								placeholder={t('signUp.lastNamePlaceholder', 'Seu sobrenome')}
								className='input input-bordered w-full h-12'
								autoComplete='family-name'
							/>
						</View>
					</View>

					<View className='flex flex-col gap-2'>
						<Text className='text-sm font-medium'>
							{t('signUp.email', 'Email')} <Text className='text-red-500'>*</Text>
						</Text>
						<TextInput
							type='email'
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder={t('signUp.emailPlaceholder', 'seu@email.com')}
							className='input input-bordered w-full h-12'
							autoCapitalize='none'
							autoComplete='email'
						/>
					</View>

					<View className='flex flex-col gap-2'>
						<Text className='text-sm font-medium'>{t('signUp.phone', 'Telefone')}</Text>
						<TextInput
							type='tel'
							value={phone}
							onChange={handlePhoneChange}
							placeholder={t('signUp.phonePlaceholder', '(00) 00000-0000')}
							className='input input-bordered w-full h-12'
							autoComplete='tel'
						/>
					</View>

					<View className='flex flex-col gap-2'>
						<Text className='text-sm font-medium'>
							{t('signUp.password', 'Senha')} <Text className='text-red-500'>*</Text>
						</Text>
						<View className='relative'>
							<TextInput
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={e => setPassword(e.target.value)}
								placeholder={t('signUp.passwordPlaceholder', 'Mínimo 5 caracteres')}
								className='input input-bordered w-full h-12 pr-12'
								autoComplete='new-password'
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

					<View className='flex flex-col gap-2'>
						<Text className='text-sm font-medium'>
							{t('signUp.confirmPassword', 'Confirmar Senha')} <Text className='text-red-500'>*</Text>
						</Text>
						<View className='relative'>
							<TextInput
								type={showConfirmPassword ? 'text' : 'password'}
								value={confirmPassword}
								onChange={e => setConfirmPassword(e.target.value)}
								placeholder={t('signUp.confirmPasswordPlaceholder', 'Repita a senha')}
								className='input input-bordered w-full h-12 pr-12'
								autoComplete='new-password'
							/>
							<View
								className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
								{showConfirmPassword ? (
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
						className='flex flex-row items-center gap-3 mt-2'
						onClick={() => setAcceptsMarketing(!acceptsMarketing)}>
						<View
							className={`w-5 h-5 border-2 rounded flex items-center justify-center ${acceptsMarketing ? 'bg-primary border-primary' : 'border-gray-300'
								}`}>
							{acceptsMarketing && (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='14'
									height='14'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='3'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='text-white'>
									<polyline points='20 6 9 17 4 12'></polyline>
								</svg>
							)}
						</View>
						<Text className='text-sm text-gray-600'>
							{t('signUp.acceptsMarketing', 'Desejo receber novidades e promoções por email')}
						</Text>
					</View>

					{error && (
						<View className='bg-red-50 p-3 rounded-lg'>
							<Text className='text-red-600 text-sm'>{error}</Text>
						</View>
					)}

					<Button
						className='btn btn-primary w-full h-12 mt-2'
						onClick={handleSignUp}
						disabled={loading}>
						{loading ? (
							<View className='loading loading-spinner loading-sm' />
						) : (
							<Text className='text-white font-semibold'>{t('signUp.createAccountButton', 'Criar conta')}</Text>
						)}
					</Button>

					<View className='flex items-center gap-2 my-4'>
						<View className='flex-1 h-px bg-gray-200' />
						<Text className='text-gray-400 text-sm'>{t('signUp.or', 'ou')}</Text>
						<View className='flex-1 h-px bg-gray-200' />
					</View>

					<View
						className='flex justify-center'
						onClick={goToSignIn}>
						<Text className='text-gray-600'>
							{t('signUp.hasAccount', 'Já tem uma conta?')}{' '}
							<Text className='text-primary font-semibold'>{t('signUp.signIn', 'Entrar')}</Text>
						</Text>
					</View>
				</View>
			</View>

			<BottomInset />
		</Page>
	)
}
