import PropTypes from 'prop-types';
import Editor from './Code';
import ColorField from './Color';
import CommentField from './Comment';
import Input from './Input';
import InputVariable from './Input/Variable';
import SelectChannel from './Select/Channel';
import SelectGuild from './Select/Guild';
import SelectMember from './Select/Member';
import Textarea from './Textarea';

export const SUPPORTED_FIELDS = [
  'code',
  'comment',
  'color',
  'member',
  'varName',
  'reason',
  'guild',
  'varName2',
  'days',
  // IRL not supported
  'channel',
  'message',
  'iffalse',
  'storage',
  'iffalseVal',
];
export const fieldsSupported = (fields = []) => {
  return fields.every((field) => SUPPORTED_FIELDS.includes(field));
};

export default function FieldManager({ fields, fieldValues, form }) {
  if (form) {
    try {
      form = JSON.parse(form);
    } catch {
      console.error('Invalid JSON.', form);
      return null;
    }
    return Object.keys(form).map((field) => {
      const config = form[field];
      console.log({ type: config.type });
      if (config.if) {
        const fi = config.if;
        if (typeof fi.greaterThan !== 'undefined') {
          if (fieldValues[fi.field] <= fi.greaterThan) {
            return null;
          }
        }
      }

      if (config.type === 'code') {
        return (
          <Editor key={field} config={config} value={fieldValues[field]} />
        );
      }
      if (config.type === 'color') {
        return (
          <ColorField key={field} config={config} value={fieldValues[field]} />
        );
      }
      if (config.type === 'member') {
        return (
          <SelectMember
            key={field}
            config={config}
            field={field}
            value={fieldValues[field]}
          />
        );
      }
      if (config.type === 'guild') {
        return (
          <SelectGuild
            key={field}
            config={config}
            field={field}
            value={fieldValues[field]}
          />
        );
      }
      if (config.type === 'variable') {
        return (
          <InputVariable
            key={field}
            config={config}
            field={field}
            value={fieldValues[field]}
          />
        );
      }
      if (config.type === 'text') {
        return (
          <Input
            key={field}
            config={config}
            field={field}
            value={fieldValues[field]}
          />
        );
      }
      if (config.type === 'text') {
        return (
          <Input
            key={field}
            config={config}
            field={field}
            value={fieldValues[field]}
            type="number"
          />
        );
      }
      if (config.type === 'textarea') {
        return (
          <Textarea
            key={field}
            config={config}
            field={field}
            value={fieldValues[field]}
            type="textarea"
          />
        );
      }
      if (config.type === 'channel') {
        return (
          <SelectChannel
            key={field}
            config={config}
            field={field}
            value={fieldValues[field]}
          />
        );
      }
    });
  }
  return (
    <>
      {fields.map((field) => {
        if (field === 'code') {
          return <Editor key={field} value={fieldValues[field]} />;
        }
        if (field === 'comment') {
          return <CommentField value={fieldValues[field]} />;
        }
        if (field === 'color') {
          return <ColorField value={fieldValues[field]} />;
        }
      })}
    </>
  );
}

FieldManager.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string),
  fieldValues: PropTypes.object,
};
