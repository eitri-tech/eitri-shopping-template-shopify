// types/shopifyProductsArgs.ts

/**
 * Argumentos da query `products` da Storefront API Shopify.
 * Baseado na documentação oficial da Storefront API.  [oai_citation:1‡Shopify](https://shopify.dev/docs/api/storefront/latest/queries/products)
 */
export interface ProductConnection {
	/**
	 * Retorna até os primeiros `n` produtos.
	 */
	first?: number

	/**
	 * Retorna até os últimos `n` produtos.
	 */
	last?: number

	/**
	 * Cursor de paginação: produtos depois desse cursor.
	 */
	after?: string

	/**
	 * Cursor de paginação: produtos antes desse cursor.
	 */
	before?: string

	/**
	 * Filtro de busca em texto (usando a sintaxe de busca do Shopify).
	 * Ex.: `"available_for_sale:true tag:camiseta"`.
	 */
	query?: string

	/**
	 * Inverter a ordem dos produtos retornados.
	 */
	reverse?: boolean

	/**
	 * Chave de ordenação.
	 */
	sortKey?: ProductSortKeys
}

/**
 * Enum com todas as chaves de ordenação válidas para a query `products`.
 * Conforme a documentação: valores possíveis estão em "ProductSortKeys".  [oai_citation:2‡Shopify](https://shopify.dev/docs/api/storefront/latest/queries/products)
 */
export enum ProductSortKeys {
	ID = 'ID',
	TITLE = 'TITLE',
	VENDOR = 'VENDOR',
	PRODUCT_TYPE = 'PRODUCT_TYPE',
	CREATED_AT = 'CREATED_AT',
	UPDATED_AT = 'UPDATED_AT',
	BEST_SELLING = 'BEST_SELLING'
}
