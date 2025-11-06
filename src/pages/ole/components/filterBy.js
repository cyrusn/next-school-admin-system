import SelectInput from '@/components/form/selectInput'
import RadioInput from '@/components/form/radioInput'
import { COMPONENTS, COMMITTEES_AND_KLAS, CATEGORIES } from '@/config/constant'

const labelMapper = {
  pics: `Events you in charge`,
  components: 'Components',
  category: 'Category',
  committeeAndKla: 'Committee & KLA'
}

const listMapper = {
  components: COMPONENTS,
  category: CATEGORIES,
  committeeAndKla: COMMITTEES_AND_KLAS
}

const elements = Object.keys(labelMapper).map((key) => ({
  value: key,
  title: labelMapper[key]
}))

export default function FilterBy({ filter, handleChange, userInitial }) {
  return (
    <>
      <div className='field is-horizontal'>
        <div className='field-label'>
          <label className='label'>Filter by</label>
        </div>
        <div className='field-body'>
          <div className='field is-narrow'>
            <RadioInput
              elements={elements}
              name='type'
              handleChange={handleChange}
              checkedValue={filter.type}
            />
          </div>
        </div>
      </div>
      {filter.type !== 'pics' ? (
        <div className='field is-horizontal'>
          <div className='field-label'>
            <label className='label'>{labelMapper[filter.type]}</label>
          </div>
          <div className='field-body'>
            <div className='field'>
              <SelectInput
                value={filter.value}
                handleChange={handleChange}
                name='value'
              >
                <option value=''>Please Select</option>
                {listMapper[filter.type]?.map((item, index) => {
                  if (typeof item == 'object') {
                    return (
                      <option value={item.code} key={index}>
                        {item.name}
                      </option>
                    )
                  }
                  return (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  )
                })}
              </SelectInput>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
