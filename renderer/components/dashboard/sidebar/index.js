import PropTypes from 'prop-types';
import { Badge, Button, Card, Form, Nav } from 'react-bootstrap';
import { styled } from '../../../stitches.config';
import { useDashboardContext } from '../DashboardContext';
import SidebarBotControls from './Controls';
import ControlsContextProvider from './Controls/Context';
import SidebarItems from './Items';

const Bar = styled('div', {
  flex: '0 0 4rem',
  padding: '0',
  gap: '0.5rem',
  '>div': {
    width: '4rem',
    height: '4rem',
    padding: '0.85rem 0.85rem',
    '>svg': {
      width: '2.3rem',
      height: '2.3rem',
      filter: 'grayscale(100%) opacity(0.5)',
      color: '$primary',
      transition: '0.2s',
    },
    '&:hover': {
      '>svg': {
        color: '$primary',
        filter: 'grayscale(0) opacity(1)',
      },
    },
    '>.active': {
      '>svg': {
        color: '$primary',
        filter: 'grayscale(0%) opacity(1)',
      },
    },
  },
  '>.navbar': {
    flex: '0 0 4rem',
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
      <Bar className="navbar">
        <SidebarItems />
      </Bar>
      <Card className="items">
        <Card.Body className="px-2 overflow-auto">
          <Nav variant="pills" className="flex-column d-md-block d-none">
            {handlers.map((d, i) => (
              <Nav.Item key={d?.name + '-' + i}>
                <Nav.Link
                  eventKey={'nav-link-' + d?.name + '-' + i}
                  active={handlerIndex === i}
                  onClick={() => updateHandlerIndex(i)}
                  className="d-flex flex-row justify-content-between align-items-center mb-2 cursor-pointer"
                  style={{ cursor: 'pointer' }}
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
                </Nav.Link>
              </Nav.Item>
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
