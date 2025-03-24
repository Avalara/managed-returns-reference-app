import PropTypes from 'prop-types';
import { Typography, Radio, Space, Checkbox } from 'antd';
import { CustomTooltip } from '../shared';

const { Text } = Typography;

const OnboardingQuestion = ({
  allowMultiSelect,
  helpText,
  question,
  answers,
  onAnswerSelect,
  selectedAnswerIds,
  disabled = false,
}) => {
  const handleAnswerChange = (e) => {
    onAnswerSelect(e.target.value);
  };

  return (
    <Space direction="vertical">
      <div>
        <Text>{question}</Text> {helpText && <CustomTooltip title={helpText} />}
      </div>
      {allowMultiSelect ? (
        <Checkbox.Group
          value={selectedAnswerIds ? selectedAnswerIds : []}
          disabled={disabled}
        >
          <Space direction="vertical">
            {answers.map((answer, index) => (
              <Checkbox
                key={index}
                value={answer.leadingQuestionAnswerId}
                onChange={handleAnswerChange}
                disabled={disabled}
              >
                {answer.answer}{' '}
                {answer.answerHelpText && (
                  <CustomTooltip title={answer.answerHelpText} />
                )}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      ) : (
        <Radio.Group
          onChange={handleAnswerChange}
          value={selectedAnswerIds ? selectedAnswerIds[0] : ''}
          disabled={disabled}
        >
          <Space direction="vertical">
            {answers.map((answer, index) => (
              <Radio
                key={index}
                value={answer.leadingQuestionAnswerId}
                role="radio"
                disabled={disabled}
              >
                {answer.answer}{' '}
                {answer.answerHelpText && (
                  <CustomTooltip title={answer.answerHelpText} />
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
  answers: PropTypes.arrayOf(
    PropTypes.shape({
      answer: PropTypes.string.isRequired,
      answerHelpText: PropTypes.string,
      leadingQuestionAnswerId: PropTypes.number,
      nextQuestionId: PropTypes.number,
      taxFormCode: PropTypes.string,
    })
  ).isRequired,
  onAnswerSelect: PropTypes.func.isRequired,
  selectedAnswerIds: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]),
  disabled: PropTypes.bool,
};

export default OnboardingQuestion;
