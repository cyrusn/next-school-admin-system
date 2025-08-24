import FormInput from '@/components/form/formInput'
import TextAreaInput from '@/components/form/textAreaInput'
import SelectInput from '@/components/form/selectInput'
import MultiSelectInput from '@/components/form/multiSelectInput'
import NumberInput from '@/components/form/numberInput'
import RadioInput from '@/components/form/radioInput'
import DateInput from '@/components/form/dateInput'
import CheckboxInput from '@/components/form/checkboxInput'

export const inputMapper = (formInfo, inputInfo) => {
  const { formData, errors, handleChange } = formInfo
  const { type, name, children, options = {} } = inputInfo

  switch (type) {
    case 'text':
      return (
        <FormInput
          {...{
            handleChange,
            name,
            value: formData[name] || '',
            error: errors[name],
            ...options
          }}
        />
      )
    case 'textarea':
      return (
        <TextAreaInput
          {...{
            handleChange,
            name,
            value: formData[name] || '',
            error: errors[name],
            ...options
          }}
        />
      )
    case 'number':
      return (
        <NumberInput
          {...{
            handleChange,
            name,
            value: formData[name],
            error: errors?.[name],
            ...options
          }}
        />
      )
    case 'date':
      return (
        <DateInput
          {...{
            handleChange,
            name,
            value: formData[name] || '',
            error: errors?.[name],
            ...options
          }}
        />
      )
    case 'select':
      return (
        <SelectInput
          {...{
            handleChange,
            name,
            value: formData[name] || '',
            error: errors?.[name],

            ...options
          }}
        >
          {children}
        </SelectInput>
      )
    case 'multi-select':
      return (
        <MultiSelectInput
          {...{
            handleChange,
            name,
            value: formData[name] || [],
            error: errors?.[name],
            ...options
          }}
        >
          {children}
        </MultiSelectInput>
      )
    case 'radio':
      return (
        <RadioInput
          {...{
            handleChange,
            name,
            checkedValue: formData[name],
            error: errors?.[name],
            ...options
          }}
        />
      )

    case 'checkbox':
      return (
        <CheckboxInput
          {...{
            handleChange,
            name,
            checkedValue: formData[name],
            error: errors?.[name],
            ...options
          }}
        />
      )
  }
}
