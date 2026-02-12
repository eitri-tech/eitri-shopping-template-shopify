import { useTranslation } from 'eitri-i18n'
import { Text, View, Loading, Page } from 'eitri-luminus'
import {
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText,
	CustomButton,
	CustomInput,
	BottomInset,
} from 'shopping-shopify-template-shared'
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiStar, FiArrowLeft } from 'react-icons/fi'

import { Shopify } from 'eitri-shopping-shopify-shared'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const EMPTY_FORM = {
	firstName: '',
	lastName: '',
	address1: '',
	address2: '',
	city: '',
	province: '',
	zip: '',
	phoneNumber: '',
}

export default function Addresses(props) {
	const { t } = useTranslation()
	const queryClient = useQueryClient()
	const [mode, setMode] = useState('list') // 'list' | 'create' | 'edit'
	const [editingId, setEditingId] = useState(null)
	const [form, setForm] = useState(EMPTY_FORM)
	const [error, setError] = useState(null)

	const { data: customerData, isLoading } = useQuery({
		queryKey: ['addresses'],
		queryFn: () => Shopify.customer.getCurrentCustomer(),
	})

	const addresses = customerData?.addresses?.edges?.map((e) => e.node) || []
	const defaultAddressId = customerData?.defaultAddress?.id || null

	const saveMutation = useMutation({
		mutationFn: async ({ mode, editingId, addressInput, isFirst }) => {
			if (mode === 'edit' && editingId) {
				return Shopify.customer.updateAddress(editingId, addressInput)
			}
			return Shopify.customer.createAddress(addressInput, isFirst)
		},
		onSuccess: (result) => {
			if (result.userErrors?.length > 0) {
				setError(result.userErrors.map((e) => e.message).join('. '))
				return
			}
			queryClient.invalidateQueries({ queryKey: ['addresses'] })
			backToList()
		},
		onError: () => {
			setError(t('account.addresses.saveError', 'Erro ao salvar endereço. Tente novamente.'))
		},
	})

	const deleteMutation = useMutation({
		mutationFn: (addressId) => Shopify.customer.deleteAddress(addressId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['addresses'] })
		},
	})

	const setDefaultMutation = useMutation({
		mutationFn: (addressId) => Shopify.customer.setDefaultAddress(addressId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['addresses'] })
		},
	})

	const openCreate = () => {
		setForm(EMPTY_FORM)
		setEditingId(null)
		setError(null)
		setMode('create')
	}

	const openEdit = (address) => {
		setForm({
			firstName: address.firstName || '',
			lastName: address.lastName || '',
			address1: address.address1 || '',
			address2: address.address2 || '',
			city: address.city || '',
			province: address.province || '',
			zip: address.zip || '',
			phoneNumber: address.phoneNumber || '',
		})
		setEditingId(address.id)
		setError(null)
		setMode('edit')
	}

	const backToList = () => {
		setMode('list')
		setEditingId(null)
		setError(null)
	}

	const handleSave = () => {
		if (!form.address1?.trim() || !form.city?.trim() || !form.zip?.trim()) {
			setError(t('account.addresses.requiredFields', 'Preencha os campos obrigatórios: endereço, cidade e CEP.'))
			return
		}
		setError(null)

		const addressInput = {
			firstName: form.firstName || undefined,
			lastName: form.lastName || undefined,
			address1: form.address1,
			address2: form.address2 || undefined,
			city: form.city,
			zip: form.zip,
			zoneCode: form.province || undefined,
			phoneNumber: form.phoneNumber || undefined,
		}

		saveMutation.mutate({
			mode,
			editingId,
			addressInput,
			isFirst: addresses.length === 0,
		})
	}

	const updateField = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }))
	}

	const title = t('account.addresses.title', 'Meus Endereços')

	if (mode === 'create' || mode === 'edit') {
		return (
			<Page title={mode === 'edit'
				? t('account.addresses.editTitle', 'Editar Endereço')
				: t('account.addresses.newTitle', 'Novo Endereço')
			}>
				<HeaderContentWrapper className='justify-between'>
					<View className='flex items-center gap-4'>
						<View onClick={backToList} className='p-1'>
							<FiArrowLeft size={22} className='text-header-content' />
						</View>
						<HeaderText
							text={mode === 'edit'
								? t('account.addresses.editTitle', 'Editar Endereço')
								: t('account.addresses.newTitle', 'Novo Endereço')
							}
						/>
					</View>
				</HeaderContentWrapper>

				<AddressForm
					form={form}
					updateField={updateField}
					onSave={handleSave}
					saving={saveMutation.isLoading}
					error={error}
					t={t}
					isEdit={mode === 'edit'}
				/>

				<BottomInset />
			</Page>
		)
	}

	return (
		<Page title={title}>
			<HeaderContentWrapper className='justify-between'>
				<View className='flex items-center gap-4'>
					<HeaderReturn />
					<HeaderText text={title} />
				</View>
			</HeaderContentWrapper>

			{isLoading ? (
				<View className='flex flex-col items-center justify-center pt-20'>
					<Loading />
				</View>
			) : (
				<View className='flex flex-col px-4 pt-4 pb-4 gap-4'>
					{addresses.length === 0 ? (
						<EmptyAddresses t={t} />
					) : (
						addresses.map((address) => (
							<AddressCard
								key={address.id}
								address={address}
								isDefault={address.id === defaultAddressId}
								onEdit={() => openEdit(address)}
								onDelete={() => deleteMutation.mutate(address.id)}
								onSetDefault={() => setDefaultMutation.mutate(address.id)}
								t={t}
							/>
						))
					)}

					<CustomButton
						label={t('account.addresses.addNew', 'Adicionar endereço')}
						onClick={openCreate}
						leftIcon={<FiPlus size={16} />}
					/>
				</View>
			)}

			<BottomInset />
		</Page>
	)
}

