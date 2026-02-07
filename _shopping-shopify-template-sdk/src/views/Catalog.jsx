import { Page } from 'eitri-luminus'
import { App, Shopify } from '@/export'

export default function Catalog(props) {
	const getProduct = async () => {
		const product = await Shopify.catalog.product({ handle: 'calca-sarja-sawary-wide-leg-281529-amarelo' })
		console.log('product==>', product)
	}

	const methods = [
		{
			name: 'Product',
			executor: getProduct
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
