// @ts-ignore
import { Page, View, Button } from 'eitri-luminus'
import { App, Shopify } from '@/export'

export default function Cart(props) {
	const getCart = async () => {
		const cart = await Shopify.cart.generateNewCart()
		console.log('cart==>', cart)
	}

	const methods = [
		{
			name: 'Cart',
			executor: getCart
		}
	]

	return (
		<Page>
			<View
				topInset={'auto'}
				className={'flex flex-col p-4 mt-4'}>
				{methods?.map(m => (
					<Button
						onClick={m.executor}
						className={'bg-primary text-primary-content'}>
						{m.name}
					</Button>
				))}
			</View>
		</Page>
	)
}
