import ShopifyCaller from '../_helpers/ShopifyCaller'
import { SearchQueryArguments } from '../../models/SearchParams.types'
// @ts-ignore
import { SEARCH_QUERY } from '../../graphql/queries/product.queries.gql'

export default class CatalogService {
	static async search(params: SearchQueryArguments, personalizedQuery?: string) {
		// Construir o body com a query e as variáveis
		const body = {
			query: personalizedQuery || SEARCH_QUERY,
			variables: {
				query: params.query,
				...(params.after !== undefined && { after: params.after }),
				...(params.before !== undefined && { before: params.before }),
				...(params.first !== undefined ? { first: params.first } : { first: 12 }),
				...(params.last !== undefined && { last: params.last }),
				...(params.prefix !== undefined && { prefix: params.prefix }),
				...(params.productFilters !== undefined && {
					productFilters: params.productFilters
				}),
				...(params.reverse !== undefined && { reverse: params.reverse }),
				...(params.sortKey !== undefined && { sortKey: params.sortKey }),
				...(params.types !== undefined && { types: params.types }),
				...(params.unavailableProducts !== undefined && {
					unavailableProducts: params.unavailableProducts
				})
			}
		}

		const res = await ShopifyCaller.post(body)
		return res.data
	}
}
