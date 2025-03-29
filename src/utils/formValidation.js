import { DateTime } from 'luxon'

/**
 * Validates the form data based on the provided validation rules.
 * @param {Object} formData - The form data to validate.
 * @param {Object} rules - The validation rules for each field.
 * @param {string} zone - The timezone for date validation.
 * @returns {Object} - An object containing error messages for each field.
 */
export const validateForm = (formData, rules, zone) => {
  const newErrors = {}

  // Validate each field based on the rules provided
  for (const field in rules) {
    const rule = rules[field]

    if (rule.required && !formData[field]) {
      newErrors[field] = 'Required'
    }

    if (field === 'email' && rule.email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!regex.test(formData[field])) {
        newErrors[field] = 'Please enter a valid email address.'
      }
    }

    if (field === 'date' && rule.weekday) {
      const dt = DateTime.fromISO(formData.date).setZone(zone)
      if (dt.weekday === 6 || dt.weekday === 7) {
        newErrors[field] =
          'Please select a date that is not a Saturday or Sunday.'
      }
    }
  }

  return newErrors // Return the errors object
}
