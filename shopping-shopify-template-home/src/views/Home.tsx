// @ts-ignore
import { Text, View, Image, Button, Page } from 'eitri-luminus'
import { HeaderContentWrapper } from 'shopping-shopify-template-shared'
import Eitri from 'eitri-bifrost'

export default function Home(props) {
	return (
		<Page className='w-screen h-screen'>
			<HeaderContentWrapper>Aqui</HeaderContentWrapper>

			<Button
				className='btn btn-primary w-full text-lg py-3'
				onClick={() => {
					Eitri.navigation.navigate({ path: '/Cart' })
				}}>
				Carrinho
			</Button>
		</Page>
	)
}
