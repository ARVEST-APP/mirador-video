import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Chip from '@material-ui/core/Chip';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreSharp';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { MiradorMenuButton } from './MiradorMenuButton';
import { ScrollTo } from './ScrollTo';
import SanitizedHtml from '../containers/SanitizedHtml';

/**
 * CanvasAnnotations ~
*/
export class CanvasAnnotations extends Component {
  /**
   * constructor -
   */
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleAnnotationHover = this.handleAnnotationHover.bind(this);
    this.handleAnnotationBlur = this.handleAnnotationBlur.bind(this);
    this.handleOpenManifestSideToSide = this.handleOpenManifestSideToSide.bind(this);
    this.handleAccordion = this.handleAccordion.bind(this);
  }

  /**
   * Handle click event of an annotation.
  */
  handleClick(event, annotation) {
    const {
      deselectAnnotation, selectAnnotation, selectedAnnotationId, windowId,
    } = this.props;

    if (selectedAnnotationId === annotation.id) {
      deselectAnnotation(windowId, annotation.id);
    } else {
      selectAnnotation(windowId, annotation.id);
    }
  }

  /** */
  handleAnnotationHover(annotation) {
    const { hoverAnnotation, windowId } = this.props;

    hoverAnnotation(windowId, [annotation.id]);
  }

  /** */
  handleAnnotationBlur() {
    const { hoverAnnotation, windowId } = this.props;
    hoverAnnotation(windowId, []);
  }

  /** */
  handleOpenManifestSideToSide(e, manifestId) {
    const { addResource, addWindow } = this.props;
    addResource(manifestId);
    addWindow({ manifestId });
  }

  handleAccordion() {
    console.log("openAccordion");
  }

  /**
   * Returns the rendered component
  */
  render() {
    const {
      annotations, autoScroll, classes, index, label, selectedAnnotationId, t, totalSize,
      listContainerComponent, htmlSanitizationRuleSet, hoveredAnnotationIds,
      containerRef,
    } = this.props;
    if (annotations.length === 0) return null;

    /** */
    function searchManifest(text) {
      return text.match(
        /((http|https)\:\/\/[a-z0-9\/:%_+.,#?!@&=-]+)#manifest/g,
      );
    }

    annotations.forEach((annotation, i) => {
      // eslint-disable-next-line react/prop-types
      annotations[i].idIsManifest = !!searchManifest(annotation.id);
      // eslint-disable-next-line react/prop-types
      annotations[i].manifestsInContent = searchManifest(annotation.content);
    });

    console.log(annotations);
    return (
      <>
        <Typography className={classes.sectionHeading} variant="overline">
          {t('annotationCanvasLabel', { context: `${index + 1}/${totalSize}`, label })}
        </Typography>
        <MenuList autoFocusItem variant="selectedMenu">
          {
            annotations.map(annotation => (
              <ScrollTo
                containerRef={containerRef}
                key={`${annotation.id}-scroll`}
                offsetTop={96} // offset for the height of the form above
                scrollTo={autoScroll ? (selectedAnnotationId === annotation.id) : false}
              >
                <MenuItem
                  button
                  component={listContainerComponent}
                  className={clsx(
                    classes.annotationListItem,
                    {
                      [classes.hovered]: hoveredAnnotationIds.includes(annotation.id),
                    },
                  )}
                  key={annotation.id}
                  annotationid={annotation.id}
                  selected={selectedAnnotationId === annotation.id}
                  onClick={e => this.handleClick(e, annotation)}
                  onFocus={() => this.handleAnnotationHover(annotation)}
                  onBlur={this.handleAnnotationBlur}
                  onMouseEnter={() => this.handleAnnotationHover(annotation)}
                  onMouseLeave={this.handleAnnotationBlur}
                >
                  <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                    <SanitizedHtml
                      ruleSet={htmlSanitizationRuleSet}
                      htmlString={annotation.content}
                    />
                    <div>
                      {
                        annotation.tags.map(tag => (
                          <Chip size="small" variant="outlined" label={tag} id={tag} className={classes.chip} key={tag.toString()} />
                        ))
                      }
                    </div>

                  </ListItemText>

                </MenuItem>

              </ScrollTo>
            ))
          }
        </MenuList>
      </>
    );
  }
}

CanvasAnnotations.propTypes = {
  addResource: PropTypes.func.isRequired,
  addWindow: PropTypes.func.isRequired,
  annotations: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }),
  ),
  autoScroll: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.string),
  containerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  deselectAnnotation: PropTypes.func.isRequired,
  hoverAnnotation: PropTypes.func.isRequired,
  hoveredAnnotationIds: PropTypes.arrayOf(PropTypes.string),
  htmlSanitizationRuleSet: PropTypes.string,
  index: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  listContainerComponent: PropTypes.elementType,
  selectAnnotation: PropTypes.func.isRequired,
  selectedAnnotationId: PropTypes.string,
  t: PropTypes.func.isRequired,
  totalSize: PropTypes.number.isRequired,
  windowId: PropTypes.string.isRequired,
};
CanvasAnnotations.defaultProps = {
  annotations: [],
  autoScroll: true,
  classes: {},
  containerRef: undefined,
  hoveredAnnotationIds: [],
  htmlSanitizationRuleSet: 'iiif',
  listContainerComponent: 'li',
  selectedAnnotationId: undefined,
};
