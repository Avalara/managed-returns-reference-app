import {
  Card,
  Col,
  Layout,
  Row,
  Space,
  Switch,
  theme,
  Result,
  message,
  Typography,
  Empty,
} from 'antd';
import { useState, useMemo } from 'react';
import { useQuery, useMutation, NetworkStatus } from '@apollo/client';
import {
  suggestedTaxForms as SUGGESTED_TAX_FORMS,
  taxForms as TAX_FORMS,
} from '../../graphql/queries';
import {
  createOnboardingQuestionAnswer as CREATE_ONBOARDING__QUESTION_ANSWER,
  updateOnboardingQuestionAnswer as UPDATE_ONBOARDING_QUESTION_ANSWER,
} from '../../graphql/mutations/';

import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import TaxFormsTable from './TaxFormsTable';
import OnboardingQuestion from './OnboardingQuestion';
import { useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import Search from 'antd/es/input/Search.js';
import FormItem from 'antd/es/form/FormItem/index.js';
import { PageHeader } from '../shared';

const { Content } = Layout;
const { Title } = Typography;

const SetUpRegionReturns = () => {
  const { accountId, companyId } = useOutletContext();
  const { region } = useParams();
  const [searchParams] = useSearchParams();
  const countryCode = searchParams.get('countryCode');
  const regionCode = searchParams.get('regionCode');
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const [searchText, setSearchText] = useState('');
  const [showRecommended, setShowRecommended] = useState(false);

  // Create/Update onboarding answer
  const [createAnswer, { loading: createLoading }] = useMutation(
    CREATE_ONBOARDING__QUESTION_ANSWER,
    {
      variables: {
        accountId: parseInt(accountId),
        companyId: parseInt(companyId),
        country: countryCode,
        region: regionCode,
      },
    }
  );

  const [updateAnswer, { loading: updateLoading }] = useMutation(
    UPDATE_ONBOARDING_QUESTION_ANSWER,
    {
      variables: {
        accountId: parseInt(accountId),
        companyId: parseInt(companyId),
        country: countryCode,
        region: regionCode,
      },
    }
  );

  // Get all tax forms
  const {
    data: taxFormsData,
    loading: taxFormsLoading,
    error: taxFormsError,
  } = useQuery(TAX_FORMS, {
    variables: { country: countryCode, region: regionCode },
  });
  // Get suggested/recommended tax forms, onboarding questions and onboarding answers
  const {
    data: suggestedTaxFormsData,
    loading: suggestedTaxFormsLoading,
    error: suggestedTaxFormsError,
    refetch: refetchSuggestedTaxForms,
    networkStatus: suggestedTaxFormsRefetchStatus,
  } = useQuery(SUGGESTED_TAX_FORMS, {
    variables: {
      companyId: parseInt(companyId),
      country: countryCode,
      region: regionCode,
    },
    notifyOnNetworkStatusChange: true,
  });

  // Extract suggested returns, onboarding questions and onboarding answers
  const returns = taxFormsData?.taxForms;
  const suggestedTaxForms =
    suggestedTaxFormsData?.companies?.value?.[0]?.suggestedTaxForms?.[0]
      ?.suggestedReturns || [];
  const onboardingQuestions =
    suggestedTaxFormsData?.companies?.value?.[0]?.suggestedTaxForms?.[0]
      ?.onboardingQuestions || [];
  const onboardingAnswers =
    suggestedTaxFormsData?.companies?.value?.[0]?.suggestedTaxForms?.[0]
      ?.answeredQuestions || [];

  const formattedTaxFormsData = useMemo(() => {
    if (!returns) return [];

    return returns.value
      .map((r) => {
        // Check if this tax form is in the suggestedTaxForms array
        const isRecommended = suggestedTaxForms.some(
          (suggestedReturn) => suggestedReturn.taxFormCode === r.taxFormCode
        );

        // Return the tax form with the recommended property added
        return {
          ...r,
          recommended: isRecommended,
        };
      })
      .sort((a, b) => {
        // Sort by recommended status (recommended items first)
        if (a.recommended && !b.recommended) return -1;
        if (!a.recommended && b.recommended) return 1;
        return 0;
      });
  }, [taxFormsData, suggestedTaxForms]);

  const handleAnswerSelect = (question, answerValue) => {
    // Check if this question already has an answer
    const existingAnswer = onboardingAnswers.find(
      (answer) => answer.questionId === question.questionId
    );

    if (existingAnswer) {
      // Update existing answer
      updateAnswer({
        variables: {
          onboardingQuestionAnswerId: existingAnswer.onboardingQuestionAnswerId,
          questionId: question.questionId,
          answerId: answerValue || 0,
        },
      })
        .catch(() => {
          message.error(
            'Unable to update answer. Please try again or contact support if the problem persists.'
          );
        })
        .finally(() => {
          refetchSuggestedTaxForms();
        });
    } else {
      // Create new answer
      createAnswer({
        variables: {
          questionId: question.questionId,
          answerId: answerValue || 0,
        },
      })
        .catch(() => {
          message.error(
            'Unable to submit answer. Please try again or contact support if the problem persists.'
          );
        })
        .finally(() => {
          refetchSuggestedTaxForms();
        });
    }
  };

  const filteredReturns = useMemo(() => {
    const searchLower = searchText.toLowerCase();
    return formattedTaxFormsData.filter((item) => {
      const matchesSearch =
        !searchText ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.taxFormCode?.toLowerCase().includes(searchLower) ||
        item.taxFormName?.toLowerCase().includes(searchLower) ||
        item.taxTypes?.some((type) => type.toLowerCase().includes(searchLower));

      if (showRecommended) {
        return matchesSearch && item.recommended === true;
      }
      return matchesSearch;
    });
  }, [searchText, showRecommended, formattedTaxFormsData]);

  if (taxFormsError) {
    return (
      <Result
        status="500"
        subTitle="We are having a momentary issue, please try again in some time."
      />
    );
  }

  if (suggestedTaxFormsError) {
    message.error({
      content:
        'Unable to load suggested returns. Please refresh the page or try again later.',
      duration: 5,
    });
  }

  return (
    <>
      <PageHeader>
        <BreadcrumbMenu />
        <Content>
          <Row>
            <Col lg={16}>
              <Title level={1}>Set up {region} returns</Title>
              <p>
                Returns are recommended based on the tax you collect and
                information you provide about your business. Use the Improve
                your recommendations panel if you need help finding the right
                returns.
              </p>
            </Col>
          </Row>
        </Content>
      </PageHeader>
      <Content>
        <Layout>
          <Row
            gutter={{
              xs: 8,
              sm: 16,
              md: 24,
              lg: 32,
            }}
          >
            <Col className="gutter-row" span={16}>
              <Row gutter={[16, 24]}>
                <Col className="gutter-row" span={24}>
                  <Card>
                    <Space align="center">
                      <FormItem
                        layout="vertical"
                        label="Search by return name, form number, or tax type"
                        name="searchText"
                      >
                        <Search
                          allowClear
                          style={{
                            width: 300,
                          }}
                          onChange={(e) => setSearchText(e.target.value)}
                          value={searchText}
                        />
                      </FormItem>
                      <div>
                        <Switch
                          checked={showRecommended}
                          onChange={setShowRecommended}
                        />
                        {'  '}
                        <span>Show recommended returns</span>
                      </div>
                    </Space>
                  </Card>
                </Col>
                <Col className="gutter-row" span={24}>
                  <Card>
                    <TaxFormsTable
                      dataSource={filteredReturns}
                      loading={
                        suggestedTaxFormsLoading ||
                        taxFormsLoading ||
                        suggestedTaxFormsRefetchStatus === NetworkStatus.refetch
                      }
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col className="gutter-row" span={8}>
              <Card
                title="Improve your recommendations"
                style={{ height: '100%' }}
              >
                <Row gutter={[16, 24]}>
                  {!suggestedTaxFormsLoading &&
                    suggestedTaxFormsRefetchStatus !== NetworkStatus.refetch &&
                    (!onboardingQuestions ||
                      onboardingQuestions?.length === 0) && (
                      <Empty
                        style={{ margin: 'auto' }}
                        description="No onboarding questions available at this time."
                      ></Empty>
                    )}
                  {onboardingQuestions.map((question) => (
                    <Col
                      key={question.questionId}
                      className="gutter-row"
                      span={24}
                    >
                      <OnboardingQuestion
                        {...question}
                        onAnswerSelect={(answerValue) =>
                          handleAnswerSelect(question, answerValue)
                        }
                        selectedAnswerIds={onboardingAnswers
                          .filter(
                            (answer) =>
                              answer.questionId === question.questionId
                          )
                          .map((answer) => answer.answerId)}
                        disabled={
                          createLoading ||
                          updateLoading ||
                          suggestedTaxFormsRefetchStatus ===
                            NetworkStatus.refetch
                        }
                      />
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>
        </Layout>
      </Content>
    </>
  );
};

export default SetUpRegionReturns;
