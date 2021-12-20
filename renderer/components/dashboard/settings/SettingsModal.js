import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { Button, Form, Modal } from 'react-bootstrap';
import useSettings from '../../../lib/useSettings';
import { styled } from '../../../stitches.config';
import Input from '../../core/Input';

const Title = styled('span', {
  fontSize: '1.5rem',
  fontFamily: 'Poppins, Open Sans, $system',
  fontWeight: 'semibold',
});

export default function SettingsModal(props) {
  const [settings, setSettings] = useSettings();
  let checked = false;

  const { show, onHide } = props;

  if (settings?.checked) {
    checked = settings.checked === 'false' ? false : true;
  }

  const changePrefix = (e) => {
    setSettings({ ...settings, tag: e.target.value });
  };

  const changeToken = (e) => {
    setSettings({ ...settings, token: e.target.value });
  };

  const changeSeparator = (e) => {
    setSettings({ ...settings, separator: e.target.value });
  };

  const saveSettings = () => {
    ipcRenderer.send('saveSettings', settings);
    ipcRenderer.on('saveSettings', (event, data) => {
      props.onHide();
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <Title>Settings</Title>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '80vh' }} className="overflow-auto">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Prefix</Form.Label>
            <Input
              type="text"
              onChange={changePrefix}
              value={settings?.tag}
              placeholder="!"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Token</Form.Label>
            <Input
              type="text"
              value={settings?.token || ''}
              onChange={changeToken}
              placeholder="e.g.: NzI3ODcyOTg0NTc1OTAxNzg2.XvyKig.4eiNtg8CGOkT1Www5sRngSLSJ30"
            />
            <Form.Text>
              Get your token from the{' '}
              <a
                target="_blank"
                href="https://discord.com/developers/applications/"
              >
                bot dashboard
              </a>
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Separator</Form.Label>
            <Input
              type="text"
              value={settings?.separator || ''}
              onChange={changeSeparator}
              placeholder="\\s+"
            />
            <Form.Text>
              <a
                target="_blank"
                href="https://discord.com/developers/applications/"
              ></a>
            </Form.Text>
          </Form.Group>
          <Form.Check
            type="switch"
            label="Run Bot on Save"
            checked={!!settings?.autoRestart}
            onChange={(e) =>
              setSettings({ ...settings, autoRestart: e.target.checked })
            }
            className="mb-3"
          />
          <Form.Check
            type="switch"
            label="Case Sensitive"
            checked={settings?.checked === 'true' || false}
            onChange={(e) =>
              setSettings({
                ...settings,
                settings: e.target.checked ? 'true' : 'false',
              })
            }
            className="mb-3"
          />
          <Form.Check
            type="switch"
            label="Toggle Hints"
            checked={settings?.toggleHints !== false}
            onChange={(e) =>
              setSettings({ ...settings, toggleHints: e.target.checked })
            }
            className="mb-3"
          />
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-row justify-content-between">
        <Button onClick={onHide}>Close</Button>
        <Button onClick={saveSettings} variant="success" className="mt-3">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

SettingsModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
};
