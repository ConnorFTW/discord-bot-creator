import {
  ChatAlt2Icon,
  CogIcon,
  LightningBoltIcon,
  TerminalIcon,
} from '@heroicons/react/solid';
import { useState } from 'react';
import { styled } from '../../../stitches.config';
import { useDashboardContext } from '../DashboardContext';
import SettingsModal from '../settings/SettingsModal';

const Item = styled('div', {
  width: '4rem',
  height: '4rem',
  padding: '0.95rem 0.95rem',
  '>svg': {
    width: '2.1rem',
    height: '2.1rem',
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
});

const Bar = styled('div', {
  flex: '0 0 4rem',
  padding: '0',
  gap: '0.5rem',
  '>.navbar': {
    flex: '0 0 4rem',
  },
});

export default function SidebarItems() {
  const [showSettings, setShowSettings] = useState(false);
  const { updateMode, mode } = useDashboardContext();

  const setMode = (mode) => () => updateMode(mode);

  return (
    <Bar className="navbar">
      <Item
        className={mode === 'command' ? 'active' : ''}
        onClick={setMode('command')}
        style={{ cursor: 'pointer' }}
      >
        <ChatAlt2Icon />
      </Item>
      <Item
        className={mode === 'event' ? 'active' : ''}
        onClick={setMode('event')}
        style={{ cursor: 'pointer' }}
      >
        <LightningBoltIcon />
      </Item>
      <Item
        className={mode === 'logs' ? 'active' : ''}
        onClick={setMode('logs')}
        style={{ cursor: 'pointer' }}
      >
        <TerminalIcon />
      </Item>
      <Item
        onClick={() => setShowSettings(true)}
        className="mt-auto"
        style={{ cursor: 'pointer' }}
      >
        <CogIcon />
      </Item>
      <SettingsModal
        show={showSettings}
        onHide={() => setShowSettings(false)}
      />
    </Bar>
  );
}
