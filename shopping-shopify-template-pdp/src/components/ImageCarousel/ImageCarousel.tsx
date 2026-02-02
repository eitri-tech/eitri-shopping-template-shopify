// @ts-ignore
import { View, Image } from 'eitri-luminus'
import { useState } from 'react'
import { CustomCarousel, useScreen } from 'shopping-shopify-template-shared'
import { Product } from '../../types/product.type'
import Slider from '../../Slider/Slider'
import { BottomInset } from 'shopping-shopify-template-shared'

type ImageCarouselProps = {
	product: Product
}

export default function ImageCarousel(props: ImageCarouselProps) {
	const [currentSlide, setCurrentSlide] = useState(0)

	const { product } = props

	const { availableHeight } = useScreen()

	const onChange = index => {
		setCurrentSlide(index)
	}

	return (
		<View className={'relative'}>
			<Slider
				options={{
					loop: true,
					slideChanged(s) {
						setCurrentSlide(s.track.details.rel)
					}
				}}>
				{product?.images?.nodes?.map((item, index) => {
					return (
						<View
							key={item.url}
							style={{
								height: availableHeight - 72
							}}
							className={`keen-slider__slide`}>
							<Image
								pinchZoom
								zoomMaxScale={8}
								fadeIn={500}
								src={item.url}
								className='w-full h-full object-cover'
							/>
						</View>
					)
				})}
			</Slider>

			{product?.images?.nodes?.length > 1 && (
				<View className='absolute bottom-[15px] flex justify-center flex-wrap gap-2 mt-2 px-4 '>
					{product?.images?.nodes?.map((_, index) => (
						<View
							key={index}
							className={`${currentSlide === index ? 'w-[36px]' : 'w-[12px]'} h-[3px] rounded-lg ${
								currentSlide === index ? 'bg-primary' : 'bg-base-300'
							} transition-[width,background-color] duration-300 ease-in-out"`}
						/>
					))}
				</View>
			)}
		</View>
	)
}
