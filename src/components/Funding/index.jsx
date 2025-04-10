import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { fundingPoa as FUNDING_POA } from '../../graphql/mutations';
import { Card, Col, Layout, Row, theme, Typography } from 'antd';

import PoaModal from './PoaModal';
import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import { PageHeader } from '../shared';

export const POA_SELF = 'self';
export const POA_EMAIL = 'email';

const { Content } = Layout;
const { Title } = Typography;

const Funding = () => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const { isLoggedIn, companyId } = useOutletContext();

  const [poaAuthorization, setPoaAuthorization] = useState();
  const [poaWidget, setPoaWidget] = useState();
  const [fundingRequestSrcDoc, setFundingRequestSrcDoc] = useState();

  const [fundingPoa, fundingPoaResponse] = useMutation(FUNDING_POA);

  const submitFundingPoa = async ({ email = '', requestWidget = false }) => {
    try {
      return await fundingPoa({
        variables: {
          requestWidget: requestWidget,
          requestEmail: email !== '',
          fundingEmailRecipient: email,
          currency: 'USD',
          agreementType: 'ACHDebit',
          companyId: parseInt(companyId),
        },
      });
    } catch (err) {
      console.error('Funding POA error:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchWidget = async () => {
      const widgetResponse = await submitFundingPoa({ requestWidget: true });
      const widget = widgetResponse?.data?.fundingPoa?.javaScript;
      setPoaWidget(widget);
    };
    if (companyId && isLoggedIn) {
      fetchWidget();
    }
  }, [fundingPoa, companyId, isLoggedIn]);

  useEffect(() => {
    if (poaWidget) {
      const script = `
        <script type="text/javascript">
          window.addEventListener('message', function(event) {
            if (event.origin === 'https://secure.na1.echosign.com' || event.origin === 'https://avalara.na1.echosign.com') {
              window.parent.postMessage(event.data, '${window.location.origin}');
            }
          });
        </script>
      `;

      const simpleHtmlDoc = `<!DOCTYPE html><html style="height: 100%"><head><meta charset="utf-8">${poaWidget}</head><body style="height: 100%; margin: 0">${script}</body></html>`;
      setFundingRequestSrcDoc(simpleHtmlDoc);
    }
  }, [poaWidget]);

  return (
    <>
      <PageHeader>
        <BreadcrumbMenu />
        <Content>
          <Row align="bottom">
            <Col lg={16}>
              <Title level={1}>Sign funding power of attorney</Title>
              <p>
                In order to act on your behalf with tax authorities, Avalara
                needs to have the funding power of attorney form completed and
                signed by an authorized representative of your business.
              </p>
            </Col>
          </Row>
        </Content>
      </PageHeader>
      <Content>
        <Layout>
          <Card>
            {fundingRequestSrcDoc &&
              poaAuthorization &&
              poaAuthorization === POA_SELF && (
                <iframe
                  title="Funding Power Of Attorney Form"
                  id="poaIframe"
                  srcDoc={fundingRequestSrcDoc}
                  style={{ height: '700px', width: '100%' }}
                />
              )}
          </Card>
          <PoaModal
            open={!poaAuthorization}
            setPoaAuthorization={setPoaAuthorization}
            sendPOAEmail={submitFundingPoa}
          />
        </Layout>
      </Content>
    </>
  );
};

export default Funding;
