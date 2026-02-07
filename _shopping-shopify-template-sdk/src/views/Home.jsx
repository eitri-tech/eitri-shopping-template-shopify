import { Page } from 'eitri-luminus'
import { App } from '@/export'
import Eitri from 'eitri-bifrost'

export default function Home(props) {
	useEffect(() => {
		App.configure({
			appConfigs: {
				statusBarTextColor: 'black'
			}
		})
	}, [])

	const goToPage = path => {
		Eitri.navigation.navigate({ path })
	}

	return (
		<Page>
			<View
				topInset={'auto'}
				className={'flex flex-col gap-4 p-4 mt-4'}>
				<Button
					onClick={() => goToPage('/Catalog')}
					className={'bg-primary text-primary-content'}>
					Catálogo
				</Button>
				<Button
					onClick={() => goToPage('/Cart')}
					className={'bg-primary text-primary-content'}>
					Carrrinho
				</Button>
			</View>
		</Page>
	)
}