function EmptyAddresses({ t }) {
	return (
		<View className='flex flex-col items-center justify-center pt-12 pb-8 px-6'>
			<View className='flex items-center justify-center w-[80px] h-[80px] rounded-full bg-gray-100 mb-5'>
				<FiMapPin size={32} className='text-gray-400' />
			</View>

			<Text className='text-lg font-bold text-center mb-2'>
				{t('account.addresses.empty', 'Nenhum endereço cadastrado')}
			</Text>

			<Text className='text-base text-gray-500 text-center px-4'>
				{t('account.addresses.emptyDesc', 'Adicione um endereço para facilitar suas compras.')}
			</Text>
		</View>
	)
}

function AddressCard({ address, isDefault, onEdit, onDelete, onSetDefault, t }) {
	const line1 = [address.address1, address.address2].filter(Boolean).join(', ')
	const line2 = [address.city, address.province, address.zip].filter(Boolean).join(' - ')
	const name = [address.firstName, address.lastName].filter(Boolean).join(' ')

	return (
		<View className='flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden'>
			<View className='flex flex-col p-4 gap-1'>
				{isDefault && (
					<View className='flex flex-row items-center gap-1 mb-1'>
						<FiStar size={12} className='text-primary' />
						<Text className='text-xs font-semibold text-primary'>
							{t('account.addresses.default', 'Endereço principal')}
						</Text>
					</View>
				)}

				{name && <Text className='text-base font-semibold'>{name}</Text>}
				{line1 && <Text className='text-base text-gray-700'>{line1}</Text>}
				{line2 && <Text className='text-sm text-gray-500'>{line2}</Text>}
				{address.country && (
					<Text className='text-sm text-gray-400'>{address.country}</Text>
				)}
				{address.phoneNumber && (
					<Text className='text-sm text-gray-400'>{address.phoneNumber}</Text>
				)}
			</View>

			<View className='flex flex-row border-t border-gray-100'>
				<View
					onClick={onEdit}
					className='flex flex-row flex-1 items-center justify-center gap-1 py-2.5 active:bg-gray-50'
				>
					<FiEdit2 size={14} className='text-gray-500' />
					<Text className='text-sm text-gray-500'>{t('account.addresses.edit', 'Editar')}</Text>
				</View>

				{!isDefault && (
					<View
						onClick={onSetDefault}
						className='flex flex-row flex-1 items-center justify-center gap-1 py-2.5 border-l border-gray-100 active:bg-gray-50'
					>
						<FiStar size={14} className='text-gray-500' />
						<Text className='text-sm text-gray-500'>{t('account.addresses.setDefault', 'Tornar principal')}</Text>
					</View>
				)}

				{!isDefault && (
					<View
						onClick={onDelete}
						className='flex flex-row flex-1 items-center justify-center gap-1 py-2.5 border-l border-gray-100 active:bg-gray-50'
					>
						<FiTrash2 size={14} className='text-red-400' />
						<Text className='text-sm text-red-400'>{t('account.addresses.delete', 'Excluir')}</Text>
					</View>
				)}
			</View>
		</View>
	)
}

