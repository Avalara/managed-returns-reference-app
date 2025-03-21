import PropTypes from 'prop-types';
import { Typography, Radio, Space, Tooltip, Checkbox } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const OnboardingQuestion = ({
  allowMultiSelect,
  helpText,
  question,
  answers,
  onAnswerSelect,
  selectedAnswerIds
}) => {
  const handleAnswerChange = (e) => {
    onAnswerSelect(e.target.value);
  };

  return (
    <Space direction="vertical">
      <div>
        <Text>{question}</Text>
        {helpText && (
          <Tooltip title={helpText}>
            <QuestionCircleOutlined style={{ marginLeft: '8px' }} />
          </Tooltip>
        )}
      </div>
      {allowMultiSelect ? (
        <Checkbox.Group
          value={selectedAnswerIds ? selectedAnswerIds : []}
        >
          <Space direction="vertical">
            {answers.map((answer, index) => (
              <Checkbox key={index} value={answer.leadingQuestionAnswerId} onChange={handleAnswerChange}>
                {answer.answer}
                {answer.answerHelpText && (
                  <Tooltip title={answer.answerHelpText}>
                    <QuestionCircleOutlined style={{ marginLeft: '8px' }} />
                  </Tooltip>
                )}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      ) : (
        <Radio.Group
          onChange={handleAnswerChange}
          value={selectedAnswerIds}
        >
          <Space direction="vertical">
            {answers.map((answer, index) => (
              <Radio
                key={index}
                value={answer.leadingQuestionAnswerId}
                role="radio"
                aria-checked={selectedAnswerIds === answer.leadingQuestionAnswerId}
              >
                {answer.answer}
                {answer.answerHelpText && (
                  <Tooltip title={answer.answerHelpText}>
                    <QuestionCircleOutlined style={{ marginLeft: '8px' }} />
                  </Tooltip>
                )}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      )}
    </Space>
  );
};

OnboardingQuestion.propTypes = {
  allowMultiSelect: PropTypes.bool.isRequired,
  helpText: PropTypes.string,
  question: PropTypes.string.isRequired,
  questionId: PropTypes.number.isRequired,
  answers: PropTypes.arrayOf(
    PropTypes.shape({
      answer: PropTypes.string.isRequired,
      answerHelpText: PropTypes.string,
      leadingQuestionAnswerId: PropTypes.number,
      nextQuestionId: PropTypes.number,
      taxFormCode: PropTypes.string
    })
  ).isRequired,
  onAnswerSelect: PropTypes.func.isRequired,
  selectedAnswerIds: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ])
};

export default OnboardingQuestion;