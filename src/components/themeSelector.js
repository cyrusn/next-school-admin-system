import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect } from 'react'
import {
  faHome,
  faMoon,
  faSun,
  faDesktop
} from '@fortawesome/free-solid-svg-icons'

const ThemeSelector = () => {
  const themes = [
    { name: 'System', className: 'has-text-success', icon: faDesktop },
    { name: 'Light', className: 'has-text-warning', icon: faSun },
    { name: 'Dark', className: 'has-text-link', icon: faMoon }
  ]
  const [theme, setTheme] = useState({ ...themes[0] })

  const updateTheme = (newTheme) => {
    const classList = document.querySelector('html').classList

    if (newTheme == 'System') {
      setTheme(themes[0])
      classList.remove('theme-dark')
      classList.remove('theme-light')
      return
    }

    if (newTheme == 'Light') {
      setTheme(themes[1])
      classList.add('theme-light')
      classList.remove('theme-dark')
      return
    }

    if (newTheme == 'Dark') {
      setTheme(themes[2])
      classList.add('theme-dark')
      classList.remove('theme-light')
    }
  }

  return (
    <div className='navbar-item has-dropdown is-hoverable'>
      {themes
        .filter(({ name }) => theme.name == name)
        .map((theme) => {
          return (
            <a
              className={`navbar-link is-arrowless ${theme.className}`}
              key={theme.name}
            >
              <FontAwesomeIcon icon={theme.icon} />
            </a>
          )
        })}
      <div className='navbar-dropdown is-boxed'>
        {themes.map((t) => {
          return (
            <a
              className='navbar-item'
              onClick={() => updateTheme(t.name)}
              key={t.name}
            >
              <FontAwesomeIcon icon={t.icon} className={t.className} /> {t.name}
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default ThemeSelector
