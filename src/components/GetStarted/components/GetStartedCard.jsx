import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';

const GetStartedCard = ({
  title,
  description,
  statusTag,
  actionButtons,
  loading = false,
}) => (
  <Card
    loading={loading}
    title={title}
    extra={statusTag}
    style={{
      flex: '1 0 320px',
      display: 'flex',
      flexDirection: 'column',
    }}
    styles={{
      body: {
        flex: '1 1 auto', // This makes the body take remaining space
        display: 'flex',
        flexDirection: 'column',
      },
    }}
    actions={actionButtons}
  >
    <p>{description}</p>
  </Card>
);

GetStartedCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  statusTag: PropTypes.node,
  actionButtons: PropTypes.array,
  loading: PropTypes.bool,
};

export default GetStartedCard;
