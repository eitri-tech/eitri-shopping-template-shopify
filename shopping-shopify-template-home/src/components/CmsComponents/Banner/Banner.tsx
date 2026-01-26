// @ts-ignore
import { View } from 'eitri-luminus'
import { BannerContent, CmsContent, CmsItem } from '../../../types/cmscontent.type'
import FitOnScreen from './Components/FitOnScreen'
import SliderHero from './Components/SliderHero'
import Eitri from 'eitri-bifrost'

interface BannerProps {
	data: BannerContent
}

export default function Banner({ data }: BannerProps) {
	const handlePress = data => {
		Eitri.navigation.navigate({ path: 'ProductCatalog', state: { params: data } })
	}

	if (data.type === 'fullscreen')
		return (
			<FitOnScreen
				data={data}
				onClick={handlePress}
			/>
		)

	if (data.type === 'hero')
		return (
			<SliderHero
				data={data}
				onClick={handlePress}
			/>
		)

	return <View></View>
}
