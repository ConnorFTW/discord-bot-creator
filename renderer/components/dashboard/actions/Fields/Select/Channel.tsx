import Select from '.';

type Props = {
  field: string;
  children: React.ReactNode;
  [key: string]: any;
};

export default function SelectChannel({
  field,
  isEvent,
  config,
  ...props
}: Props) {
  return (
    <Select {...props} config={config} field={field}>
      {!isEvent && (
        <>
          <option value="0">Same Channel</option>
          <option value="1">Mentioned Channel</option>
        </>
      )}
      <option value="2">Default Channel</option>
      <option value="3">Temp Variable</option>
      <option value="4">Server Variable</option>
      <option value="5">Global Variable</option>
    </Select>
  );
}
