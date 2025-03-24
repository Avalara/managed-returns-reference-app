import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

/**
 * A reusable Tooltip component that displays help text with consistent styling
 *
 * @param {Object} props - Component props
 * @param {string|React.ReactNode} props.title - Content to display in the tooltip
 * @param {boolean} props.dangerouslySetInnerHTML - Whether to render content as HTML
 * @param {React.ReactNode} props.icon - Custom icon to use (defaults to InfoCircleTwoTone)
 * @param {Object} props.overlayStyle - Additional styles for the tooltip overlay (deprecated)
 * @param {Object} props.tooltipProps - Additional props to pass to the Ant Design Tooltip component
 * @returns {React.ReactElement} The CustomTooltip component
 */
const CustomTooltip = ({
  title,
  dangerouslySetInnerHTML = false,
  icon = <QuestionCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />,
  overlayStyle = {},
  tooltipProps = {},
}) => {
  // Prepare content based on whether it should be rendered as HTML
  const tooltipTitle = dangerouslySetInnerHTML ? (
    <div dangerouslySetInnerHTML={{ __html: title }} />
  ) : (
    title
  );

  // Use the new styles API instead of overlayStyle
  const styles = {
    root: {
      maxWidth: '400px',
      ...overlayStyle,
    },
  };

  return (
    <Tooltip title={tooltipTitle} styles={styles} {...tooltipProps}>
      {icon}
    </Tooltip>
  );
};

CustomTooltip.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  dangerouslySetInnerHTML: PropTypes.bool,
  icon: PropTypes.node,
  overlayStyle: PropTypes.object,
  tooltipProps: PropTypes.object,
};

export default CustomTooltip;
