import React from 'react';
import { Typography, Row, Col, Layout, Card, Button, Space } from 'antd';
import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import { PageHeader } from '../shared';
import SelectStatesEdit from './SelectStatesEdit';
import { useOutletContext } from 'react-router-dom';

const { Title } = Typography;
const { Content } = Layout;

const SelectStates = () => {
  const { companyId } = useOutletContext();
  return (
    <>
      <PageHeader>
        <BreadcrumbMenu />
        <Content>
          <Row align="bottom">
            <Col lg={16}>
              <Title level={1}>
                Select states where you&#39;re registered to report tax
              </Title>
              <p>
                Be sure to select any state where you&#39;re already registered.
                If you&#39;re not sure about a particular state, check your
                registration documents or check with the state&#39;s tax
                department.
              </p>
            </Col>
          </Row>
        </Content>
      </PageHeader>
      <Content>
        <Layout>
          <Card>
            <Space
              direction="vertical"
              size="middle"
              style={{ display: 'flex' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Title level={2} style={{ margin: 0 }}>
                  States where you report tax
                </Title>
              </div>
              <div>
                <SelectStatesEdit companyId={companyId} />
              </div>
            </Space>
          </Card>
        </Layout>
      </Content>
    </>
  );
};

export default SelectStates;
