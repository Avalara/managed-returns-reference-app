import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { countries as COUNTRIES } from '../../graphql/queries';
import { createAndLinkAccount as CREATE_AND_LINK_ACCOUNT } from '../../graphql/mutations';

import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Layout,
  notification,
  Row,
  Select,
  theme,
  Typography,
} from 'antd';
import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import { PageHeader } from '../shared';

const { Content } = Layout;
const { Title } = Typography;

const DEFAULT_COUNTRY = 'US';
const DEFAULT_COUNTRY_PLACEHOLDER = 'Select a country';
const DEFAULT_STATE_PLACEHOLDER = 'Select a state';

const Provisioning = () => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();

  const [countriesAndRegions, setCountriesAndRegions] = useState();
  const [countryOptions, setCountryOptions] = useState();
  const [regionOptions, setRegionOptions] = useState();

  const getRegionOptionsSorted = (countriesAndRegions = [], countryCode = '') =>
    countriesAndRegions
      .find((country) => country.code === countryCode)
      .regions?.map((region) => ({
        value: region.code,
        label: region.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

  const [
    getCountriesAndRegions,
    {
      loading: getCountriesAndRegionsIsLoading,
      error: getCountriesAndRegionsDidError,
      data: countriesAndRegionsData,
    },
  ] = useLazyQuery(COUNTRIES);

  useEffect(() => {
    const getCountryAndRegionIds = async () => {
      await getCountriesAndRegions();
    };
    getCountryAndRegionIds();
  }, [getCountriesAndRegions]);

  useEffect(() => {
    if (
      countriesAndRegionsData &&
      countriesAndRegionsData.definitions &&
      countriesAndRegionsData.definitions.value
    ) {
      const countriesAndRegions =
        countriesAndRegionsData?.definitions?.value?.countries;
      setCountriesAndRegions(countriesAndRegions);

      const options = countriesAndRegions
        .map((country) => ({
          value: country.code,
          label: country.name,
        }))
        .sort(
          (a, b) =>
            (b.value === 'US') - (a.value === 'US') ||
            a.label.localeCompare(b.label)
        );
      setCountryOptions(options);
      form.setFieldValue('country', DEFAULT_COUNTRY);

      const selectedCountryRegionOptions = getRegionOptionsSorted(
        countriesAndRegions,
        DEFAULT_COUNTRY
      );
      setRegionOptions(selectedCountryRegionOptions);
    }
  }, [countriesAndRegionsData, form]);

  const handleCountryChange = (value) => {
    form.setFieldValue('state', undefined);

    const selectedCountryRegionOptions = getRegionOptionsSorted(
      countriesAndRegions,
      value
    );
    setRegionOptions(selectedCountryRegionOptions);
  };

  const [
    createAndLinkAccount,
    {
      loading: createAndLinkAccountIsLoading,
      error: createAndLinkAccountDidError,
      data: createAndLinkAccountData,
    },
  ] = useMutation(CREATE_AND_LINK_ACCOUNT);

  const onFinish = async () => {
    try {
      const {
        accountName,
        city,
        country,
        streetAddress,
        postalCode,
        state,
        emailAddress,
        firstName,
        lastName,
        taxpayerId,
      } = form.getFieldsValue();

      const result = await createAndLinkAccount({
        variables: {
          accountName,
          city,
          country,
          line: streetAddress,
          postalCode,
          region: state,
          email: emailAddress,
          firstName,
          lastName,
          taxPayerIdNumber: taxpayerId,
        },
      });

      form.resetFields();
      form.setFieldValue('country', DEFAULT_COUNTRY);

      const selectedCountryRegionOptions = getRegionOptionsSorted(
        countriesAndRegions,
        DEFAULT_COUNTRY
      );
      setRegionOptions(selectedCountryRegionOptions);

      const accountId = result.data.createAndLinkAccount.clientAccountId;

      notification.success({
        message: 'Account successfully provisioned',
        description: `Account ID ${accountId} has been provisioned.`,
        placement: 'topRight',
        duration: 0,
      });
    } catch (error) {
      notification.error({
        message: 'Failed to provision account',
        description: error.message,
        placement: 'topRight',
        duration: 0,
      });
    }
  };

  const onFinishFailed = () => {
    notification.error({
      message: 'Error',
      description: 'Form submission failed. Please check your inputs.',
      placement: 'topRight',
      duration: 0,
    });
  };

  const selectSearchFilterOption = (input, option) => {
    const label = (option?.label ?? '').toLowerCase();
    const value = (option?.value ?? '').toLowerCase();
    const searchTerm = input.toLowerCase();
    return label.includes(searchTerm) || value.includes(searchTerm);
  };

  const leftColumnFields = [
    {
      name: 'accountName',
      label: 'Account name',
      rules: [{ required: true, message: 'Account name is required' }],
      component: <Input />,
    },
    {
      name: 'taxpayerId',
      label: 'Taxpayer ID',
      rules: [{ required: true, message: 'Taxpayer ID is required' }],
      component: <Input />,
    },
    {
      name: 'firstName',
      label: 'First name',
      rules: [{ required: true, message: 'First name is required' }],
      component: <Input />,
    },
    {
      name: 'lastName',
      label: 'Last name',
      rules: [{ required: true, message: 'Last name is required' }],
      component: <Input />,
    },
    {
      name: 'emailAddress',
      label: 'Email address',
      rules: [{ required: true, message: 'Email address is required' }],
      component: <Input />,
    },
  ];

  const rightColumnFields = [
    {
      name: 'streetAddress',
      label: 'Street address',
      rules: [{ required: true, message: 'Street address is required' }],
      component: <Input />,
    },
    {
      name: 'city',
      label: 'City',
      rules: [{ required: true, message: 'City is required' }],
      component: <Input />,
    },
    {
      name: 'state',
      label: 'State',
      rules: [{ required: true, message: 'State is required' }],
      component: (
        <Select
          placeholder={DEFAULT_STATE_PLACEHOLDER}
          showSearch
          filterOption={(input, option) =>
            selectSearchFilterOption(input, option)
          }
          loading={getCountriesAndRegionsIsLoading}
          disabled={getCountriesAndRegionsIsLoading}
          allowClear
          options={regionOptions}
        />
      ),
    },
    {
      name: 'postalCode',
      label: 'Postal code',
      rules: [{ required: true, message: 'Postal code is required' }],
      component: <Input />,
    },
    {
      name: 'country',
      label: 'Country',
      rules: [{ required: true, message: 'Country is required' }],
      component: (
        <Select
          placeholder={DEFAULT_COUNTRY_PLACEHOLDER}
          showSearch
          filterOption={(input, option) =>
            selectSearchFilterOption(input, option)
          }
          loading={getCountriesAndRegionsIsLoading}
          disabled={getCountriesAndRegionsIsLoading}
          onChange={handleCountryChange}
          options={countryOptions}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader>
        <BreadcrumbMenu />
        <Content>
          <Title level={1}>Provisioning</Title>
          <p>Enter your customer’s information to provision a new account.</p>
        </Content>
      </PageHeader>
      <Content>
        <Layout>
          <Card title="Customer details">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Row gutter={24}>
                <Col span={11}>
                  {leftColumnFields.map((field) => (
                    <Form.Item
                      key={field.name}
                      name={field.name}
                      label={field.label}
                      rules={field.rules}
                    >
                      {field.component}
                    </Form.Item>
                  ))}
                </Col>

                <Col
                  span={2}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Divider type="vertical" style={{ height: '100%' }} />
                </Col>

                <Col span={11}>
                  {rightColumnFields.map((field) => (
                    <Form.Item
                      key={field.name}
                      name={field.name}
                      label={field.label}
                      rules={field.rules}
                    >
                      {field.component}
                    </Form.Item>
                  ))}
                </Col>
              </Row>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={createAndLinkAccountIsLoading}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Layout>
      </Content>
    </>
  );
};

export default Provisioning;
