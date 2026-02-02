import { Product } from '../../types/product.type'
// @ts-ignore
import { View, HTMLRender, Text } from 'eitri-luminus'

type DescriptionProps = {
	product: Product
}

export default function Description(props: DescriptionProps) {
	const { product } = props

	if (!product?.descriptionHtml) return null

	return (
		<View className={'px-4'}>
			<Text className='block font-semibold mb-4'>Descrição</Text>
			<HTMLRender html={product?.descriptionHtml} />
		</View>
	)
}
