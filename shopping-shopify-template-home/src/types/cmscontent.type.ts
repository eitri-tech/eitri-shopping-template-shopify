export interface BannerContent {
	id: string
	name: string
	aspectRatio?: string
	autoPlay?: boolean
	type?: string
	title?: string
	description?: string
	images: {
		imageUrl: string
	}[]
}

export interface ProductShelfContent {
	id: string
	name: string
	collectionId: string
}

export type CmsItem = BannerContent | ProductShelfContent

export type CmsContent = CmsItem[]
