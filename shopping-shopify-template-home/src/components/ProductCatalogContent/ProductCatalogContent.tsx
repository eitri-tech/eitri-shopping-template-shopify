import { useCallback, useEffect } from 'react'
// @ts-ignore
import { View, Image, Text } from 'eitri-luminus'
// import { getProductsService } from '../../services/ProductService'
import { useState } from 'react'
import { BannerContent } from '../../types/cmscontent.type'
import { getProductsService, ProductSearchParams } from '../../services/productService'
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll'
import SearchResults from './Components/SearchResults'
import CatalogFilter from './Components/CatalogFilter'
// @ts-ignore
import { FilterValue } from 'shopping-shopify-template-shared'
import CatalogSort from './Components/CatalogSort'

interface ProductCatalogContent {
	params: ProductSearchParams
}

export default function ProductCatalogContent(props: ProductCatalogContent) {
	const { params, ...rest } = props

	const [productLoading, setProductLoading] = useState(false)
	const [products, setProducts] = useState([])

	const [totalProducts, setTotalProducts] = useState(0)

	const [appliedFacets, setAppliedFacets] = useState<ProductSearchParams>(null)

	const [endCursor, setEndCursor] = useState('')
	const [pagesHasEnded, setPageHasEnded] = useState(false)

	const [filterOptions, setFilterOptions] = useState([])
	const [selectedFilters, setSelectedFilters] = useState<FilterValue[]>([])

	useEffect(() => {
		if (params) {
			// Criar uma cópia limpa dos parâmetros para evitar mutação
			const initialParams = JSON.parse(JSON.stringify(params))

			setAppliedFacets(initialParams)
			setProducts([])
			setPageHasEnded(false)

			getProducts(initialParams, endCursor)
		}
	}, [params])

	const getProducts = async (initialParams: ProductSearchParams, endCursor: string) => {
		try {
			if (productLoading) return

			setProductLoading(true)

			const result = await getProductsService({
				...initialParams,
				...(endCursor && { after: endCursor })
			})

			if (result?.nodes?.length === 0) {
				setProductLoading(false)
				setPageHasEnded(true)
				return
			}

			setPageHasEnded(!result?.pageInfo?.hasNextPage)
			setProducts(prev => [...prev, ...result.nodes])
			setEndCursor(result?.pageInfo?.endCursor)
			setFilterOptions(result?.filters)
			setProductLoading(false)
		} catch (error) {
			console.log('Entrada de pesquisa', 'Erro ao buscar produtos', error)
			setProductLoading(false)
		}
	}

	const onScrollEnd = async () => {
		if (!productLoading && !pagesHasEnded) {
			getProducts(appliedFacets, endCursor)
		}
	}

	const handleSortChange = newSort => {
		const newParams = {
			...appliedFacets,
			sortKey: newSort.sortKey,
			reverse: newSort.reverse
		}
		resetAndSearch(newParams)
	}

	const onApplyFilter = () => {
		const newFilters: ProductSearchParams = {
			...appliedFacets,
			filters: [...(appliedFacets.filters ?? []), ...selectedFilters.map(filter => JSON.parse(filter.input))]
		}
		resetAndSearch(newFilters)
	}

	const onFilterClear = () => {
		const initialParams = JSON.parse(JSON.stringify(params))
		resetAndSearch(initialParams)
		setSelectedFilters([])
	}

	const resetAndSearch = (newParams: ProductSearchParams) => {
		setAppliedFacets(newParams)
		setProducts([])
		setEndCursor('')
		setPageHasEnded(false)
		getProducts(newParams, '')
	}

	return (
		<View {...rest}>
			{products.length > 0 && (
				<>
					<View className='p-4 flex flex-between gap-4 w-full'>
						<CatalogFilter
							filters={filterOptions}
							selectedFilters={selectedFilters}
							setSelectedFilters={setSelectedFilters}
							onApplyFilter={onApplyFilter}
							onFilterClear={onFilterClear}
						/>
						<CatalogSort
							currentSort={{
								sortKey: appliedFacets?.sortKey ?? 'COLLECTION_DEFAULT',
								reverse: appliedFacets?.reverse ?? false
							}}
							onSortChange={handleSortChange}
						/>
					</View>

					{totalProducts > 0 && (
						<View className='px-4'>
							<Text>
								{`Exibindo ${
									totalProducts > 1 ? `${totalProducts} produtos` : `${totalProducts} produto`
								}`}
							</Text>
						</View>
					)}
				</>
			)}

			<InfiniteScroll onScrollEnd={onScrollEnd}>
				<SearchResults
					isLoading={productLoading}
					searchResults={products}
				/>
			</InfiniteScroll>
		</View>
	)
}
