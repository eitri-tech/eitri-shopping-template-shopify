// @ts-ignore
import { Checkbox, View, Text } from 'eitri-luminus'

interface CustomCheckboxProps {
	checked: boolean
	label?: string
	className?: string
	onChange?: (checked: boolean) => void
}

export default function CustomCheckbox(props: CustomCheckboxProps) {
	const { checked, onChange, label, className } = props

	return (
		<View className={`flex flex-row items-start justify-start gap-2 ${className ?? ''}`}>
			<Checkbox
				checked={checked}
				onChange={onChange ? () => onChange(!checked) : () => {}}
			/>
			{label && (
				<View
					onClick={onChange ? () => onChange(!checked) : () => {}}
					className='ml-1'>
					<Text className='w-full text font-medium'>{label}</Text>
				</View>
			)}
		</View>
	)
}
