import { styled } from '../../stitches.config';

const Container = styled('button', {
  color: 'white',
  backgroundColor: '$primary',
  border: 'none',
  borderRadius: '0.5rem',
  padding: '0.5rem 1rem 0.5rem',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '$primaryDark',
  },
});

export default function Button({ children, ...props }) {
  return <Container {...props}>{children}</Container>;
}
