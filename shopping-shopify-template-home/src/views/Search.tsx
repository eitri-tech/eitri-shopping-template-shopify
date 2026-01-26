// @ts-ignore
import { Text, View, Image, Button, Page } from 'eitri-luminus'

import { HeaderContentWrapper, HeaderReturn, HeaderText, BottomInset } from 'shopping-shopify-template-shared'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { useEffect, useState } from 'react'
import ProductCatalogContent from '../components/ProductCatalogContent/ProductCatalogContent'
import SearchInput from '../components/SearchInput/SearchInput'

export default function Search(props) {
	const { location } = props
	const { t } = useTranslation()

	const title = location?.state?.title
	const openInBottomBar = !!location?.state?.openInBottomBar

	const [appliedFacets, setAppliedFacets] = useState(null)

	useEffect(() => {
		const params = location?.state?.params
		setAppliedFacets(params)

		if (!openInBottomBar) {
			// @ts-ignore
			Eitri.eventBus.subscribe({
				channel: 'onUserTappedActiveTab',
				callback: _ => {
					Eitri.navigation.back(0)
				}
			})
		}
	}, [])

	const onSearch = term => {
		setAppliedFacets({
			...appliedFacets,
			query: term
		})
	}

	return (
		<Page title={title || t('productCatalog.title', 'Catálogo')}>
			<HeaderContentWrapper className={`justify-between`}>
				<View className={`flex items-center gap-4`}>{!openInBottomBar && <HeaderReturn />}</View>
				<SearchInput onSubmit={onSearch} />
			</HeaderContentWrapper>

			{appliedFacets && <ProductCatalogContent params={appliedFacets} />}

			<BottomInset />
		</Page>
	)
}
