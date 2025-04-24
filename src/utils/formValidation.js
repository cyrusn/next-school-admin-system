import { DateTime } from 'luxon'
import { TIMEZONE } from '@/config/constant'
import { isEmpty } from 'lodash'
/**
 * Validates the form data based on the provided validation rules.
 * @param {Object} formData - The form data to validate.
 * @param {Object} rules - The validation rules for each field.
 * @param {string} zone - The timezone for date validation.
 * @returns {Object} - An object containing error messages for each field.
 */
export const validateForm = (formData, rules) => {
  const newErrors = {}

  // Validate each field based on the rules provided
  for (const field in rules) {
    const rule = rules[field]

    if (rule.nonEmpty && formData[field]?.length == 0) {
      newErrors[field] = 'Required'
    }

    if (rule.minLength && formData[field]?.length < rule.minLength) {
      newErrors[field] =
        `Value must not be less than '${rule.minLength}' character length`
    }

    if (rule.required && isEmpty(formData[field])) {
      newErrors[field] = 'Required'
    }

    if (rule.nonZero && formData[field] == 0) {
      newErrors[field] = 'Non zero number'
    }

    if (rule.email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!regex.test(formData[field])) {
        newErrors[field] = 'Please enter a valid email address.'
      }
    }

    if (field === 'date' && rule.weekday) {
      const dt = DateTime.fromISO(formData.date).setZone(TIMEZONE)
      if (dt.weekday === 6 || dt.weekday === 7) {
        newErrors[field] =
          'Please select a date that is not a Saturday or Sunday.'
      }
    }

    if ('custom' in rule) {
      const errorMsg = rule['custom'](formData, field)
      if (errorMsg) {
        newErrors[field] = errorMsg
      }
    }
  }

  return newErrors // Return the errors object
}
