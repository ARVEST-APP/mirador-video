import { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import AnnotationSettings from '../containers/AnnotationSettings';
import CanvasAnnotations from '../containers/CanvasAnnotations';
import CompanionWindow from '../containers/CompanionWindow';
import ns from '../config/css-ns';

const StyledSection = styled('div')({
  borderBottom: '.5px solid',
});
/**
 * WindowSideBarAnnotationsPanel ~
*/
export class WindowSideBarAnnotationsPanel extends Component {
  /** */
  constructor(props) {
    super(props);

    this.containerRef = createRef();
  }

  /**
   * Returns the rendered component
  */
  render() {
    const {
      annotationCount, canvasIds, t, windowId, id,
    } = this.props;
    return (
      <CompanionWindow
        title={t('annotations')}
        paperClassName={ns('window-sidebar-annotation-panel')}
        windowId={windowId}
        id={id}
        ref={this.containerRef}
        otherRef={this.containerRef}
        titleControls={<AnnotationSettings windowId={windowId} />}
      >
        <StyledSection sx={{
          borderBottomColor: 'section_divider',
          paddingBottom: 1,
          paddingLeft: 2,
          paddingRight: 1,
          paddingTop: 2,
        }}
        >
          <Typography component="p" variant="subtitle2">{t('showingNumAnnotations', { count: annotationCount, number: annotationCount })}</Typography>
        </StyledSection>

        {canvasIds.map((canvasId, index) => (
          <CanvasAnnotations
            canvasId={canvasId}
            containerRef={this.containerRef}
            key={canvasId}
            index={index}
            totalSize={canvasIds.length}
            windowId={windowId}
          />
        ))}
      </CompanionWindow>
    );
  }
}

WindowSideBarAnnotationsPanel.propTypes = {
  annotationCount: PropTypes.number.isRequired,
  canvasIds: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  t: PropTypes.func,
  windowId: PropTypes.string.isRequired,
};

WindowSideBarAnnotationsPanel.defaultProps = {
  canvasIds: [],
  t: key => key,
};
