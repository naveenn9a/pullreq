import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './Header.scss';

function Header({ handleModalOpen, modalOpen, menuItems, setOldMenuItem, handleLeftClick, leftSelectedItem, toggleLightPanel, handleGeofence, geofenceOpen }) {
  const [open, setOpen] = React.useState(false);

  const handleSelectMenu = (menu) => {
    setOpen(false);
  };

  return (
    <div className="header">
      <ul className='old-items-menu'>
        <button onClick={toggleLightPanel}>LP</button>
        <button><Link to={'/light-panel'} target={'_blank'}>Separate LP</Link></button>
        {Object.keys(menuItems).map(menuKey => {
          let trackLevel = menuItems[menuKey]['track-level'] ? menuItems[menuKey]['track-level'] : [];
          let trackStatus = trackLevel.filter(o => o.name == 'TrackStatus')[0]
          trackStatus = trackStatus ? trackStatus.value : false
          let allAlarmStatus = trackLevel.filter(o => o.name == 'DisableAllTrackAlarms')[0]
          allAlarmStatus = allAlarmStatus ? allAlarmStatus.value : false

          return <li title={menuKey + ' Alarm Control'} key={menuKey}><button className={`${trackStatus ? 'red-color' : ''} ${allAlarmStatus ? 'yellow-color' : ''} ${leftSelectedItem.id == menuItems[menuKey].id ? 'active-item' : ''} `} onClick={(e) => { handleLeftClick(menuItems[menuKey]) }} onContextMenu={e => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button == 2)
              setOldMenuItem(menuItems[menuKey], menuKey)
          }}>{menuKey}</button></li>
        })}
      </ul>
      <ul>
        <li><button onContextMenu={e => {
          e.preventDefault();
          e.stopPropagation();
          if (e.button == 2)
            handleModalOpen(!modalOpen);
        }}>{!modalOpen ? 'New' : 'Close'}</button></li>
        <li>
          <button onClick={e => { handleGeofence(!geofenceOpen) }}>open gf</button>
        </li>
      </ul>
    </div>
  );
}

export default Header;
