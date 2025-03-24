import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OnboardingQuestion from '../OnboardingQuestion';

// Mock props for testing
const singleSelectProps = {
  allowMultiSelect: false,
  helpText: 'Help Text 1',
  question: 'Question 1',
  questionId: 1,
  answers: [
    {
      answer: 'Answer 1',
      answerHelpText: 'Answer Help Text 1',
      leadingQuestionAnswerId: 1,
      nextQuestionId: null,
      taxFormCode: '["TaxFormCode1"]',
    },
    {
      answer: 'Answer 2',
      answerHelpText: null,
      leadingQuestionAnswerId: 2,
      nextQuestionId: null,
      taxFormCode: '["TaxFormCode2"]',
    },
  ],
  onAnswerSelect: vi.fn(),
  selectedAnswerIds: null,
};

const multiSelectProps = {
  // ...singleSelectProps,
  allowMultiSelect: true,
  helpText: 'Help Text 2',
  question: 'Question 2',
  questionId: 2,
  answers: [
    {
      answer: 'Answer 3',
      answerHelpText: 'Answer Help Text 3',
      leadingQuestionAnswerId: 3,
      nextQuestionId: null,
      taxFormCode: '["TaxFormCode3"]',
    },
    {
      answer: 'Answer 4',
      answerHelpText: 'Answer Help Text 4',
      leadingQuestionAnswerId: 4,
      nextQuestionId: null,
      taxFormCode: '["TaxFormCode4"]',
    },
  ],
  selectedAnswerIds: [],
  onAnswerSelect: vi.fn(),
};

describe('OnboardingQuestion', () => {
  it('should render single select question', () => {
    render(<OnboardingQuestion {...singleSelectProps} />);

    // Check if question text is rendered
    expect(screen.getByText('Question 1')).toBeInTheDocument();

    // Check if help icons are rendered
    const helpIcons = document.querySelectorAll('.anticon-question-circle');
    expect(helpIcons.length).toBeGreaterThan(0);

    // Check if answers are rendered
    expect(screen.getByText('Answer 1')).toBeInTheDocument();
    expect(screen.getByText('Answer 2')).toBeInTheDocument();

    // Check if radio buttons are rendered
    const radioInputs = document.querySelectorAll(
      '.ant-radio input[type="radio"]'
    );
    expect(radioInputs.length).toBe(2);
  });

  it('should render multi select question', () => {
    render(<OnboardingQuestion {...multiSelectProps} />);

    // Check if question text is rendered
    expect(screen.getByText('Question 2')).toBeInTheDocument();

    // Check if answers are rendered
    expect(screen.getByText('Answer 3')).toBeInTheDocument();
    expect(screen.getByText('Answer 4')).toBeInTheDocument();

    // Check if checkboxes are rendered - using input elements instead of role
    const checkboxInputs = document.querySelectorAll(
      '.ant-checkbox input[type="checkbox"]'
    );
    expect(checkboxInputs.length).toBe(2);
  });

  it('should call onAnswerSelect when a radio option is selected', () => {
    const onAnswerSelect = vi.fn();
    render(
      <OnboardingQuestion
        {...singleSelectProps}
        onAnswerSelect={onAnswerSelect}
      />
    );

    // Click on the first radio button label
    const radioLabel = screen.getByText('Answer 1');
    fireEvent.click(radioLabel);

    // Check if onAnswerSelect was called
    expect(onAnswerSelect).toHaveBeenCalledWith(1);
  });

  it('should call onAnswerSelect when a checkbox option is selected', () => {
    const onAnswerSelect = vi.fn();
    render(
      <OnboardingQuestion
        {...multiSelectProps}
        onAnswerSelect={onAnswerSelect}
      />
    );

    // Click on the first checkbox label
    const checkboxLabel = screen.getByText('Answer 3');
    fireEvent.click(checkboxLabel);

    // Check if onAnswerSelect was called
    expect(onAnswerSelect).toHaveBeenCalledWith(3);
  });

  it('should display tooltips for help text', () => {
    render(<OnboardingQuestion {...singleSelectProps} />);

    // Check for question help icon
    const helpIcons = document.querySelectorAll('.anticon-question-circle');
    expect(helpIcons.length).toBe(2); // One for question, one for first answer
  });

  it('should render with pre-selected value for single select', () => {
    render(
      <OnboardingQuestion {...singleSelectProps} selectedAnswerIds={[1]} />
    );

    // Check if the radio with value 1 is selected using class
    const selectedRadio = document.querySelector('.ant-radio-checked');
    expect(selectedRadio).not.toBeNull();
  });

  it('should render with pre-selected values for multi select', () => {
    render(
      <OnboardingQuestion {...multiSelectProps} selectedAnswerIds={[3]} />
    );

    // Check if the checkbox with value 1 is selected using class
    const selectedCheckbox = document.querySelector('.ant-checkbox-checked');
    expect(selectedCheckbox).not.toBeNull();
  });
});
