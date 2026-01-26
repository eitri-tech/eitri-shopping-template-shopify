import { HeaderContentWrapper, HeaderLogo, BottomInset, HeaderCart } from 'shopping-shopify-template-shared'
// @ts-ignore
import { View } from 'eitri-luminus'
import { FiSearch } from 'react-icons/fi'
import Eitri from 'eitri-bifrost'

export default function MainHeader(props) {
	const { cart } = props

	const onPressSearch = () => {
		Eitri.navigation.navigate({ path: 'Search' })
	}

	return (
		<HeaderContentWrapper className={'justify-between'}>
			<HeaderLogo />
			<View className={'flex items-center gap-4'}>
				<FiSearch
					onClick={onPressSearch}
					className='text-header-content'
					size={24}
				/>
				<HeaderCart cart={cart} />
			</View>
		</HeaderContentWrapper>
	)
}
