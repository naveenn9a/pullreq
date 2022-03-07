import React from 'react';
import './MenuInfoOld.scss';

function MTextField({ item, handleTextChange, usrPermission }) {
  return <tr>
    <td>{item.label}</td>
    <td className='s-td'><input disabled={usrPermission == 'r'} type="text" value={item.value} name="" min={item.min} max={item.max} onChange={event => handleTextChange(item, event)} checked={item["value"]} id="" />{item["value-label"]}</td>
  </tr>
};

function MNumberField({ item, handleTextChange, usrPermission}) {
  return <tr>
    <td>{item.label}</td>
    <td className='s-td'><input type="number" disabled={item.name == 'AbsoluteMaximum' || usrPermission == 'r'} value={item.value} name="" min={item.min} max={item.max} onChange={event => handleTextChange(item, event)} checked={item["value"]} id="" />{item["value-label"]}</td>
  </tr>
};

function MSelectField({ item, handleSelectChange, usrPermission }) {
  return <tr>
    <td>{item.label}</td>
    <td className='s-td'>
      <select disabled={usrPermission == 'r'} name="" id="" value={item.value} onChange={event => handleSelectChange(item, event)}>
        {item["dropdown-options"].map(option => {
          return <option key={option} value={option}>{option}</option>
        })}
      </select></td>
  </tr>
};

function MSwitch({ item, handleSwitchChange, usrPermission }) {
  return <tr>
    <td>{item.label}</td>
    <td className='s-td'><input disabled={usrPermission == 'r'} type="checkbox" name="" onChange={event => handleSwitchChange(item, event)} checked={item["value"]} id="" />{item["value-label"]}</td>
  </tr>
};

function MenuInfo({ menu: incomingItems, handleChange, handleSubmit, isLoading, handleModalOpen, resetToOriginal, usrPermission }) {
  let { id, menu, "site-level": siteLevelItems, "track-level": trackLevelItems } = incomingItems;

  return (
    <div className="old-menu-info">
      <span onClick={e => {handleModalOpen(false); resetToOriginal()}} className="close-modal">x</span>
      <div className="old-menu-info-main">
        {!trackLevelItems && !siteLevelItems && <div className='no-items'> Please select menu </div>}
        {trackLevelItems && siteLevelItems && <div>
          <h3>{menu} Alarm Control</h3>
          <table>
            <tbody>
              {trackLevelItems && trackLevelItems.map(item => {
                if (item.type == 'checkbox')
                  return <MSwitch usrPermission={usrPermission} key={item.name} item={item} handleSwitchChange={handleChange.bind(this, 'track-level', 'toggle')} />
                if (item.type == 'numbers')
                  return <MNumberField usrPermission={usrPermission} key={item.name} item={item} handleTextChange={handleChange.bind(this, 'track-level', 'number')} />
                if (item.type == 'dropdown')
                  return <MSelectField usrPermission={usrPermission} key={item.name} item={item} handleSelectChange={handleChange.bind(this, 'track-level', 'select')} />
              })}

              {siteLevelItems && siteLevelItems.map(item => {
                if (item.type == 'checkbox')
                  return <MSwitch usrPermission={usrPermission} key={item.name} item={item} handleSwitchChange={handleChange.bind(this, 'site-level', 'toggle')} />
                if (item.type == 'numbers')
                  return <MNumberField usrPermission={usrPermission} key={item.name} item={item} handleTextChange={handleChange.bind(this, 'site-level', 'number')} />
                if (item.type == 'dropdown')
                  return <MSelectField usrPermission={usrPermission} key={item.name} item={item} handleSelectChange={handleChange.bind(this, 'site-level', 'select')} />
              })}
            </tbody>
          </table>
        </div>
        }
      </div>
      <div className="menu-info-button">
        {trackLevelItems && siteLevelItems && <button disabled={ usrPermission == 'r' || isLoading} onClick={handleSubmit} margin="normal" variant='contained'>Update</button>}
      </div>
    </div>
  );
}

export default MenuInfo;
