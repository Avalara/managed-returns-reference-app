import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Card, Layout, Row, Col, theme } from 'antd';
import mutation from '../../graphql/mutations';

import PoaModal from './PoaModal';
import BreadcrumbMenu from '../../components/BreadCrumbMenu';

export const POA_SELF = 'self';
export const POA_EMAIL = 'email';

const { Content } = Layout;

const Funding = () => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const { isLoggedIn, companyId } = useOutletContext();

  const [poaAuthorization, setPoaAuthorization] = useState();
  const [poaWidget, setPoaWidget] = useState();
  const [fundingRequestSrcDoc, setFundingRequestSrcDoc] = useState();

  const [fundingPoa, fundingPoaResponse] = useMutation(mutation.fundingPoa);

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
      <div
        style={{
          backgroundColor: 'white',
          marginLeft: '-24px',
          padding: '24px',
        }}
      >
        <BreadcrumbMenu />
        <Content>
          <Row align="bottom">
            <Col span={18} style={{ paddingRight: '24px' }}>
              <h1>Sign funding power of attorney</h1>
              <p>
                In order to act on your behalf with tax authorities, Avalara
                needs to have the funding power of attorney form completed and
                signed by an authorized representative of your business.
              </p>
            </Col>
          </Row>
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
          <Card
            style={{
              boxShadow: 'none',
              marginTop: 20,
              width: '100%',
            }}
          >
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
