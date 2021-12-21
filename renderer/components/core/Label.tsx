import { styled } from '../../stitches.config';

const Container = styled('label', {
  display: 'block',
  fontFamily: '$sans',
});

export default function Label({ children, ...props }) {
  return <Container {...props}>{children}</Container>;
}
