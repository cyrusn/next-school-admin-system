import House from './target/house'
import TargetForm from './target/targetForm'
import Input from './target/input'

const Target = (props) => {
  switch (parseInt(props.formData.targetType)) {
    case 0:
      return <></>
    case 1:
      return <House {...props} />
    case 2:
      return <TargetForm {...props} />
    default:
      return <Input {...props} />
  }
}

export default Target
