// @ts-ignore
import { Text, View, Image, Video } from 'eitri-luminus'
import { useEffect, useState } from 'react'
import { BannerContent } from '../../../../types/cmscontent.type'

import Slider from '../../../../Slider/Slider'

interface BannerProps {
	data: BannerContent
	onClick: (image: BannerContent['images'][number]) => void
}

export default function List(props: BannerProps) {
	const { data, onClick } = props

	const getBannerDimensions = () => {
		const maxWidth = data?.maxWidth
		const maxHeight = data?.maxHeight

		// Define a largura inicial baseada no maxWidth ou um padrão.
		let finalWidth = maxWidth || 300
		// A altura inicial é baseada no maxHeight ou no mesmo padrão.
		let finalHeight = maxHeight || 300

		if (data?.aspectRatio) {
			try {
				const [aspectW, aspectH] = data?.aspectRatio?.split(':').map(Number)
				const numericRatio = aspectH / aspectW

				if (!isNaN(numericRatio)) {
					// Calcula a altura com base na largura inicial.
					const calculatedHeight = finalWidth * numericRatio

					// Se a altura calculada ultrapassar o maxHeight, o maxHeight vira a restrição principal.
					if (maxHeight && calculatedHeight > maxHeight) {
						finalHeight = maxHeight
						finalWidth = maxHeight / numericRatio // Recalcula a largura com base na altura máxima.
					} else {
						finalHeight = calculatedHeight
					}
				}
			} catch (e) {
				// Em caso de erro no formato do aspectRatio, usa os valores padrão.
			}
		}

		return { width: `${finalWidth}px`, height: `${finalHeight}px` }
	}

	return (
		<View className='flex flex-col gap-2'>
			<View className='flex overflow-x-auto'>
				<View className='flex gap-2 px-4'>
					{data?.images &&
						data?.images.map(slider => (
							<View
								key={slider.id}
								className='flex flex-col'>
								<View // Adicionado key para melhor performance e para seguir as boas práticas do React
									style={{
										backgroundImage: `url(${slider.imageUrl})`,
										...getBannerDimensions(),
										backgroundSize: 'cover'
									}}
									className={'rounded'}
									onClick={() => onClick(slider)}
								/>
								{/*{slider?.action?.title && (*/}
								{/*	<View*/}
								{/*		style={{*/}
								{/*			...getBannerDimensions(),*/}
								{/*			height: 'initial'*/}
								{/*		}}*/}
								{/*		className='mt-1'>*/}
								{/*		<Text className='font-bold line-clamp-2 block text-center'>*/}
								{/*			{slider?.action?.title}*/}
								{/*		</Text>*/}
								{/*	</View>*/}
								{/*)}*/}
							</View>
						))}
				</View>
			</View>
		</View>
	)
}
