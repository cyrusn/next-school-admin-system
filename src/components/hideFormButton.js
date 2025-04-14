import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

const HideFormButton = ({ isShow, handleShowClick, handleHideClick }) => {
  if (isShow) {
    return (
      <button
        className='button is-fullwidth is-small mb-2 is-light is-danger'
        onClick={handleHideClick}
      >
        <span className='mr-2'>Hide Filters </span>
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
    )
  }
  return (
    <button
      className='button is-fullwidth is-small mb-2 is-warning is-light'
      onClick={handleShowClick}
    >
      <span className='mr-2'>Show Filters </span>
      <FontAwesomeIcon icon={faChevronRight} />
    </button>
  )
}
export default HideFormButton
