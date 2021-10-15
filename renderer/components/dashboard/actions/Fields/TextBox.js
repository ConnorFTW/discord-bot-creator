import PropTypes from 'prop-types';
import React from "react";
import { useDashboardContext } from '../../DashboardContext';

function TextBox({ value, type }) {
    const { updateField } = useDashboardContext;
    return <input 
                type='text' 
                value={value} 
                onChange={(e) => updateField(type, e.target.value)}>
            </input>
}

export default TextBox;

TextBox.prototype = {
    value: PropTypes.string,
    type: PropTypes.string
}