export type ActionType = 'collection' | 'search' | 'product'

export type SortKey =
	| 'BEST_SELLING'
	| 'COLLECTION_DEFAULT'
	| 'CREATED'
	| 'ID'
	| 'MANUAL'
	| 'PRICE'
	| 'RELEVANCE'
	| 'TITLE'

export interface BannerContent {
	id: string
	blockType: string
	mode?: string
	aspectRatio?: string
	autoPlay?: boolean
	title?: string
	description?: string
	images: BannerContentImage[]
}

export interface BannerContentImage {
	imageUrl: string
	action: {
		type: ActionType
		value: string
	}
}

export interface ProductShelfContent {
	id: string
	blockType: string
	mode?: string
	title?: string
	params?: {
		type: ActionType
		value: string
		filters: {}[]
	}
}

export type CategoryListSwipeContentNode = {
	title: string
	action?: {
		type: ActionType
		value?: string
	}
	subcategories?: CategoryListSwipeContentNode[]
	icon: string
}

export type CategoryListSwipeContent = {
	id: string
	blockType: string
	content: CategoryListSwipeContentNode[]
}

export type CmsItem = BannerContent | ProductShelfContent | CategoryListSwipeContent

export type CmsContent = CmsItem[]

export type CMSPage = {
	id: string
	type: string
	sections: CmsContent
	name: string
}
