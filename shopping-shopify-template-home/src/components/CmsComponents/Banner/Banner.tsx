// @ts-ignore
import { View } from 'eitri-luminus'
import { BannerContent, BannerContentImage, CmsContent, CmsItem } from '../../../types/cmscontent.type'
import FitOnScreen from './Components/FitOnScreen'
import SliderHero from './Components/SliderHero'
import Eitri from 'eitri-bifrost'
import { ProductSearchParams } from '../../../services/productService'

interface BannerProps {
	data: BannerContent
}

export default function Banner({ data }: BannerProps) {
	const handlePress = (data: BannerContentImage) => {
		const params: ProductSearchParams = {
			type: data?.action?.type,
			handle: data?.action?.value
		}

		Eitri.navigation.navigate({ path: 'ProductCatalog', state: { params } })
	}

	if (data.mode === 'fullscreen')
		return (
			<FitOnScreen
				data={data}
				onClick={handlePress}
			/>
		)

	if (data.mode === 'hero')
		return (
			<SliderHero
				data={data}
				onClick={handlePress}
			/>
		)

	return <View></View>
}
