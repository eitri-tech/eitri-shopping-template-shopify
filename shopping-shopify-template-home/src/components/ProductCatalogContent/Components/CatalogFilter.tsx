import { useEffect, useState } from 'react'
// @ts-ignore
import { View, Text } from 'eitri-luminus'
import { useTranslation } from 'eitri-i18n'
// @ts-ignore
import { CustomButton, BottomInset, CustomCheckbox, FilterValue } from 'shopping-shopify-template-shared'
import { Filter } from 'shopping-shopify-template-sdk'

interface CatalogFilterProps {
	setSelectedFilters: Function
	selectedFilters: FilterValue[]
	filters: Filter[]
	onApplyFilter: () => void
	onFilterClear: () => void
}

export default function CatalogFilter(props: CatalogFilterProps) {
	const { selectedFilters, onApplyFilter, onFilterClear, setSelectedFilters, filters } = props

	const [showModal, setShowModal] = useState(false)

	const { t } = useTranslation()

	const handleFilterToggle = (e: Event, filterValue: FilterValue) => {
		e.stopPropagation()

		const existingIndex = selectedFilters?.findIndex(f => f.id === filterValue.id)
		let newFacets
		if (existingIndex !== -1 && existingIndex !== undefined) {
			newFacets = selectedFilters.filter(f => !(f.id === filterValue.id))
		} else {
			newFacets = [...selectedFilters, { ...filterValue }]
		}
		setSelectedFilters(newFacets)
	}

	const isSelected = (filterValue: FilterValue) => {
		return selectedFilters?.some(sf => sf.id == filterValue?.id)
	}

	const onApplyFilters = () => {
		setShowModal(false)
		onApplyFilter()
	}

	return (
		<>
			<CustomButton
				disabled={!(filters?.length > 0)}
				onClick={() => setShowModal(true)}
				leftIcon={
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='16'
						height='16'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'>
						<path d='M22 3H2l8 9.46V19l4 2v-8.54L22 3z' />
					</svg>
				}
				label={t('catalogFilter.title', 'Filtro')}
			/>

			{showModal && (
				<View
					className='z-[9999] !bg-black/70 !opacity-100 fixed inset-0 flex items-end justify-center'
					open={showModal}
					onClose={() => setShowModal(false)}>
					<View
						onClick={e => e.stopPropagation()}
						className='bg-white rounded-t w-full max-h-[70vh] overflow-y-auto pointer-events-auto p-4'>
						<View className='flex flex-row items-center justify-between'>
							<Text className='text-xl font-semibold'>{t('catalogFilter.title', 'Filtro')}</Text>
						</View>

						<View className='flex flex-col gap-4 mt-4'>
							{filters.map(filter => (
								<View
									key={filter.id}
									className='flex flex-col gap-4 border-t pt-2 border-gray-300'>
									<Text className='text-base font-bold text-gray-800'>{filter.label}</Text>
									<View className='flex flex-col gap-4 mt-1'>
										{filter.values.map(value => (
											<View
												key={`${value.id}`}
												onClick={e => handleFilterToggle(e, value)}
												className={``}>
												<CustomCheckbox
													checked={isSelected(value)}
													label={`${value.label} (${value.count})`}
												/>
											</View>
										))}
									</View>
								</View>
							))}
						</View>

						<View className='p-4 w-full bg-white border-t border-gray-200 fixed left-0 bottom-0'>
							<View className='flex flex-row justify-between w-full gap-4 '>
								<View className='w-1/2'>
									<CustomButton
										outlined
										onClick={onFilterClear}
										label={t('catalogFilter.clear', 'Limpar')}
									/>
								</View>
								<View className='w-1/2'>
									<CustomButton
										onClick={onApplyFilters}
										label={t('catalogFilter.button', 'Filtrar')}
									/>
								</View>
							</View>
							<BottomInset />
						</View>

						<View className={'w-full h-[77px]'} />
						<BottomInset />
					</View>
				</View>
			)}
		</>
	)
}
