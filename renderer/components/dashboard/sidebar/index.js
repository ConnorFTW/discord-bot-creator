import PropTypes from 'prop-types';
import { Badge, Button, Card, Form, Nav } from 'react-bootstrap';
import { styled } from '../../../stitches.config';
import { useDashboardContext } from '../DashboardContext';
import SidebarBotControls from './Controls';
import ControlsContextProvider from './Controls/Context';
import SidebarItems from './Items';

const Item = styled('div', {
  fontFamily: '$sans',
  cursor: 'pointer',
  display: 'flex',
  flexFlow: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '0',
  padding: '0.5rem 1rem',
  borderRadius: '$1',
  '&:hover': {
    filter: 'opacity(0.7)',
  },
  variants: {
    color: {
      active: {
        backgroundColor: '$secondary',
      },
      initial: {
        color: '$light',
      },
    },
  },
});

export default function Sidebar({ selected }) {
  const {
    errors,
    handlers,
    commands,
    events,
    updateHandlerIndex,
    handlerIndex,
    addHandler,
  } = useDashboardContext();

  return (
    <>
      <SidebarItems />
      <Card className="items">
        <Card.Body className="px-2 overflow-auto">
          <Nav variant="pills" className="flex-column d-md-block d-none">
            {handlers.map((d, i) => (
              <Item
                color={handlerIndex === i ? 'active' : 'initial'}
                onClick={() => updateHandlerIndex(i)}
              >
                <span
                  dangerouslySetInnerHTML={{ __html: d?.name }}
                  className="w-100"
                />
                {errors.filter((e) => e.handlerIndex === i).length ? (
                  <Badge bg="danger" text="light">
                    {errors.filter((e) => e.handlerIndex === i).length}
                  </Badge>
                ) : null}
              </Item>
            ))}
          </Nav>
          <Form.Group className="d-md-none">
            <Form.Select
              id="command"
              value={selected}
              onChange={(e) => updateHandlerIndex(e.target.value)}
            >
              {commands?.concat(events || []).map((c, i) => (
                <option
                  key={'select-' + c?.name + '-' + i}
                  onClick={() => updateHandlerIndex(i)}
                  value={i}
                >
                  {c?.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Card.Body>
        <Card.Footer>
          <ControlsContextProvider>
            <SidebarBotControls />
          </ControlsContextProvider>
        </Card.Footer>
        <Card.Footer className="d-flex flex-row justify-content-between align-items-center flex-wrap gap-2">
          <Button onClick={() => addHandler()} variant="secondary">
            Add Command
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
}

Sidebar.propTypes = {
  selected: PropTypes.any,
};
