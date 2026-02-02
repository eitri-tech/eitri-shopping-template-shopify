// @ts-ignore
import { Text, View, Image } from 'eitri-luminus'
import { useEffect, useState } from 'react'
import { CustomCarousel, useScreen } from 'shopping-shopify-template-shared'
import { BannerContent } from '../../../../types/cmscontent.type'

import Slider from '../../../../Slider/Slider'

interface BannerProps {
	data: BannerContent
	onClick: (image: BannerContent['images'][number]) => void
}

export default function SliderHero(props: BannerProps) {
	const { data, onClick } = props

	const { availableWidth } = useScreen()

	const [currentSlide, setCurrentSlide] = useState(0)
	const [proportionalHeight, setProportionalHeight] = useState('auto')

	const imagesList = data?.images

	useEffect(() => {
		if (data?.aspectRatio && availableWidth > 0) {
			try {
				const [aspectWidth, aspectHeight] = data?.aspectRatio?.split(':')?.map(Number)
				setProportionalHeight(`${availableWidth * (aspectHeight / aspectWidth)}`)
			} catch (e) {}
		}
	}, [availableWidth])

	const onChange = i => {
		console.log('i', i)
		setCurrentSlide(i)
	}

	return (
		<View className='relative'>
			{data.title && (
				<View className='px-4 flex items-center justify-center w-full'>
					<Text className='font-bold mb-8'>{data.title}</Text>
				</View>
			)}

			<Slider
				options={{
					loop: true,
					slideChanged(s) {
						setCurrentSlide(s.track.details.rel)
					}
				}}>
				{imagesList &&
					imagesList.map(image => (
						<View
							className='w-full flex justify-center snap-x snap-always keen-slider__slide'
							key={`image_${image.imageUrl}`}>
							<View
								onClick={() => {
									onClick(image)
								}}
								height={proportionalHeight}
								width='100%'>
								<Image
									fadeIn={1000}
									className='w-full h-full'
									src={image.imageUrl}
								/>
							</View>
						</View>
					))}
			</Slider>

			{/*<CustomCarousel*/}
			{/*	onSlideChange={onChange}*/}
			{/*	autoPlay={data.autoPlay ?? true}*/}
			{/*	interval={6000}*/}
			{/*	loop={true}>*/}
			{/*	{imagesList &&*/}
			{/*		imagesList.map(image => (*/}
			{/*			<View*/}
			{/*				className='w-full flex justify-center snap-x snap-always'*/}
			{/*				key={`image_${image.imageUrl}`}>*/}
			{/*				<View*/}
			{/*					onClick={() => {*/}
			{/*						onClick(image)*/}
			{/*					}}*/}
			{/*					height={proportionalHeight}*/}
			{/*					width='100%'>*/}
			{/*					<Image*/}
			{/*						fadeIn={1000}*/}
			{/*						className='w-full h-full'*/}
			{/*						src={image.imageUrl}*/}
			{/*					/>*/}
			{/*				</View>*/}
			{/*			</View>*/}
			{/*		))}*/}
			{/*</CustomCarousel>*/}
			{imagesList.length > 1 && (
				<View className='flex justify-center gap-2 mt-2'>
					{imagesList.map((_, index) => (
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
