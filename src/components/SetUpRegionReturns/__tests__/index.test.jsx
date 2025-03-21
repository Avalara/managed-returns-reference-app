import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ConfigProvider, theme } from 'antd';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, afterEach } from 'vitest';
import SetUpRegionReturns from '../index';
import { suggestedReturns as SUGGESTED_RETURNS_QUERY } from '../../../graphql/queries/SuggestedReturns';
import { onboardingQuestionAnswer } from '../../../graphql/mutations/OnboardingQuestionAnswer';
import * as reactRouterDom from 'react-router-dom';

// Mock data
const mockSuggestedReturns = [
  {
    description: 'Description 1',
    taxAuthorityId: 111,
    taxFormCode: 'TaxFormCode 1',
    taxAuthorityName: 'TaxAuthorityName 1',
    taxFormName: 'TaxFormName 1',
    taxTypes: ['Tax Type 1', 'Tax Type 2'],
    recommended: true,
    purpose: 'Purpose 1',
  },
  {
    description: 'Description 2',
    taxAuthorityId: 114,
    taxFormCode: 'TaxFormCode 2',
    taxAuthorityName: 'TaxAuthorityName 2',
    taxFormName: 'TaxFormName 2',
    taxTypes: ['Tax Type 3', 'Tax Type 4'],
    recommended: false,
    purpose: 'Purpose 2',
  },
];

const mockOnboardingQuestions = [
  {
    allowMultiSelect: false,
    country: 'US',
    dataType: 'BOOLEAN',
    helpText: 'Help Text 1',
    question: 'Question 1',
    questionId: 3,
    region: 'AK',
    sequence: 1,
    standard: false,
    answers: [
      {
        answer: 'Answer 1',
        answerHelpText: 'Answer Help Text 1',
        leadingQuestionAnswerId: null,
        nextQuestionId: null,
        taxFormCode: '["TaxFormCode1"]',
      },
      {
        answer: 'Answer 2',
        answerHelpText: 'Answer Help Text 2',
        leadingQuestionAnswerId: null,
        nextQuestionId: null,
        taxFormCode: '["TaxFormCode2"]',
      },
    ],
  },
];

// Mock GraphQL responses
const defaultMocks = [
  {
    request: {
      query: SUGGESTED_RETURNS_QUERY,
      variables: { companyId: 123 },
    },
    result: {
      data: {
        companies: {
          value: [
            {
              suggestedReturns: [
                {
                  suggestedReturns: mockSuggestedReturns,
                  onboardingQuestions: mockOnboardingQuestions,
                },
              ],
            },
          ],
        },
      },
    },
  },
  // {
  //   request: {
  //     query: onboardingQuestionAnswer,
  //     variables: {
  //       accountId: 123,
  //       companyId: 123,
  //       country: "US",
  //       region: "AK",
  //       questionId: 3,
  //       answerId: 1,
  //       operation: "CREATE"
  //     }
  //   },
  //   result: {
  //     data: {
  //       onboardingQuestionAnswer: {
  //         success: true
  //       }
  //     }
  //   }
  // }
];

// Mock context values
const mockOutletContext = {
  accountId: '123',
  companyId: '123',
};

// Mock useOutletContext hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useOutletContext: () => mockOutletContext,
  };
});

const renderComponent = (mocks = null) =>
  render(
    <MockedProvider mocks={mocks ? mocks : defaultMocks}>
      <ConfigProvider>
        <MemoryRouter initialEntries={['/setup/Arkansas']}>
          <Routes>
            <Route path="/setup/:region" element={<SetUpRegionReturns />} />
          </Routes>
        </MemoryRouter>
      </ConfigProvider>
    </MockedProvider>
  );

describe('SetUpRegionReturns page', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component heading', () => {
    renderComponent();
    expect(screen.getByText(/Set up Arkansas returns/i)).toBeInTheDocument();
  });

  it('should display returns after loading', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });
  });

  it('should filter returns based on search text', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Description 1')).toBeInTheDocument();
    });

    // Find the search input using a more specific selector
    const searchInput = document.querySelector('.ant-input');
    fireEvent.change(searchInput, { target: { value: 'Description 1' } });

    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.queryByText('Description 2')).not.toBeInTheDocument();
  });

  it('should filter recommended returns when toggle is switched', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Description 1')).toBeInTheDocument();
    });

    const recommendedSwitch = document.querySelector('.ant-switch');
    fireEvent.click(recommendedSwitch);

    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.queryByText('Description 2')).not.toBeInTheDocument();
  });

  it('should display onboarding questions', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Question 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Answer 1')).toBeInTheDocument();
    expect(screen.getByText('Answer 2')).toBeInTheDocument();
  });

  it('should handle GraphQL errors gracefully', async () => {
    const errorMock = {
      request: {
        query: SUGGESTED_RETURNS_QUERY,
        variables: { companyId: 123 },
      },
      error: new Error('An error occurred'),
    };

    renderComponent([errorMock]);

    await waitFor(() => {
      expect(
        screen.getByText(/We are having a momentary issue/i)
      ).toBeInTheDocument();
    });
  });
});
