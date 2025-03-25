import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SetUpRegionReturns from '../index';
import {
  suggestedTaxForms as SUGGESTED_TAX_FORMS,
  taxForms as TAX_FORMS,
} from '../../../graphql/queries';

const mockTaxFormsData = {
  taxForms: {
    value: [
      {
        taxFormCode: 'TEST-001',
        taxFormName: 'Test Form 1',
        description: 'Test Description 1',
        taxTypes: ['Sales Tax'],
        purpose: 'File sales tax returns for Washington state',
        taxAuthority: 'Washington Department of Revenue',
      },
      {
        taxFormCode: 'TEST-002',
        taxFormName: 'Test Form 2',
        description: 'Test Description 2',
        taxTypes: ['Use Tax'],
        purpose: 'File use tax returns for Washington state',
        taxAuthority: 'Washington State Tax Authority',
      },
    ],
  },
};

const mockSuggestedTaxFormsData = {
  companies: {
    value: [
      {
        suggestedTaxForms: [
          {
            suggestedReturns: [
              {
                taxFormCode: 'TEST-001',
              },
            ],
            onboardingQuestions: [
              {
                questionId: 1,
                question: 'Test Question 1',
                allowMultiSelect: false,
                helpText: '',
                answers: [
                  {
                    leadingQuestionAnswerId: 1,
                    answer: 'Answer 1',
                    answerHelpText: '',
                  },
                  {
                    leadingQuestionAnswerId: 2,
                    answer: 'Answer 2',
                    answerHelpText: '',
                  },
                ],
              },
            ],
            answeredQuestions: [
              {
                questionId: 1,
                onboardingQuestionAnswerId: 'answer-1',
                answerId: 1,
              },
            ],
          },
        ],
      },
    ],
  },
};

const mocks = [
  {
    request: {
      query: TAX_FORMS,
      variables: { country: 'US', region: 'WA' },
    },
    result: {
      data: mockTaxFormsData,
    },
  },
  {
    request: {
      query: SUGGESTED_TAX_FORMS,
      variables: { companyId: 123, country: 'US', region: 'WA' },
    },
    result: {
      data: mockSuggestedTaxFormsData,
    },
  },
];

const mockOutletContext = {
  accountId: '123',
  companyId: '123',
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useOutletContext: () => mockOutletContext,
  };
});

const renderComponent = (mocks = []) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter
        initialEntries={['/setup/Washington?countryCode=US&regionCode=WA']}
      >
        <Routes>
          <Route path="/setup/:region" element={<SetUpRegionReturns />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>,
    {
      wrapper: ({ children }) => <div>{children}</div>,
    }
  );

describe('SetUpRegionReturns page', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component heading', () => {
    renderComponent(mocks);
    expect(screen.getByText('Set up Washington returns')).toBeInTheDocument();
  });

  it('should display tax forms after loading', async () => {
    renderComponent(mocks);
    await waitFor(() => {
      expect(screen.getByText('Test Form 1')).toBeInTheDocument();
      expect(screen.getByText('Test Form 2')).toBeInTheDocument();
    });
  });

  it('should filter tax forms based on search text', async () => {
    renderComponent(mocks);
    await waitFor(() => {
      expect(screen.getByText('Test Form 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText(/Search by return name/i);
    fireEvent.change(searchInput, { target: { value: 'Test Form 1' } });

    expect(screen.getByText('Test Form 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Form 2')).not.toBeInTheDocument();
  });

  it('should show only recommended returns when toggle is switched', async () => {
    renderComponent(mocks);
    await waitFor(() => {
      expect(screen.getByText('Test Form 1')).toBeInTheDocument();
    });

    const recommendedSwitch = document.querySelector('.ant-switch');
    fireEvent.click(recommendedSwitch);

    expect(screen.getByText('Test Form 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Form 2')).not.toBeInTheDocument();
  });

  it('should display onboarding questions with existing answers', async () => {
    renderComponent(mocks);
    await waitFor(() => {
      expect(screen.getByText('Test Question 1')).toBeInTheDocument();
    });
    expect(screen.getByText('Answer 1')).toBeInTheDocument();
    expect(screen.getByText('Answer 2')).toBeInTheDocument();
  });

  it('should handle GraphQL errors gracefully', async () => {
    const errorMocks = [
      {
        request: {
          query: TAX_FORMS,
          variables: { country: 'US', region: 'WA' },
        },
        error: new Error('Failed to load tax forms'),
      },
    ];

    renderComponent(errorMocks);
    await waitFor(() => {
      expect(
        screen.getByText(/We are having a momentary issue/i)
      ).toBeInTheDocument();
    });
  });
});
