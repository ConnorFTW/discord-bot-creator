import { styled } from '../../stitches.config';

const Container = styled('input', {
  select: 'focus-within',
  padding: '0.45rem 0.8rem',

  '&:focus': {
    borderColor: 'none',
    boxShadow: 'none !important',
    outline: 'none',
  },

  '&:focus-within': {
    borderColor: '$link !important',
    boxShadow: 'none !important',
    outline: 'none',
  },
});

export default function Input(props) {
  return <Container {...props} />;
}
