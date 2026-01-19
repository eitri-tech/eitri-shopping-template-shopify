import Eitri from 'eitri-bifrost'
import RemoteConfig from '../RemoteConfig'
import Logger from './Logger'

export default class ShopifyCaller {
	static _mountUrl = (): string => {
		const version = RemoteConfig.getContent('providerInfo.apiVersion') || '2026-01'
		let host = RemoteConfig.getContent('providerInfo.host')

		if (!host) {
			throw new Error('Nenhum host definido para essa loja')
		}

		if (!/^https?:\/\//.test(host)) {
			host = `https://${host}`
		}

		return new URL(`/api/${version}/graphql.json`, host).toString()
	}

	static async post(data = {}, options = { headers: {} }, baseUrl?: string) {
		const url = baseUrl || ShopifyCaller._mountUrl()
		const storefrontAccessToken = RemoteConfig.getContent('providerInfo.storefrontAccessToken')

		Logger.log('==Executando POST em ===>', url)
		Logger.log('==BODY ===>', data)

		const res = await Eitri.http.post(url, data, {
			...options,
			headers: {
				'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
				'Content-Type': 'application/json',
				...(options?.headers || {})
			}
		})

		Logger.log('=== POST Finalizado ===>', url)

		return res
	}
}
