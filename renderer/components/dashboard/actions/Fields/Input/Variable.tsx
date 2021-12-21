import { styled } from '../../../../../stitches.config';
import Input from '../../../../core/Input';
import { useDashboardContext } from '../../../DashboardContext';

type Props = {
  field: string;
  children: React.ReactNode;
  [key: string]: any;
};

const Container = styled('div', {
  fontFamily: '$sans',
  marginBottom: '0.5rem',
  verticalAlign: 'top',
  variants: {
    display: {
      inline: {
        display: 'inline-block',
        width: 'calc(50% - 0.5rem)',
      },
      block: {
        display: 'block',
        width: '100%',
      },
    },
  },
});

const Label = styled('label', {
  display: 'block',
  fontFamily: '$sans',
});

const Description = styled('span', {
  fontFamily: '$sans',
  fontSize: '0.8rem',
  color: '$gray600',
  display: 'block',
});

export default function InputVariable({
  field,
  config,
  isEvent,
  ...props
}: Props) {
  const { updateField } = useDashboardContext();

  const onChange = (e) => {
    updateField(field, e.target.value);
  };

  return (
    <Container display={config.inline ? 'inline' : 'block'}>
      <Label>{config.title}</Label>
      <Input
        style={{ width: '100%' }}
        {...props}
        field={field}
        onChange={onChange}
        placeholder={config.placeholder}
      />
      <Description>{config.description}</Description>
    </Container>
  );
}
