import ShopifyCaller from '../_helpers/ShopifyCaller'
import { SearchQueryArguments } from '../../models/SearchParams.types'
// @ts-ignore
import { SEARCH_QUERY, COLLECTION_QUERY } from '../../graphql/queries/product.queries.gql'
import { CollectionParams } from '../../models/CollectionParams.types'
import RemoteConfig from '../RemoteConfig'
import { CollectionReturn } from '../../models/CollectionReturn.types'

export default class CatalogService {
	static async search(params: SearchQueryArguments, personalizedQuery?: string) {
		const _params = {
			...params,
			first: params.first || 12
		}

		const body = {
			query: personalizedQuery || SEARCH_QUERY,
			variables: {
				_params
			}
		}

		const res = await ShopifyCaller.post(body)
		return res.data
	}

	static async collection(params: CollectionParams, query: string = COLLECTION_QUERY): Promise<CollectionReturn> {
		const _params = {
			...params,
			first: params.first || 12
		}

		const body = {
			query,
			variables: {
				..._params
			}
		}

		const res = await ShopifyCaller.post(body)
		return res?.data?.data?.collection
	}

	static async getProductJson(handle: string) {
		let host = RemoteConfig.getContent('providerInfo.host')
		const url = `https://${host}/products/${handle}.json`

		const res = await ShopifyCaller.get(null, url)
		return res.data
	}
}
