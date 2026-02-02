// @ts-ignore
import { View, Image, Text } from 'eitri-luminus'
import { FaArrowRight } from 'react-icons/fa6'

export default function CategoryTitle(props) {
	const { onClick, title, icon, hasSubItems } = props

	return (
		<View
			onClick={onClick}
			className='p-4 flex justify-between items-center shadow-md bg-white'>
			<View className='flex items-center gap-4'>
				{icon && (
					<Image
						className='max-w-[30px]'
						src={icon}
					/>
				)}
				<Text className='font-bold'>{title}</Text>
			</View>
			{hasSubItems && <FaArrowRight size={20} />}
		</View>
	)
}