function AddressForm({ form, updateField, onSave, saving, error, t, isEdit }) {
	return (
		<View className='flex flex-col px-4 pt-4 pb-4 gap-3'>
			<View className='flex flex-row gap-3'>
				<View className='flex-1'>
					<CustomInput
						label={t('account.addresses.firstName', 'Nome')}
						value={form.firstName}
						onChange={(e) => updateField('firstName', e.target.value)}
						placeholder={t('account.addresses.firstNamePlaceholder', 'Nome')}
					/>
				</View>
				<View className='flex-1'>
					<CustomInput
						label={t('account.addresses.lastName', 'Sobrenome')}
						value={form.lastName}
						onChange={(e) => updateField('lastName', e.target.value)}
						placeholder={t('account.addresses.lastNamePlaceholder', 'Sobrenome')}
					/>
				</View>
			</View>

			<CustomInput
				label={t('account.addresses.address1', 'Endereço *')}
				value={form.address1}
				onChange={(e) => updateField('address1', e.target.value)}
				placeholder={t('account.addresses.address1Placeholder', 'Rua, número')}
			/>

			<CustomInput
				label={t('account.addresses.address2', 'Complemento')}
				value={form.address2}
				onChange={(e) => updateField('address2', e.target.value)}
				placeholder={t('account.addresses.address2Placeholder', 'Apto, bloco, etc.')}
			/>

			<View className='flex flex-row gap-3'>
				<View className='flex-1'>
					<CustomInput
						label={t('account.addresses.city', 'Cidade *')}
						value={form.city}
						onChange={(e) => updateField('city', e.target.value)}
						placeholder={t('account.addresses.cityPlaceholder', 'Cidade')}
					/>
				</View>
				<View className='flex-1'>
					<CustomInput
						label={t('account.addresses.province', 'Estado')}
						value={form.province}
						onChange={(e) => updateField('province', e.target.value)}
						placeholder={t('account.addresses.provincePlaceholder', 'UF')}
					/>
				</View>
			</View>

			<View className='flex flex-row gap-3'>
				<View className='flex-1'>
					<CustomInput
						label={t('account.addresses.zip', 'CEP *')}
						value={form.zip}
						onChange={(e) => updateField('zip', e.target.value)}
						placeholder={t('account.addresses.zipPlaceholder', '00000-000')}
					/>
				</View>
				<View className='flex-1'>
					<CustomInput
						label={t('account.addresses.phone', 'Telefone')}
						value={form.phoneNumber}
						onChange={(e) => updateField('phoneNumber', e.target.value)}
						placeholder={t('account.addresses.phonePlaceholder', '(00) 00000-0000')}
						type='tel'
					/>
				</View>
			</View>

			{error && (
				<View className='p-3 rounded bg-red-50'>
					<Text className='text-sm text-red-600'>{error}</Text>
				</View>
			)}

			<View className='mt-2'>
				<CustomButton
					label={isEdit
						? t('account.addresses.saveEdit', 'Salvar alterações')
						: t('account.addresses.saveNew', 'Salvar endereço')
					}
					onClick={onSave}
					isLoading={saving}
				/>
			</View>
		</View>
	)
}
