import { styled } from '../../stitches.config';

const Container = styled('textarea', {
  fontFamily: '$sans',
  select: 'focus-within',
  padding: '0.45rem 0.8rem',
  borderRadius: '$1',
  border: '1px solid $gray900',
  backgroundColor: '$gray800',
  color: '$light',

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

export default function Textarea(props) {
  return <Container {...props} />;
}
