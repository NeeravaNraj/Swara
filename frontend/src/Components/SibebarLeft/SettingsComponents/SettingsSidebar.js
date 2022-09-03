import React from 'react'

function SettingsSidebar({view, setView}) {

    const handleViewChange = (viewName) => {
        setView({view_name: viewName})
    }

  return (
    <div className='settings-sidebar'>
        <div className='settings-options-container'>
            <button className='sidebar-option' onClick={() => handleViewChange('type')}>Song types</button>
            <button className='sidebar-option' onClick={() => handleViewChange('raga')}>Raga</button>
            <button className='sidebar-option' onClick={() => handleViewChange('composer')}>Composers</button>
            <button className='sidebar-option' onClick={() => handleViewChange('lyricist')}>Lyricists</button>
            <button className='sidebar-option' onClick={() => handleViewChange('tuner')}>Tuners</button>
        </div>
    </div>
  )
}

export default SettingsSidebar