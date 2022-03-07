import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from './../../config/config';
import './LightPanel.scss';

function LightPanel({ }) {
  const [lightPanelInfo, setLightPanelInfo] = useState({});
  const [permission, setPermission] = useState(false);
  const [activePanel, setActivePanel] = useState(null);

  useEffect(async () => {
    let data = await axios.get(`${API}/lightpanel`)
    let panelData = JSON.parse(data.data);
    setLightPanelInfo(panelData.items)
    setPermission(panelData.UserPlcAccess)
  }, [])

  const handleShowPanel = lightKey => {
    if (lightKey == activePanel) {
      setActivePanel(null)
    } else {
      setActivePanel(lightKey)
    }
  }

  const handleColorChange = async (lightKey, color) => {
    if(!permission)
      return
    
    let data = await axios.post(`${API}/updateLight`, { lightKey, color })
    setLightPanelInfo(data.data.items);
  }

  return (
    <div className="light-panel">
      <ul className={'outer-ul'}>
        {Object.keys(lightPanelInfo).map(lightKey => {
          return <li key={lightKey} className={`${lightPanelInfo[lightKey].selected}`} onClick={e => handleShowPanel(lightKey)}>{lightKey}
            <ul onClick={e => e.stopPropagation()} className={`${activePanel == lightKey ? 'shown' : 'hidden'} inner-ul`}>
              {lightPanelInfo[lightKey].colors.map(color => {
                return <li key={color}><button className={color.toLowerCase()} onClick={e => handleColorChange(lightKey, color)} disabled={!permission || lightPanelInfo[lightKey].selected == color}>{color}</button></li>
              })}
            </ul>
          </li>
        })}
        
      </ul>
    </div>
  );
}

export default LightPanel;
