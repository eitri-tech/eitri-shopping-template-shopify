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

export type CmsItem = BannerContent

export type CmsContent = CmsItem[]
