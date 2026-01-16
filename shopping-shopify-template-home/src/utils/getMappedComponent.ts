import Banner from '../components/CmsComponents/Banner/Banner'
import ProductShelf from '../components/CmsComponents/ProductShelf/ProductShelf'
import { CmsItem } from '../types/cmscontent.type'
import React from 'react'

const componentMap = {
	Banner: Banner,
	ProductShelf: ProductShelf
}

export const getMappedComponent = (content: CmsItem) => {
	const Component: React.ComponentType<{ data: CmsItem }> = componentMap[content.name] as
		| React.ComponentType<{ data: CmsItem }>
		| undefined
	if (!Component) {
		console.error(`Component ${content.name} does not exist in the component map.`)
		return null
	}

	try {
		return React.createElement(Component, { key: content.id, data: content })
	} catch (error) {
		console.error(`Error rendering component ${content.name}:`, error)
		return null
	}
}
