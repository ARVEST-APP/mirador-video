import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import LanguageSettings from '../containers/LanguageSettings';
import { NestedMenu } from './NestedMenu';
import WorkspaceSelectionDialog from '../containers/WorkspaceSelectionDialog';
import ChangeThemeDialog from '../containers/ChangeThemeDialog';
import { PluginHook } from './PluginHook';

/**
 */
export function WorkspaceMenu({
  container = null, handleClose, showThemePicker = false, isWorkspaceAddVisible = false,
  t = k => k, tReady = false, toggleZoomControls = () => {}, showZoomControls = false, ...menuProps
}) {
  const [selectedOption, setSelectedOption] = useState(null);

  const pluginProps = arguments[0]; // eslint-disable-line prefer-rest-params

  /** */
  const handleClick = (option, e) => {
    setSelectedOption(option);
    handleClose(e);
  };

  /** */
  const handleDialogClose = () => {
    setSelectedOption(null);
  };

  /** */
  const handleZoomToggleClick = (e) => {
    toggleZoomControls(!showZoomControls);
    handleClose(e);
  };

  return (
    <>
      <Menu
        container={container?.current}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        transformOrigin={{
          horizontal: 'left',
          vertical: 'top',
        }}
        onClose={handleClose}
        {...menuProps}
      >
        <MenuItem
          aria-haspopup="true"
          disabled={isWorkspaceAddVisible}
          onClick={(e) => { handleZoomToggleClick(e); }}
          aria-owns={selectedOption === 'toggleZoom' ? 'toggle-zoom-menu' : undefined}
        >
          <Typography variant="body1">
            { showZoomControls ? t('hideZoomControls') : t('showZoomControls') }
          </Typography>
        </MenuItem>
        <MenuItem
          aria-haspopup="true"
          onClick={(e) => { handleClick('workspaceSelection', e); }}
          aria-owns={selectedOption === 'workspaceSelection' ? 'workspace-selection' : undefined}
        >
          <Typography variant="body1">{t('selectWorkspaceMenu')}</Typography>
        </MenuItem>

        <NestedMenu label={t('language')}>
          <LanguageSettings afterSelect={handleClose} />
        </NestedMenu>
        { showThemePicker && (
          <MenuItem
            aria-haspopup="true"
            onClick={(e) => { handleClick('changeTheme', e); }}
            aria-owns={selectedOption === 'changeTheme' ? 'change-theme' : undefined}
          >
            <Typography variant="body1">{t('changeTheme')}</Typography>
          </MenuItem>
        )}
        <PluginHook {...pluginProps} />
      </Menu>
      {selectedOption === 'changeTheme' && (
        <ChangeThemeDialog
          container={container?.current}
          handleClose={handleDialogClose}
          open={selectedOption === 'changeTheme'}
        />
      )}
      {selectedOption === 'workspaceSelection' && (
        <WorkspaceSelectionDialog
          open={selectedOption === 'workspaceSelection'}
          container={container?.current}
          handleClose={handleDialogClose}
        />
      )}
    </>
  );
}

WorkspaceMenu.propTypes = {
  container: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  handleClose: PropTypes.func.isRequired,
  isWorkspaceAddVisible: PropTypes.bool,
  showThemePicker: PropTypes.bool,
  showZoomControls: PropTypes.bool,
  t: PropTypes.func,
  toggleZoomControls: PropTypes.func,
  tReady: PropTypes.bool,
};
