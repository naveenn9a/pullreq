import React, { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import MenuList from '@mui/material/MenuList';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import MenuInfo from './components/MenuInfo/MenuInfo';
import MenuInfoOld from './components/MenuInfoOld/MenuInfoOld';
import Geofence from './components/Geofence/Geofence';
import Header from './components/Header/Header';
import axios from 'axios';
import { API } from './config/config';
import './App.scss';
import LightPanel from './components/LightPanel/LightPanel';

function App() {
  const [open, setOpen] = React.useState(false);
  const [modalOpen, handleModalOpen] = React.useState(false);
  const [oldmodalOpen, handleoldModalOpen] = React.useState(false);
  const [geofenceOpen, handleGeofence] = React.useState(false);
  const [choseOldItem, setChoseOldItem] = React.useState({});
  const [activeMenu, setActiveMenu] = React.useState({});
  const [menuItems, setMenuItems] = React.useState({});
  const [leftSelectedItem, makeLeftSelection] = React.useState({});
  const [isLoading, setLoading] = useState(false)
  const [snackBar, showSnackbar] = useState(false)
  const [isShownLightPanel, toggleLightPanel] = useState(true)
  const [originalCopy, setOriginalCopy] = useState(null)
  const [usrPermission, setUsrPermission] = useState('r')

  const handleSelectMenu = (menu) => {
    setOpen(false);
    setActiveMenu(menu)
    // const originalCopy = JSON.parse(JSON.stringify(menu))
    // setOriginalCopy(originalCopy)
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    showSnackbar(false);
  };

  useEffect(async () => {
    let data = await axios.get(`${API}/json`)
    let items = data.data ? data.data.items: {};
    let usrPermission = data.data.usrPermission || 'r';
    setUsrPermission(usrPermission)
    setMenuItems(items);
  }, [])

  const modifyArr = (arr, item, kind, event) => {
    return arr.map(i => {
      if (i.name == item.name) {
        if (kind == 'toggle')
          i['value'] = !i['value']
        if (kind == 'select')
          i['value'] = event.target.value
        if (kind == 'number') {
          console.log(arr, item, kind)
          if(item.name == 'MaxNumber') {
            let abMax = arr.filter(o => o.name == 'AbsoluteMaximum')[0];
            if(abMax && Number(event.target.value) > abMax.value) {
              alert(`Max Number cannot be greater than Absolute Maximum.`)
              return i
            }
          }

          if (Number(event.target.value) > item.max || Number(event.target.value) < item.min) {
            alert(`Please enter number between ${item.min} and ${item.max}`)
            i['value'] = i['value'];
          } else {
            i['value'] = Number(event.target.value)
          }
        }
      };
      return i;
    });
  }

  const handleChange = (isOld = 'new', menu, kind, item, event) => {
    let menuObj = null;
    if (isOld == 'old') {
      menuObj = choseOldItem
    } else {
      menuObj = activeMenu
    }

    let obj = { ...menuObj };
    obj[menu] = modifyArr(obj[menu], item, kind, event);

    if (isOld == 'new') {
    setActiveMenu(obj);
    }
    else
      setChoseOldItem(obj);
  }

  const handleSubmit = async (isOld = 'new') => {
    setLoading(true);
    setTimeout(async () => {
      try {
        await axios.post(`${API}/json`, isOld == 'new' ? activeMenu : choseOldItem)
        setOriginalCopy(null)
        showSnackbar(true)
      } catch (e) {
        alert('error')
      }
      setLoading(false);
    }, 1000);
  }

  const setOldMenuItem = (item, menu) => {
    handleoldModalOpen(true);
    const originalCopy = JSON.parse(JSON.stringify({ ...item, menu }))
    setOriginalCopy(originalCopy)
    setChoseOldItem({ ...item, menu });
  }

  const handleLeftClick = (item) => {
    makeLeftSelection(item);
  }

  const resetToOriginal = () => {
    if(originalCopy) {
      let obj = { ...menuItems };
      obj[originalCopy.menu] = originalCopy
      setMenuItems(obj);
      setOriginalCopy(null)
    }
  }

  return (
    <div className="app-container">
      <Header geofenceOpen={geofenceOpen} handleGeofence={handleGeofence} modalOpen={modalOpen} handleModalOpen={handleModalOpen} menuItems={menuItems} setOldMenuItem={setOldMenuItem} handleLeftClick={handleLeftClick} leftSelectedItem={leftSelectedItem} toggleLightPanel={e => { toggleLightPanel(!isShownLightPanel) }} />
      <Modal
        open={modalOpen}
        onClose={() => {handleModalOpen(false);}}
        disableAutoFocus={true}
      >
        <div className="menu-main">
          <div className="menu-items">
            <MenuList
              autoFocusItem={open}
              id="composition-menu"
              aria-labelledby="composition-button"
            >
              {Object.keys(menuItems).map(menuKey => {
                return <MenuItem key={menuItems[menuKey].id} className={activeMenu.id == menuItems[menuKey].id && 'active'} onClick={() => handleSelectMenu({ ...menuItems[menuKey], menu: menuKey })}>{menuKey} Alarm Control</MenuItem>
              })}
            </MenuList>
          </div>
          <div className="menu-container">
            <MenuInfo usrPermission={usrPermission} menu={activeMenu} handleChange={handleChange.bind(this, 'new')} handleSubmit={handleSubmit.bind(this, 'new')} isLoading={isLoading} />
          </div>
        </div>
      </Modal>

      <Modal
        open={oldmodalOpen}
        onClose={() => {handleoldModalOpen(false); resetToOriginal();}}
        disableAutoFocus={true}
      >
        <div className="old-menu-main">
          <MenuInfoOld usrPermission={usrPermission} resetToOriginal={resetToOriginal} handleModalOpen={handleoldModalOpen} menu={choseOldItem} handleChange={handleChange.bind(this, 'old')} handleSubmit={handleSubmit.bind(this, 'old')} isLoading={isLoading} />
        </div>
      </Modal>
      <Modal
        open={geofenceOpen}
        onClose={() => handleGeofence(false)}
        disableAutoFocus={true}
      >
        <div className="geofence-main">
          <Geofence geofenceOpen={geofenceOpen} handleModalOpen={handleGeofence} isLoading={isLoading} />
        </div>
      </Modal>
      <Snackbar
        open={snackBar}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Updated!
        </Alert>
      </Snackbar>

      {isShownLightPanel && <LightPanel />}
    </div>
  );
}

export default App;
