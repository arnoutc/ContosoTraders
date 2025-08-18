import React, { useState } from 'react';
import minimalSelectStyles from './minimalSelect.styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { ExpandMore } from '@mui/icons-material';

const MinimalSelect = () => {
  const [val,setVal] = useState(1);
  const handleChange = (event) => {
    setVal(event.target.value);
  };

  const minimalSelectClasses = minimalSelectStyles;

  const iconComponent = (props) => {
    return (
      <ExpandMore className={props.className + " " + minimalSelectClasses.icon}/>
    )};


  return (
    <FormControl>
      <Select
        disableUnderline
        className='minimalSelect'
        IconComponent={iconComponent}
        value={val}
        onChange={handleChange}
      >
        <MenuItem value={0}>Principle</MenuItem>
        <MenuItem value={1}>Recommended</MenuItem>
        <MenuItem value={2}>Photoshop</MenuItem>
        <MenuItem value={3}>Framer</MenuItem>
      </Select>
    </FormControl>
  );
};


export default MinimalSelect;