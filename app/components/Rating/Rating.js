import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import orange from '@material-ui/core/colors/orange';
import grey from '@material-ui/core/colors/grey';
import ToggleStar from '@material-ui/icons/Star';
import ToggleStarBorder from '@material-ui/icons/StarBorder';

const styles = {
  disabled: {
    pointerEvents: 'none'
  },
  icon: {
    padding: 0
  }
};

function Rating(props) {
  const {
    classes,
    value,
    iconHoveredRenderer,
    iconFilledRenderer,
    iconNormal,
    disabled,
    iconFilled,
    iconHovered,
    tooltip,
    tooltipRenderer,
    tooltipPosition,
    tooltipStyles,
    iconNormalRenderer,
    itemStyle,
    itemIconStyle,
    max,
    onChange,
    readOnly,
    style,
    ...other
  } = props;
  const [hoverValue, setHoverValue] = useState(value);

  const renderIcon = (i) => {
    const filled = i <= value;
    const hovered = i <= hoverValue;

    if ((hovered && !filled) || (!hovered && filled)) {
      return iconHoveredRenderer ? iconHoveredRenderer({
        ...props,
        index: i
      }) : iconHovered;
    }
    if (filled) {
      return iconFilledRenderer ? iconFilledRenderer({
        ...props,
        index: i
      }) : iconFilled;
    }
    return iconNormalRenderer ? iconNormalRenderer({
      ...props,
      index: i
    }) : iconNormal;
  };

  const rating = [];

  for (let i = 1; i <= max; i += 1) {
    rating.push(
      <IconButton
        key={i}
        className={classes.icon}
        disabled={disabled}
        onMouseEnter={() => setHoverValue(i)}
        onMouseLeave={() => setHoverValue(value)}
        onClick={() => {
          if (!readOnly && onChange) {
            onChange(i);
          }
        }}
      >
        {renderIcon(i)}
      </IconButton>
    );
  }

  return (
    <div
      style={disabled || readOnly ? { ...styles.disabled, ...style } : style}
      {...other}
    >
      {rating}
    </div>
  );
}

Rating.propTypes = {
  disabled: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  iconFilled: PropTypes.node,
  iconHovered: PropTypes.node,
  iconNormal: PropTypes.node,
  tooltip: PropTypes.node,
  tooltipRenderer: PropTypes.func,
  tooltipPosition: PropTypes.string,
  tooltipStyles: PropTypes.object,
  iconFilledRenderer: PropTypes.func,
  iconHoveredRenderer: PropTypes.func,
  iconNormalRenderer: PropTypes.func,
  itemStyle: PropTypes.object,
  itemIconStyle: PropTypes.object,
  max: PropTypes.number,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  style: PropTypes.object,
  value: PropTypes.number
};

Rating.defaultProps = {
  disabled: false,
  iconFilled: <ToggleStar style={{ color: orange[500] }} />,
  iconHovered: <ToggleStarBorder style={{ color: orange[500] }} />,
  iconNormal: <ToggleStarBorder style={{ color: grey[300] }} />,
  tooltipPosition: 'bottom-center',
  max: 5,
  readOnly: false,
  value: 0,
  tooltip: null,
  tooltipRenderer: () => { },
  tooltipStyles: null,
  iconFilledRenderer: undefined,
  iconHoveredRenderer: undefined,
  iconNormalRenderer: undefined,
  itemStyle: undefined,
  itemIconStyle: undefined,
  onChange: () => { },
  style: null,
};

export default withStyles(styles)(Rating);
