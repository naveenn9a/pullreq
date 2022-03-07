import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Paper, Switch, FormGroup, FormControlLabel, MenuItem, Select, InputLabel, FormControl, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import './MenuInfo.scss';

function MTextField({ item, handleTextChange, usrPermission }) {
  return <TextField
    id="outlined-number"
    label={item.label}
    disabled={usrPermission == 'r'}
    type="number"
    onChange={event => handleTextChange(item, event)}
    margin="normal"
    value={item.value}
    sx={{
      width: '100%',
    }}
    size="small"
    variant="standard"
  />
};

function MNumberField({ item, handleTextChange, usrPermission }) {
  return <TextField
    id="outlined-number"
    label={item.label}
    disabled={item.name == 'AbsoluteMaximum' || usrPermission == 'r'}
    type="number"
    onChange={event => handleTextChange(item, event)}
    InputProps={{ inputProps: { min: item.min, max: item.max } }}
    margin="normal"
    value={item.value}
    sx={{
      width: '100%',
    }}
    size="small"
    variant="standard"
  />
};

function MSelectField({ item, handleSelectChange, usrPermission }) {
  return <FormControl variant="standard" sx={{
    width: '100%',
  }}>
    <InputLabel title={item.label} id="demo-simple-select-standard-label">{item.label}</InputLabel>
    <Select
      disabled={usrPermission == 'r'}
      labelId="demo-simple-select-standard-label"
      id="demo-simple-select-standard"
      value={item.value}
      onChange={event => handleSelectChange(item, event)}
      label={item.label}
      margin="dense"
    >
      {item["dropdown-options"].map(option => {
        return <MenuItem key={option} value={option}>{option}</MenuItem>
      })}
    </Select>
  </FormControl>
};

function MSwitch({ item, handleSwitchChange, usrPermission }) {
  return <FormGroup>
    <FormControlLabel title={item.label} control={<Switch disabled={usrPermission == 'r'} checked={item["value"]} onChange={event => handleSwitchChange(item, event)} />} label={item["value-label"]} ></FormControlLabel>
  </FormGroup>
};

function MenuInfo({ menu: incomingItems, handleChange, handleSubmit, isLoading, usrPermission }) {
  let { id, menu, "site-level": siteLevelItems, "track-level": trackLevelItems } = incomingItems;

  return (
    <div className="menu-info">
      <div className="menu-info-main">
        {!trackLevelItems && !siteLevelItems && <div className='no-items'> Please select menu </div>}
        {trackLevelItems && siteLevelItems && <div>
        <Typography component={"div"} variant='h6'>{menu} Alarm Control</Typography>
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
        </div>
        }
      </div>
      <div className="menu-info-button">
        {trackLevelItems && siteLevelItems && <LoadingButton disabled={usrPermission == 'r'} loading={isLoading} onClick={handleSubmit} margin="normal" variant='contained'>Update</LoadingButton>}
      </div>
    </div>
  );
}

export default MenuInfo;
