import Select from '.';

type Props = {
  field: string;
  children: React.ReactNode;
  [key: string]: any;
};

export default function SelectMember({
  field,
  isEvent,
  config,
  ...props
}: Props) {
  return (
    <Select {...props} config={config} field={field}>
      {!isEvent && (
        <>
          <option value="0">Mentioned User</option>
          <option value="1">Command Author</option>
        </>
      )}
      <option value="2">Temp Variable</option>
      <option value="3">Server Variable</option>
      <option value="4">Global Variable</option>
    </Select>
  );
}
