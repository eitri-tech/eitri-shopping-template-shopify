// @ts-ignore
import { View, Image } from 'eitri-luminus'
import { useState } from 'react'
import { CustomCarousel } from 'shopping-shopify-template-shared'
import { Product } from '../../types/product.type'

type ImageCarouselProps = {
	product: Product
}

export default function ImageCarousel(props: ImageCarouselProps) {
	const [currentSlide, setCurrentSlide] = useState(0)

	const { product } = props

	const onChange = index => {
		setCurrentSlide(index)
	}

	return (
		<View>
			<CustomCarousel
				onSlideChange={onChange}
				autoPlay={false}
				loop={true}>
				{product?.images?.nodes?.map((item, index) => {
					return (
						<View
							key={item.url}
							className={`flex justify-center items-center`}>
							<Image
								pinchZoom
								zoomMaxScale={8}
								fadeIn={500}
								src={item.url}
								width='100vw'
							/>
						</View>
					)
				})}
			</CustomCarousel>
			{product?.images?.nodes?.length > 1 && (
				<View className='flex justify-center flex-wrap gap-2 mt-2 px-4 '>
					{product?.images?.nodes?.map((_, index) => (
						<View
							key={index}
							className={`${currentSlide === index ? 'w-[36px]' : 'w-[12px]'} h-[6px] rounded-lg ${
								currentSlide === index ? 'bg-primary' : 'bg-base-300'
							} transition-[width,background-color] duration-300 ease-in-out"`}
						/>
					))}
				</View>
			)}
		</View>
	)
}
