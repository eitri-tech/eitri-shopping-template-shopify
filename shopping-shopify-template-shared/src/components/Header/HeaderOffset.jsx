import { DIMENSIONS } from '../../utils/constants'

export default function HeaderOffset(props) {
	const { topInset } = props

	return (
		<>
			{topInset && <View topInset={'auto'} />}
			<View height={DIMENSIONS.HEADER_HEIGHT} />
		</>
	)
}
