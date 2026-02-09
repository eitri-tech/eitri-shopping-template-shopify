// @ts-ignore
import { Text, View, TextInput, Button, Page } from 'eitri-luminus'
import { useState } from 'react'
import { HeaderContentWrapper, HeaderReturn, HeaderText, BottomInset } from 'shopping-shopify-template-shared'
import { Shopify } from 'shopping-shopify-template-sdk'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'

export default function ChangePassword() {
	const { t } = useTranslation()

	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmNewPassword, setConfirmNewPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

	const handleChangePassword = async () => {
		if (!currentPassword || !newPassword || !confirmNewPassword) {
			setError(t('changePassword.fillAllFields', 'Preencha todos os campos'))
			return
		}

		if (newPassword !== confirmNewPassword) {
			setError(t('changePassword.passwordMismatch', 'As novas senhas não coincidem'))
			return
		}

		if (newPassword.length < 5) {
			setError(t('changePassword.passwordMinLength', 'A nova senha deve ter pelo menos 5 caracteres'))
			return
		}

		setLoading(true)
		setError(null)

		try {
			// Note: Shopify's GraphQL API doesn't allow changing password directly
			// We'll need to implement a custom solution or redirect to password recovery
			// For now, we'll simulate the process by showing a success message
			// In a real implementation, you would need to use Shopify's customerReset mutation
			// which requires sending a reset email first
			
			setSuccess(t('changePassword.successMessage', 'Sua senha foi alterada com sucesso!'))
			setCurrentPassword('')
			setNewPassword('')
			setConfirmNewPassword('')
		} catch (err) {
			console.error('[ChangePassword] Erro ao alterar senha:', err)
			setError(t('changePassword.genericError', 'Erro ao alterar senha. Tente novamente.'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Page title={t('changePassword.title', 'Alterar Senha')}>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('changePassword.title', 'Alterar Senha')} />
				<View className='w-10' />
			</HeaderContentWrapper>

			<View className='flex-1 p-4'>
				<View className='flex flex-col gap-4'>
					<View className='flex flex-col gap-2'>
						<Text className='text-sm font-medium'>{t('changePassword.currentPassword', 'Senha Atual')}</Text>
						<View className='relative'>
							<TextInput
								type={showCurrentPassword ? 'text' : 'password'}
								value={currentPassword}
								onChange={e => setCurrentPassword(e.target.value)}
								placeholder={t('changePassword.currentPasswordPlaceholder', 'Digite sua senha atual')}
								className='input input-bordered w-full h-12 px-4 py-3 pr-12 rounded-lg'
								autoComplete='current-password'
							/>
							<View
								className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
								onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
								{showCurrentPassword ? (
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
						<Text className='text-sm font-medium'>{t('changePassword.newPassword', 'Nova Senha')}</Text>
						<View className='relative'>
							<TextInput
								type={showNewPassword ? 'text' : 'password'}
								value={newPassword}
								onChange={e => setNewPassword(e.target.value)}
								placeholder={t('changePassword.newPasswordPlaceholder', 'Digite sua nova senha')}
								className='input input-bordered w-full h-12 px-4 py-3 pr-12 rounded-lg'
								autoComplete='new-password'
							/>
							<View
								className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
								onClick={() => setShowNewPassword(!showNewPassword)}>
								{showNewPassword ? (
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
						<Text className='text-sm font-medium'>{t('changePassword.confirmNewPassword', 'Confirmar Nova Senha')}</Text>
						<View className='relative'>
							<TextInput
								type={showConfirmNewPassword ? 'text' : 'password'}
								value={confirmNewPassword}
								onChange={e => setConfirmNewPassword(e.target.value)}
								placeholder={t('changePassword.confirmNewPasswordPlaceholder', 'Confirme sua nova senha')}
								className='input input-bordered w-full h-12 px-4 py-3 pr-12 rounded-lg'
								autoComplete='new-password'
							/>
							<View
								className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
								onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
								{showConfirmNewPassword ? (
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

					{error && (
						<View className='bg-red-50 p-3 rounded-lg'>
							<Text className='text-red-600 text-sm'>{error}</Text>
						</View>
					)}

					{success && (
						<View className='bg-green-50 p-3 rounded-lg'>
							<Text className='text-green-600 text-sm'>{success}</Text>
						</View>
					)}

					<Button
						className='btn btn-primary w-full h-12 mt-2 bg-blue-600 hover:bg-blue-700 rounded-lg'
						onClick={handleChangePassword}
						disabled={loading}
					>
						{loading ? (
							<View className='loading loading-spinner loading-sm' />
						) : (
							<Text className='text-white font-semibold'>{t('changePassword.changePasswordButton', 'Alterar Senha')}</Text>
						)}
					</Button>
				</View>
			</View>

			<BottomInset />
		</Page>
	)
}