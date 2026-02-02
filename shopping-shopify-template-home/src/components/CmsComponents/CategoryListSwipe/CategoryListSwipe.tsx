// @ts-ignore
import { View } from 'eitri-luminus'
import CategoryPageItem from './components/CategoryPageItem'
import { ProductSearchParams } from '../../../services/productService'
import Eitri from 'eitri-bifrost'
import { CategoryListSwipeContent, CategoryListSwipeContentNode } from '../../../types/cmscontent.type'

interface CategoryListSwipeProps {
	data: CategoryListSwipeContent
}

export default function CategoryListSwipe(props: CategoryListSwipeProps) {
	const { data } = props

	const openItem = (item: CategoryListSwipeContentNode) => {
		const params: ProductSearchParams = {
			type: item?.action?.type,
			handle: item?.action?.value
		}

		Eitri.navigation.navigate({ path: 'ProductCatalog', state: { params, title: item?.title } })
	}

	return (
		<View className='flex flex-col p-4 gap-4 w-screen max-w-screen overflow-x-hidden'>
			{data?.content?.length > 0 &&
				data?.content?.map(item => (
					<CategoryPageItem
						key={item.title}
						item={item}
						goToItem={openItem}
					/>
				))}
			<View
				bottomInset={'auto'}
				className='w-full'
			/>
		</View>
	)
}
