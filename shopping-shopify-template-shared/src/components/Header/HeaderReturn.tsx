import Eitri from 'eitri-bifrost'
// @ts-ignore
import { Text, View } from 'eitri-luminus'

interface HeaderReturnProps {
	className?: string
	backPage?: number
	onClick?: () => void
}

export default function HeaderReturn(props: HeaderReturnProps) {
	const { backPage = 0, onClick, className } = props

	const onBack = () => {
		if (typeof onClick === 'function') {
			return onClick()
		} else {
			Eitri.navigation.back(backPage)
		}
	}

	return (
		<View
			className={`flex items-center ${className}`}
			onClick={onBack}>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='24'
				height='24'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
				className='text-header-content'>
				<polyline points='15 18 9 12 15 6'></polyline>
			</svg>
		</View>
	)
}
