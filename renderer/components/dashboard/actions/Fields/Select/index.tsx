import { styled } from '../../../../../stitches.config';
import Label from '../../../../core/Label';
import { useDashboardContext } from '../../../DashboardContext';

const Container = styled('div', {
  fontFamily: '$sans',
  marginBottom: '0.5rem',
  verticalAlign: 'top',
  variants: {
    display: {
      inline: {
        display: 'inline-block',
        marginRight: '0.5rem',
        width: 'calc(50% - 0.5rem)',
      },
      block: {
        display: 'block',
      },
    },
  },
});

export default function Select({ field, children, config, ...props }) {
  const { updateField } = useDashboardContext();

  const onChange = (e) => {
    updateField(field, e.target.value);
  };

  return (
    <Container display={config.inline ? 'inline' : 'block'}>
      <Label>{config.title}</Label>
      <select {...props} onChange={onChange}>
        {children}
      </select>
    </Container>
  );
}
