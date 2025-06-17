import React from 'react';
import PropTypes from 'prop-types';
import { Form, Radio, Input } from 'antd';
import { CustomTooltip } from '../shared/index.js';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const ReturnQuestion = ({
  dataType,
  question,
  filingQuestionId,
  filingQuestionCode,
  destination,
  value,
  onChange,
  required = false,
  helpText,
  regex,
  regexErrorMessage = 'The input format is invalid',
  hasFeedback = false,
  validateStatus,
  statusText,
}) => {
  // Create label with optional tooltip if helpText is provided
  const labelWithHelp = (
    <span>
      {question}{' '}
      {helpText && (
        <CustomTooltip title={helpText} dangerouslySetInnerHTML={true} />
      )}
    </span>
  );

  // Create validation rules
  const createRules = () => {
    const rules = [];

    if (required) {
      rules.push({
        required: true,
        message: `Please answer this question`,
      });
    }

    if (regex && dataType === 'STRING') {
      rules.push({
        pattern: new RegExp(regex),
        message: regexErrorMessage,
      });
    }

    return rules;
  };

  if (dataType === 'BOOLEAN') {
    return (
      <Form.Item
        label={labelWithHelp}
        name={filingQuestionCode}
        rules={createRules()}
        help={statusText}
        hasFeedback={hasFeedback}
        validateStatus={validateStatus}
      >
        <Radio.Group
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
        >
          <Radio value={true}>Yes</Radio>
          <Radio value={false}>No</Radio>
        </Radio.Group>
      </Form.Item>
    );
  } else if (dataType === 'STRING') {
    return (
      <Form.Item
        label={labelWithHelp}
        name={filingQuestionCode}
        rules={createRules()}
        help={statusText}
        hasFeedback={hasFeedback}
        validateStatus={validateStatus}
      >
        <Input
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder="Enter your answer"
        />
      </Form.Item>
    );
  } else if (dataType === 'PASSWORD') {
    return (
      <Form.Item
        label={labelWithHelp}
        name={filingQuestionCode}
        rules={createRules()}
        help={statusText}
        hasFeedback={hasFeedback}
        validateStatus={validateStatus}
      >
        <Input.Password
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder="Enter your password"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>
    );
  }

  // For other data types, return null for now
  return null;
};

ReturnQuestion.propTypes = {
  dataType: PropTypes.string,
  question: PropTypes.string,
  filingQuestionId: PropTypes.number,
  destination: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  helpText: PropTypes.string,
  regex: PropTypes.string,
  regexErrorMessage: PropTypes.string,
  hasFeedback: PropTypes.bool,
  validateStatus: PropTypes.string,
};

export default ReturnQuestion;
