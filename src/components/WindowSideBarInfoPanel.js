import PropTypes from 'prop-types';
import CompanionWindow from '../containers/CompanionWindow';
import { CompanionWindowSection } from './CompanionWindowSection';
import CanvasInfo from '../containers/CanvasInfo';
import LocalePicker from '../containers/LocalePicker';
import ManifestInfo from '../containers/ManifestInfo';
import CollectionInfo from '../containers/CollectionInfo';
import ManifestRelatedLinks from '../containers/ManifestRelatedLinks';
import ns from '../config/css-ns';

/**
 * WindowSideBarInfoPanel
 */
export function WindowSideBarInfoPanel({
  windowId,
  id,
  canvasIds = [],
  collectionPath = [],
  t = k => k,
  locale = '',
  setLocale = undefined,
  availableLocales = [],
  showLocalePicker = false,
}) {
  return (
    <CompanionWindow
      title={t('aboutThisItem')}
      paperClassName={ns('window-sidebar-info-panel')}
      windowId={windowId}
      id={id}
      titleControls={(
        showLocalePicker
          && (
          <LocalePicker
            locale={locale}
            setLocale={setLocale}
            availableLocales={availableLocales}
          />
          )
      )}
    >
      {
        canvasIds.map((canvasId, index) => (
          <CompanionWindowSection
            key={canvasId}
          >
            <CanvasInfo
              id={id}
              canvasId={canvasId}
              index={index}
              totalSize={canvasIds.length}
              windowId={windowId}
            />
          </CompanionWindowSection>
        ))
      }
      { collectionPath.length > 0 && (
        <CompanionWindowSection>
          <CollectionInfo id={id} windowId={windowId} />
        </CompanionWindowSection>
      )}

      <CompanionWindowSection>
        <ManifestInfo id={id} windowId={windowId} />
      </CompanionWindowSection>

      <CompanionWindowSection>
        <ManifestRelatedLinks id={id} windowId={windowId} />
      </CompanionWindowSection>
    </CompanionWindow>
  );
}

WindowSideBarInfoPanel.propTypes = {
  availableLocales: PropTypes.arrayOf(PropTypes.string),
  canvasIds: PropTypes.arrayOf(PropTypes.string),
  collectionPath: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  locale: PropTypes.string,
  setLocale: PropTypes.func,
  showLocalePicker: PropTypes.bool,
  t: PropTypes.func,
  windowId: PropTypes.string.isRequired,
};
