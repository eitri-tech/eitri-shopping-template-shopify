import { useKeenSlider } from '../keenslider/react.es'
import '../keenslider/keen-slider.min.css'

export default function Slider(props) {
	const { options, children } = props

	const [sliderRef, instanceRef] = useKeenSlider(options)

	return (
		<div
			ref={sliderRef}
			className='keen-slider'>
			{children}
		</div>
	)
}
