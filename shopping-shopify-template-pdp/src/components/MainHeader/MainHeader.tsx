// @ts-ignore
import { Text, View, Image, Button, Page } from 'eitri-luminus'
// @ts-ignore
import { HeaderCart, HeaderContentWrapper, HeaderLogo, HeaderSearchIcon } from 'shopping-shopify-template-shared'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import Eitri from 'eitri-bifrost'

export default function MainHeader() {
	const { cart } = useLocalShoppingCart()

	const navigateToSearch = () => {
		Eitri.navigation.navigate({
			path: 'Search'
		})
	}

	return (
		<HeaderContentWrapper
			scrollEffect={true}
			className='justify-between'>
			<View>
				<HeaderLogo />
			</View>

			{/*<View className='flex justify-between gap-[12px]'>*/}
			{/*	<HeaderCart cart={cart} />*/}
			{/*</View>*/}
		</HeaderContentWrapper>
	)
}
