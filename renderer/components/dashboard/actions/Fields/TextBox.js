import PropTypes from 'prop-types';
import React from "react";
import { Form, FormGroup } from "react-bootstrap";
import { useDashboardContext } from '../../DashboardContext';

function TextBox({ value, type }) {
    const { updateField } = useDashboardContext();
    var tag = ''
    if (type === 'nameField') tag = 'Name'; else tag = 'Description';
    return <FormGroup>
        <Form.Label>{tag}</Form.Label>
        <br />
        <input
            type='text'
            value={value}
            onChange={(e) => updateField(type, e.target.value)}>
        </input>
    </FormGroup>
}

export default TextBox;

TextBox.prototype = {
    value: PropTypes.string,
    type: PropTypes.string
}