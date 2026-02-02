import Eitri from 'eitri-bifrost'
import { HeaderContentWrapper, HeaderText } from 'shopping-shopify-template-shared'
// @ts-ignore
import { Text, View, Image, Loading, Page } from 'eitri-luminus'
import { getCmsContent } from '../services/cmsService'
import { useTranslation } from 'eitri-i18n'
import CmsContentRender from '../components/CmsContentRender/CmsContentRender'
import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'

export default function Categories() {
	const { t } = useTranslation()
	const [cmsContent, setCmsContent] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		loadCms()
	}, [])

	const loadCms = async () => {
		const _csmContent = await getCmsContent('categories')
		setCmsContent(_csmContent)
		setIsLoading(false)
	}

	const goToSearch = () => {
		Eitri.navigation.navigate({
			path: '/Search'
		})
	}

	return (
		<Page
			title='Categorias'
			bottomInset
			topInset>
			<HeaderContentWrapper className='justify-between'>
				<HeaderText text={t('categories.title', 'Categorias')} />
				<FiSearch
					onClick={goToSearch}
					className='text-header-content'
					size={24}
				/>
			</HeaderContentWrapper>

			{isLoading && <Loading />}

			<CmsContentRender cmsContent={cmsContent} />
		</Page>
	)
}
