import React from 'react';
import './toggleDarkThemeSlider.scss';
import ToggleDarkTheme from './../../utils/toggleDarkTheme'
import { THEME_LIGHT } from './../../constants/themes'

function ToggleDarkThemeSlider() {
  return (
      <div className="toggle-container">
        <span>☾</span>
        <span className="toggle">
          <input 
            type='checkbox'
            checked={ (this.props.theme === THEME_LIGHT ? 1 : 0) }
            onChange={ ()=>ToggleDarkTheme(this) }
            className='checkbox'
            id='checkbox'
          />
          <label htmlFor="checkbox" />
        </span>
        <span>☀</span>
      </div>
  )
}

export default ToggleDarkThemeSlider;