import {Card, Col, Layout, Row, Space, Switch, theme, Result} from 'antd';
import {useState, useMemo} from 'react';
import {useQuery, useMutation} from '@apollo/client';
import {suggestedReturns as SUGGESTED_RETURNS_QUERY} from '../../graphql/queries/SuggestedReturns';
import {onboardingQuestionAnswer} from '../../graphql/mutations/OnboardingQuestionAnswer';

import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import TaxFormsTable from './TaxFormsTable';
import Search from "antd/es/input/Search.js";
import OnboardingQuestion from "./OnboardingQuestion.jsx";
import FormItem from "antd/es/form/FormItem/index.js";
import {useOutletContext, useParams} from "react-router-dom";

const {Content} = Layout;

const SetUpRegionReturns = () => {
  const {accountId, companyId} = useOutletContext();
  const {region} = useParams();
  const {
    token: {borderRadiusLG},
  } = theme.useToken();
  const [searchText, setSearchText] = useState('');
  const [showRecommended, setShowRecommended] = useState(false);

  const [submitAnswer] = useMutation(onboardingQuestionAnswer);

  const handleAnswerSelect = (question, answerValue) => {
    submitAnswer({
      variables: {
        accountId: parseInt(parseInt(accountId)),
        companyId: parseInt(parseInt(companyId)),
        country: question.country,
        region: question.region,
        questionId: question.questionId,
        answerId: answerValue || 0,
        operation: "CREATE"
      }
    }).catch(err => console.error("Error submitting answer:", err));
  };

  const {loading, error, data} = useQuery(SUGGESTED_RETURNS_QUERY, {
    variables: {companyId: parseInt(companyId)},
  });

  // TODO: remove hardcodings
  const suggestedReturns = data?.companies?.value?.[0]?.suggestedReturns?.[0]?.suggestedReturns || [];
  const onboardingQuestions = data?.companies?.value?.[0]?.suggestedReturns?.[0]?.onboardingQuestions || [];

  const filteredReturns = useMemo(() => {
    const searchLower = searchText.toLowerCase();
    return suggestedReturns.filter(item => {
      const matchesSearch = !searchText || (
        item.description?.toLowerCase().includes(searchLower) ||
        item.taxFormCode?.toLowerCase().includes(searchLower) ||
        item.taxFormName?.toLowerCase().includes(searchLower) ||
        item.taxTypes?.some(type => type.toLowerCase().includes(searchLower))
      );

      if (showRecommended) {
        return matchesSearch && item.recommended === true;
      }
      return matchesSearch;
    });
  }, [searchText, showRecommended, suggestedReturns]);

  if (error) {
    return <Result
      status="500"
      subTitle="We are having a momentary issue, please try again in some time."
    />;
  }

  return (
    <>
      <div
        style={{
          marginLeft: '-24px',
          padding: '24px',
        }}
      >
        <BreadcrumbMenu/>
        <Content>
          <h1>Set up {region} returns</h1>
          <p>Returns are recommended based on the tax you collect and information you provide about your business. Use
            the Improve your recommendations panel if you need help finding the right returns.</p>
        </Content>
      </div>
      <Content
        style={{
          margin: 0,
          minHeight: 280,
          borderRadius: borderRadiusLG,
        }}
      >
        <Layout>
          <Row gutter={{
            xs: 8,
            sm: 16,
            md: 24,
            lg: 32,
          }}>
            <Col className="gutter-row" span={16}>
              <Row gutter={[16, 24]}>
                <Col className="gutter-row" span={24}>
                  <Card>
                    <Space align="center">
                      <FormItem layout="vertical"
                                label="Search by return name, form number, or tax type"
                                name="searchText">
                        <Search
                          allowClear
                          style={{
                            width: 300,
                          }}
                          onChange={e => setSearchText(e.target.value)}
                          value={searchText}
                        />
                      </FormItem>
                      <div>
                        <Switch checked={showRecommended} onChange={setShowRecommended}/>
                        {'  '}<span>Show recommended returns</span>
                      </div>
                    </Space>
                  </Card>
                </Col>
                <Col className="gutter-row" span={24}>
                  <Card>
                  <TaxFormsTable
                    dataSource={filteredReturns}
                    loading={loading}
                  />
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col className="gutter-row" span={8}>
              <Card title="Improve your reccomendations" style={{height: '70vh'}}>
                <Row gutter={[16, 24]}>
                  {onboardingQuestions.map(question => (
                    <Col key={question.questionId} className="gutter-row" span={24}>
                      <OnboardingQuestion
                        {...question}
                        onAnswerSelect={(answerValue) => handleAnswerSelect(question, answerValue)}
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