import { useTranslation } from 'eitri-i18n'
import Eitri from 'eitri-bifrost'
import { Text, View, Loading, Page } from 'eitri-luminus'
import {
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText,
	CustomButton,
	CustomInput,
	BottomInset,
} from 'shopping-shopify-template-shared'
import { FiUser, FiMail, FiPhone, FiCalendar, FiCheck } from 'react-icons/fi'

import { Shopify } from 'eitri-shopping-shopify-shared'
import { useEffect, useState } from 'react'

export default function EditProfile(props) {
	const { t } = useTranslation()
	const [customer, setCustomer] = useState(null)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(false)

	useEffect(() => {
		loadCustomer()
	}, [])

	const loadCustomer = async () => {
		try {
			// Try navigation state first, fallback to API
			const navState = props?.state?.customer
			const data = navState || await Shopify.customer.getCurrentCustomer()
			if (data) {
				setCustomer(data)
				setFirstName(data.firstName || '')
				setLastName(data.lastName || '')
			}
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const handleSave = async () => {
		if (!firstName.trim()) {
			setError(t('account.editProfile.requiredName', 'O nome é obrigatório.'))
			return
		}

		setSaving(true)
		setError(null)
		setSuccess(false)

		try {
			const result = await Shopify.customer.updateCustomer({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
			})

			if (result.userErrors?.length > 0) {
				setError(result.userErrors.map((e) => e.message).join('. '))
				return
			}

			if (result.customer) {
				setCustomer(result.customer)
			}

			setSuccess(true)
			setTimeout(() => setSuccess(false), 3000)
		} catch (err) {
			console.error(err)
			setError(t('account.editProfile.saveError', 'Erro ao salvar. Tente novamente.'))
		} finally {
			setSaving(false)
		}
	}

	const hasChanges = customer && (
		firstName.trim() !== (customer.firstName || '') ||
		lastName.trim() !== (customer.lastName || '')
	)

	const title = t('account.editProfile.title', 'Dados Pessoais')

	if (loading) {
		return (
			<Page title={title}>
				<HeaderContentWrapper className='justify-between'>
					<View className='flex items-center gap-4'>
						<HeaderReturn />
						<HeaderText text={title} />
					</View>
				</HeaderContentWrapper>
				<View className='flex flex-col items-center justify-center pt-20'>
					<Loading />
				</View>
			</Page>
		)
	}

	const email = customer?.emailAddress?.emailAddress
	const phone = customer?.phoneNumber?.phoneNumber
	const creationDate = customer?.creationDate

	return (
		<Page title={title}>
			<HeaderContentWrapper className='justify-between'>
				<View className='flex items-center gap-4'>
					<HeaderReturn />
					<HeaderText text={title} />
				</View>
			</HeaderContentWrapper>

			<View className='flex flex-col px-4 pt-4 pb-4'>
				{/* Avatar + Name Preview */}
				<View className='flex flex-col items-center pb-6'>
					<View className='flex items-center justify-center w-[72px] h-[72px] rounded-full bg-primary mb-3'>
						<FiUser size={28} className='text-primary-content' />
					</View>
					<Text className='text-base font-bold text-center'>
						{customer?.displayName || t('account.editProfile.unnamed', 'Usuário')}
					</Text>
				</View>

				{/* Editable Fields */}
				<View className='flex flex-col gap-3'>
					<Text className='text-base font-semibold'>
						{t('account.editProfile.personalInfo', 'Informações pessoais')}
					</Text>

					<CustomInput
						label={t('account.editProfile.firstName', 'Nome *')}
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						placeholder={t('account.editProfile.firstNamePlaceholder', 'Seu nome')}
					/>

					<CustomInput
						label={t('account.editProfile.lastName', 'Sobrenome')}
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						placeholder={t('account.editProfile.lastNamePlaceholder', 'Seu sobrenome')}
					/>
				</View>

				{/* Read-only Info */}
				{(email || phone || creationDate) && (
					<View className='flex flex-col gap-3 mt-6'>
						<Text className='text-base font-semibold'>
							{t('account.editProfile.contactInfo', 'Informações de contato')}
						</Text>

						{email && (
							<ReadOnlyField
								icon={<FiMail size={16} className='text-gray-400' />}
								label={t('account.editProfile.email', 'E-mail')}
								value={email}
							/>
						)}

						{phone && (
							<ReadOnlyField
								icon={<FiPhone size={16} className='text-gray-400' />}
								label={t('account.editProfile.phone', 'Telefone')}
								value={phone}
							/>
						)}

						{creationDate && (
							<ReadOnlyField
								icon={<FiCalendar size={16} className='text-gray-400' />}
								label={t('account.editProfile.memberSince', 'Membro desde')}
								value={formatMemberDate(creationDate)}
							/>
						)}

						<Text className='text-xs text-gray-400 mt-1'>
							{t('account.editProfile.contactHint', 'Para alterar e-mail ou telefone, entre em contato com o suporte.')}
						</Text>
					</View>
				)}

				{/* Error */}
				{error && (
					<View className='p-3 rounded bg-red-50 mt-4'>
						<Text className='text-sm text-red-600'>{error}</Text>
					</View>
				)}

				{/* Success */}
				{success && (
					<View className='flex flex-row items-center gap-2 p-3 rounded bg-green-50 mt-4'>
						<FiCheck size={16} className='text-green-600' />
						<Text className='text-sm text-green-600'>
							{t('account.editProfile.saveSuccess', 'Dados atualizados com sucesso!')}
						</Text>
					</View>
				)}

				{/* Save Button */}
				<View className='mt-6'>
					<CustomButton
						label={t('account.editProfile.save', 'Salvar alterações')}
						onClick={handleSave}
						isLoading={saving}
						disabled={!hasChanges}
					/>
				</View>
			</View>

			<BottomInset />
		</Page>
	)
}

function ReadOnlyField({ icon, label, value }) {
	return (
		<View className='flex flex-row items-center gap-3 p-3 bg-gray-50 rounded-lg'>
			{icon}
			<View className='flex flex-col'>
				<Text className='text-xs text-gray-400'>{label}</Text>
				<Text className='text-base text-gray-700'>{value}</Text>
			</View>
		</View>
	)
}

function formatMemberDate(dateString) {
	if (!dateString) return ''
	try {
		return new Intl.DateTimeFormat('pt-BR', {
			month: 'long',
			year: 'numeric',
		}).format(new Date(dateString))
	} catch {
		return dateString
	}
}
