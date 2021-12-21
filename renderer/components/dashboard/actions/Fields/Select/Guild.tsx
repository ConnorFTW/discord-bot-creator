import Select from '.';

type Props = {
  field: string;
  children: React.ReactNode;
  [key: string]: any;
};

export default function SelectGuild({
  field,
  isEvent,
  config,
  ...props
}: Props) {
  return (
    <Select {...props} config={config} field={field}>
      <option value="0">Current Server</option>
      <option value="1">Temp Variable</option>
      <option value="2">Server Variable</option>
      <option value="3">Global Variable</option>
    </Select>
  );
}
