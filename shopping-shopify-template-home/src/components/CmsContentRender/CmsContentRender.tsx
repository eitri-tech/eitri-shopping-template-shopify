import { getMappedComponent } from '../../utils/getMappedComponent'
// @ts-ignore
import { View } from 'eitri-luminus'
import { CmsContent } from '../../types/cmscontent.type'

type Props = {
	cmsContent: CmsContent
}

export default function CmsContentRender({ cmsContent }: Props) {
	return <View className='gap-6 flex flex-col pb-4'>{cmsContent?.map(content => getMappedComponent(content))}</View>
}
