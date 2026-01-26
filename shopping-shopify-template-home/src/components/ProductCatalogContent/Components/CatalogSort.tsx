import { useState } from 'react'
// @ts-ignore
import { View, Text } from 'eitri-luminus'
import { useTranslation } from 'eitri-i18n'
import { CustomButton } from 'shopping-shopify-template-shared'

interface CatalogSortProps {
	currentSort: {
		sortKey: string
		reverse: boolean
	}
	onSortChange: Function
}

export default function CatalogSort(props: CatalogSortProps) {
	const { currentSort, onSortChange } = props

	const [showModal, setShowModal] = useState(false)

	const { t } = useTranslation()

	const LIST_ORDERING = [
		{
			sortKey: 'PRICE',
			name: t('catalogSort.price', 'Menor Preço'),
			reverse: false
		},
		{
			sortKey: 'PRICE',
			name: t('catalogSort.priceReverse', 'Maior Preço'),
			reverse: true
		},
		{
			sortKey: 'BEST_SELLING',
			name: t('catalogSort.bestSelling', 'Mais vendidos'),
			reverse: false
		},
		// {
		// 	sortKey: 'COLLECTION_DEFAULT',
		// 	name: t('catalogSort.collectionDefault', 'Ordenação padrão'),
		// 	reverse: false
		// },
		{
			sortKey: 'CREATED',
			name: t('catalogSort.created', 'Lançamentos'),
			reverse: false
		},
		{
			sortKey: 'RELEVANCE',
			name: t('catalogSort.relevance', 'Relevância'),
			reverse: false
		},
		{
			sortKey: 'TITLE',
			categoryKey: t('catalogSort.title', 'Título'),
			reverse: false
		}
	]

	const handleSortSelect = sortValue => {
		console.log('aqui===>', sortValue)
		onSortChange(sortValue)
		setShowModal(false)
	}

	const getCurrentSortLabel = () => {
		return (
			LIST_ORDERING.find(o => o.sortKey === currentSort.sortKey && o.reverse === currentSort.reverse)?.name ??
			t('lists.modalTitle', 'Ordenar Por')
		)
	}

	const isSortSelected = (sortKey: string, reverse: boolean) => {
		return currentSort.sortKey === sortKey && currentSort.reverse === reverse
	}

	return (
		<>
			<CustomButton
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
						<path d='M3 6h18' />
						<path d='M7 12h10' />
						<path d='M10 18h4' />
					</svg>
				}
				label={getCurrentSortLabel()}
			/>
			{showModal && (
				<View
					className='z-[9999] !bg-black/70 !opacity-100 fixed inset-0 flex items-end justify-center'
					open={showModal}
					onClose={() => setShowModal(false)}>
					<View
						bottomInset={'auto'}
						className='bg-white rounded-t w-full max-h-[70vh] overflow-y-auto pointer-events-auto p-4'>
						<Text className='text-lg font-semibold'>{t('lists.modalTitle', 'Ordenar Por')}</Text>

						<View className='flex flex-col mt-4'>
							{LIST_ORDERING.map((option, index) => (
								<View
									key={option.name}
									onClick={() => handleSortSelect(option)}
									className={`flex flex-row items-center justify-between p-4 cursor-pointer transition-colors ${
										isSortSelected(option.sortKey, option.reverse)
											? 'bg-primary/10 border-l-4 border-primary'
											: 'border-l-4 border-transparent'
									}`}>
									<Text
										className={`text-base ${
											isSortSelected(option.sortKey, option.reverse)
												? 'text-primary font-medium'
												: 'text-gray-700'
										}`}>
										{t(option.name)}
									</Text>
									{isSortSelected(option.sortKey, option.reverse) && (
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
											className='text-primary'>
											<polyline points='20,6 9,17 4,12' />
										</svg>
									)}
								</View>
							))}
						</View>

						<View className='mb-4'>
							<CustomButton
								label='Cancelar'
								onClick={() => setShowModal(false)}
							/>
						</View>
					</View>
				</View>
			)}
		</>
	)
}
