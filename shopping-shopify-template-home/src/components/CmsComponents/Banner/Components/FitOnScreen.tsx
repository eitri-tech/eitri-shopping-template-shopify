// @ts-ignore
import { Text, View, Image } from 'eitri-luminus'
import { BannerContent } from '../../../../types/cmscontent.type'
import { CustomCarousel, useScreen } from 'shopping-shopify-template-shared'

interface BannerProps {
	data: BannerContent
	onClick: (image: BannerContent['images'][number]) => void
}

export default function FitOnScreen({ data, onClick }: BannerProps) {
	const { availableHeight } = useScreen()

	return (
		<View>
			<View
				className={'h-full w-full flex-col'}
				height={availableHeight}>
				<CustomCarousel>
					{data?.images?.map(image => (
						<View
							key={image.imageUrl}
							className={'bg-blue-200 h-full w-full'}
							onClick={() => onClick(image)}>
							<Image
								src={`${image.imageUrl}?height=${availableHeight || 800}`}
								className={'w-full h-full object-cover'}
							/>
						</View>
					))}
				</CustomCarousel>
			</View>
		</View>
	)
}
