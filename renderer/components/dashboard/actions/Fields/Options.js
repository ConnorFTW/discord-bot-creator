import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import { Form, FormGroup, Button } from "react-bootstrap";
import { useDashboardContext } from '../../DashboardContext';

function Options({ value, type }) {
    const { updateField } = useDashboardContext();
    const [state, setState] = useState([...value]);

    useEffect(() => {
        updateField(type, state);
        console.error(JSON.stringify(state));
    }, [JSON.stringify(state)]);

    function updateFieldByIndex(i, j, data) {
        setState((list) => {
            var currentState = [...list];
            switch (j) {
                case 0:
                    currentState[i].name = data;
                    break;
                case 1:
                    currentState[i].description = data;
                    break;
                case 2:
                    currentState[i].required = data;
                    break;
            }
            return currentState;
        });
    }

    function addNewField() {
        setState((list) => {
            return [...list, { name: "", description: "", required: false }];
        })
    }

    return <>
        <br />
        <Button variant="primary" onClick={(_) => { addNewField() }}> Add Option + </Button>
        <br />
        {state.map((option, i, _) => <FormGroup>
            <Form.Label>Name</Form.Label>
            <br />
            <input
                type='text'
                value={option.name}
                onChange={(e) => updateFieldByIndex(i, 0, e.target.value)}>
            </input>
            <Form.Label>Description</Form.Label>
            <br />
            <input
                type='text'
                value={option.description}
                onChange={(e) => updateFieldByIndex(i, 1, e.target.value)}>
            </input>
            <Form.Label>Required</Form.Label>
            <br />
            <input
                type='checkbox'
                checked = {option.required}
                onChange={(e) => updateFieldByIndex(i, 2, e.target.checked)}>
            </input>
        </FormGroup>)}
    </>;
}

export default Options;

Options.prototype = {
    value: PropTypes.object,
    type: PropTypes.string
}