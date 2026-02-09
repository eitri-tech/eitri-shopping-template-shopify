import Eitri from 'eitri-bifrost'

export const getRemoteAppConfigProperty = async (property: string): Promise<any> => {
	const remoteConfig = await Eitri.environment.getRemoteConfigs()
	const appConfigs = remoteConfig?.appConfigs
	return appConfigs?.[property]
}
