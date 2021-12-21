import PropTypes from 'prop-types';
import { Button, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { styled } from '../../../stitches.config';
import { useDashboardContext } from '../DashboardContext';

const Item = styled('div', {
  fontFamily: '$sans',
  color: '$light',
  display: 'flex',
  flexFlow: 'row',
  width: '100%',
  '>.close': {
    filter: 'opacity(0.1)',
    pointerEvents: 'none',
    transition: '0.2s all',
  },
  '&:hover': {
    '>.close': {
      filter: 'opacity(1)',
      pointerEvents: 'inherit',
    },
  },
});

const renderTooltip = (error) => (props) =>
  (
    <Tooltip id="button-tooltip" {...props}>
      {error}
    </Tooltip>
  );

export default function ActionItem({ action, index, onSelect }) {
  const {
    removeAction,
    updateActionIndex,
    showActionModal,
    handlerIndex,
    errors,
  } = useDashboardContext();

  const remove = (e) => {
    e.stopPropagation();
    removeAction(index);
  };

  const select = () => {
    updateActionIndex(index);
    showActionModal();
  };

  const error = errors.find((e) => {
    return e.handlerIndex === handlerIndex && e.actionIndex === index;
  });

  return (
    <Col>
      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip(error?.message)}
        show={!!error}
      >
        <Form.Group
          className={
            'border p-2 my-2 mx-0 row align-items-center rounded ' +
            (error ? 'border-danger' : '')
          }
          onSelect={() => onSelect(index)}
          style={{ cursor: 'pointer', backgroundColor: '#35393f' }}
          onClick={select}
        >
          <Item>
            <p className="col my-0">{action?.name}</p>
            <Button
              className="btn-sm btn-danger btn-close close"
              onClick={remove}
            />
          </Item>
        </Form.Group>
      </OverlayTrigger>
    </Col>
  );
}

ActionItem.propTypes = {
  action: PropTypes.object,
  index: PropTypes.number,
  onSelect: PropTypes.func,
};
