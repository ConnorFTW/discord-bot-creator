import { Col, Tab } from 'react-bootstrap';
import { styled } from '../../stitches.config';
import ActionForm from './actions/ActionForm';
import CommandView from './command/CommandView';
import { useDashboardContext } from './DashboardContext';
import EventView from './event/EventView';
import LogView from './log/LogView';
import Sidebar from './sidebar/index';

const Container = styled('div', {
  display: 'flex',
  flexFlow: 'column',
  margin: '0',
  '>.navbar': {
    flexFlow: 'row',
    width: '4rem',
    flexBasis: 'content',
    display: 'flex',
    alignSelf: 'start',
    padding: '0',
  },
  '>.items': {
    maxWidth: '100vw',
    flexBasis: 'content',
    flex: '1 0 15vw',
    '>.card-body': {
      backgroundColor: '#2e3136',
      a: {
        fontWeight: '500',
        color: '$light',
        transition: '0.2s',
      },
      'a:hover': {
        backgroundColor: '$gray-800',
      },
    },
    '>.card-footer': {
      backgroundColor: '#282b2f',
    },
    '>.settings-button': {
      cursor: 'pointer',
      height: '1.5rem',
      color: '$light',
    },
  },
  '>.command-view': {
    overflow: 'scroll',
  },
  '@bp1': {
    flexFlow: 'row',
    padding: 'inherit',
    '>.card': {
      height: '100vh',
    },
    '>.items': {
      width: 'auto',
      maxWidth: 'calc(20% - 4rem)',
      flexBasis: 'content',
    },
    '>.navbar': {
      height: '100vh',
      flexFlow: 'column',
      justifyContent: 'start',
    },
  },
});

export default function DashboardWindow() {
  // Component Controls
  const { mode, handler, actionModalVisible, hideActionModal } =
    useDashboardContext();

  let isEvent = mode === 'event';

  return (
    <Tab.Container>
      <Container>
        <Sidebar />
        <Col
          className="p-4 command-view overflow-auto"
          style={{ maxHeight: '100vh' }}
        >
          {(() => {
            switch (mode) {
              case 'event':
                return <EventView event={handler} />;
              case 'command':
                return <CommandView command={handler} />;
              case 'logs':
                return <LogView />;
            }
          })()}
          <ActionForm
            show={actionModalVisible}
            onHide={hideActionModal}
            isEvent={isEvent}
          />
        </Col>
      </Container>
    </Tab.Container>
  );
}
