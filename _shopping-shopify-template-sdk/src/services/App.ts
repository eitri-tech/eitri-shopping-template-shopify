import RemoteConfig from './RemoteConfig'

export default class App {
	static async configure(overwrites: any = null) {
		await RemoteConfig.init(overwrites)
	}
}
