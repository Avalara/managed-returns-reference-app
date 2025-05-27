/*
 * Contents of this file was produced with a help of a code generation tool and
 * subsequently reviewed and edited by a human.
 *
 * While some of the code was created by an AI assisted service, manual adjustments
 * have been made to ensure correctness, readability, functionality and compliance
 * to Avalara's coding standards and guidelines.
 * Any future modifications should be approached with caution to avoid
 * overwriting the manual changes.
 *
 *
 * This source code is owned by Avalara Inc. Unauthorized copying of this file,
 * via any medium, is strictly prohibited. Proprietary and confidential.
 *
 * For more information, refer to the documentation or contact the development team.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  Form,
  Button,
  Select,
  Space,
  Typography,
  Alert,
  Divider,
  Skeleton,
  Modal,
  message,
} from 'antd';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import ReturnQuestion from './ReturnQuestion.jsx';
import EfileCredentialVerification from './EfileCredentialVerification.jsx';
import {
  filingCalendarMetadata as FILING_CALENDAR_METADATA,
  companyLocations as COMPANY_LOCATIONS,
} from '../../graphql/queries';
import { createFilingCalendarRequests as CREATE_FILING_CALENDAR_REQUESTS } from '../../graphql/mutations';
import { useOutletContext, useParams } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const FilingFrequency = ({
  formFilingFrequencies,
  selectedFilingFrequency,
}) => {
  const filingFrequencyOptions = formFilingFrequencies.reduce((acc, item) => {
    acc[item.filingFrequency] = item.filingPeriodDates;
    return acc;
  }, {});

  return (
    <>
      <Form.Item
        label="Filing Frequency"
        name="filingFrequency"
        rules={[
          { required: true, message: 'Please select a filing frequency' },
        ]}
      >
        <Select placeholder="Select filing frequency" style={{ width: '100%' }}>
          {Object.keys(filingFrequencyOptions)?.map((freq) => (
            <Select.Option key={freq} value={freq}>
              {freq}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Filing Period"
        name="filingPeriod"
        rules={[{ required: true, message: 'Please select a filing period' }]}
      >
        <Select
          placeholder="Select filing period"
          disabled={!selectedFilingFrequency}
          style={{ width: '100%' }}
        >
          {filingFrequencyOptions?.[selectedFilingFrequency]?.map(
            (period, index) => (
              <Select.Option key={index} value={period.description}>
                {period.description}
              </Select.Option>
            )
          )}
        </Select>
      </Form.Item>
    </>
  );
};

FilingFrequency.propTypes = {
  formFilingFrequencies: PropTypes.arrayOf(
    PropTypes.shape({
      filingFrequencyId: PropTypes.number,
      filingFrequency: PropTypes.string,
      filingPeriodDates: PropTypes.arrayOf(
        PropTypes.shape({
          transactionalPeriodEnd: PropTypes.string,
          transactionalPeriodStart: PropTypes.string,
          filingDueDate: PropTypes.string,
          description: PropTypes.string,
        })
      ),
    })
  ),
};

const AddReturn = ({ visible, onClose, taxForm }) => {
  const { companyId } = useOutletContext();
  const [form] = Form.useForm();
  const selectedFilingFrequency = Form.useWatch('filingFrequency', form);
  const [modal, contextHolder] = Modal.useModal();
  const efileVerificationRef = useRef();

  // Create Filing Calendar Requests mutation
  const [createFilingCalendar, { loading: createFilingRequestInProgress }] =
    useMutation(CREATE_FILING_CALENDAR_REQUESTS, {
      onCompleted: (data) => {
        message.success('Return successfully saved');
        onClose();
      },
      onError: (error) => {
        message.error(`Error saving return: ${error.message}`);
      },
    });

  const handleLocationSelect = (locationCode) => {
    const selectedLocation = locations.find(
      (loc) => loc.locationCode === locationCode
    );
    if (selectedLocation) {
      form.setFieldsValue({
        28: selectedLocation.line1,
        30: selectedLocation.city,
        31: selectedLocation.region,
        32: selectedLocation.postalCode,
        33: selectedLocation.country,
      });
    }
  };

  // Reset form when drawer opens with a new tax form
  // useEffect(() => {
  //   if (visible) {
  //     form.resetFields();
  //     // Reset the verification state when the drawer opens
  //     if (efileVerificationRef.current) {
  //       efileVerificationRef.current.resetVerification();
  //     }
  //   }
  // }, [visible, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const answers = [];

        standardQuestions.forEach((question) => {
          const questionId = question.value.filingQuestionId;
          if (values[questionId]) {
            answers.push({
              filingQuestionId: questionId,
              answer: values[questionId],
            });
          }
        });

        customQuestions.forEach((question) => {
          const questionId = question.filingQuestionId;
          if (values[questionId]) {
            answers.push({
              filingQuestionId: questionId,
              answer: values[questionId],
            });
          }
        });

        // Get filing period data
        const selectedPeriod = formFilingFrequencies
          .find((freq) => freq.filingFrequency === values.filingFrequency)
          ?.filingPeriodDates.find(
            (period) => period.description === values.filingPeriod
          );

        // Create request payload
        const requestData = {
          returnName: taxForm?.taxFormName || '',
          taxFormCode: taxForm?.taxFormCode || '',
          filingFrequencyId: values.filingFrequency.toUpperCase(),
          effDate:
            selectedPeriod?.transactionalPeriodStart ||
            new Date().toISOString(),
          country: taxForm?.country,
          region: taxForm?.region || '',
          taxAuthorityName: taxForm?.description || '',
          answers: answers,
        };

        createFilingCalendar({
          variables: {
            filingRequestInput: {
              companyId: parseInt(companyId),
              filingRequest: {
                data: requestData,
                companyId: parseInt(companyId),
                filingRequestStatusId: 'NEW',
              },
            },
          },
        });

        console.log('Submitting data:', requestData);
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  };

  const handleDrawerClose = () => {
    if (form.isFieldsTouched() === true) {
      modal.confirm({
        title: 'Are you sure you want to set up this return later?',
        icon: <ExclamationCircleOutlined />,
        content: (
          <>
            The information for this return won’t be saved. To set up this
            return later, you will need to add it again to your{' '}
            {taxForm?.region || 'state'} returns.
          </>
        ),
        okText: 'Yes, set up later',
        cancelText: 'Cancel',
        onOk: () => onClose(),
      });
    } else {
      onClose();
    }
  };

  const { loading: questionsLoading, data: questionsData } = useQuery(
    FILING_CALENDAR_METADATA,
    {
      variables: { taxFormCode: taxForm?.taxFormCode },
    }
  );

  const {
    loading: locationsLoading,
    data: locationsData,
    error: locationsError,
  } = useQuery(COMPANY_LOCATIONS, {
    variables: { companyId: parseInt(companyId) },
  });

  const {
    customQuestions = [],
    standardQuestions = [],
    formFilingFrequencies = [],
    formFilingMethods = [],
    formHeader: { outletReportingMethod, dorWebsite } = {},
  } = questionsData?.definitions?.value?.filingCalendarMetaData
    ?.filingCalendarMetadata || {};

  const locations = locationsData?.companies?.value?.[0]?.locations || [];

  return (
    <Drawer
      title={
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <div>{`Set up ${taxForm?.description || 'Return'}`}</div>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {taxForm?.taxFormName || ''}
          </Text>
        </Space>
      }
      width={600}
      onClose={handleDrawerClose}
      open={visible}
      extra={
        <Space>
          <Button onClick={handleDrawerClose}>Set up later</Button>
          <Button
            onClick={handleSubmit}
            type="primary"
            loading={createFilingRequestInProgress}
          >
            Save
          </Button>
          {contextHolder}
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        name="returnSetupForm"
        wrapperCol={{ span: 16 }}
        initialValues={{}}
      >
        {questionsLoading || locationsLoading ? (
          <div style={{ padding: '50px 0' }}>
            <Skeleton
              active
              title={{ width: '50%' }}
              paragraph={{
                rows: 4,
                width: ['90%', '80%', '70%', '60%'],
              }}
            />
            <Skeleton
              active
              title={{ width: '40%' }}
              paragraph={{
                rows: 3,
                width: ['85%', '75%', '65%'],
              }}
              style={{ marginTop: 24 }}
            />
            <Skeleton
              active
              title={{ width: '50%' }}
              paragraph={{
                rows: 4,
                width: ['90%', '80%', '70%', '60%'],
              }}
            />
            <Skeleton
              active
              title={{ width: '40%' }}
              paragraph={{
                rows: 3,
                width: ['85%', '75%', '65%'],
              }}
              style={{ marginTop: 24 }}
            />
          </div>
        ) : (
          <>
            <Divider orientation="left" orientationMargin="0">
              State required information
            </Divider>
            {customQuestions.map((question) => (
              <ReturnQuestion key={question?.filingQuestionId} {...question} />
            ))}
            {/* Render filing frequency */}
            <FilingFrequency
              formFilingFrequencies={formFilingFrequencies}
              selectedFilingFrequency={selectedFilingFrequency}
            />
            {/* Render EfileCredentialVerification if we have efile username/password questions */}
            {formFilingMethods.some(
              (method) => method.filingMethod === 'Electronic'
            ) && (
              <>
                <Divider orientation="left" orientationMargin="0">
                  E-file Login
                </Divider>
                <EfileCredentialVerification
                  form={form}
                  companyId={companyId}
                  taxFormCode={taxForm?.taxFormCode}
                  region={taxForm?.region}
                  dorWebsite={dorWebsite}
                  standardQuestions={standardQuestions.filter(
                    (q) =>
                      q?.value?.filingQuestionId === 26 ||
                      q?.value?.filingQuestionId === 27
                  )}
                />
              </>
            )}
            {/* Render locations if we have a consolidated return */}
            {outletReportingMethod?.toUpperCase() === 'CONSOLIDATED' && (
              <>
                <Divider orientation="left" orientationMargin="0">
                  Locations
                </Divider>
                {locationsLoading ? (
                  <Skeleton active paragraph={{ rows: 2 }} />
                ) : locationsError ? (
                  <Alert
                    message="Error loading locations"
                    description={locationsError.message}
                    type="error"
                    showIcon
                  />
                ) : (
                  <div style={{ marginTop: '16px' }}>
                    <Text strong>
                      These are all the locations that you are filing in this
                      return:
                    </Text>
                    {locations.length === 0 ? (
                      <div style={{ marginTop: '8px' }}>
                        <Text type="secondary">
                          No locations found for this company.
                        </Text>
                      </div>
                    ) : (
                      <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                        {locations.map((location) => (
                          <li key={location.locationCode}>
                            <Text>
                              {location.locationCode} ({location.city || 'N/A'},{' '}
                              {location.region || 'N/A'})
                              {location.isDefault && (
                                <Text type="secondary"> (Default)</Text>
                              )}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </>
            )}
            {/* Render locations if we have a duplicate return */}
            {outletReportingMethod?.toUpperCase() === 'DUPLICATE' && (
              <>
                <Divider orientation="left" orientationMargin="0">
                  Locations
                </Divider>
                <Form.Item label={'Location'} name="locationCode">
                  <Select placeholder="Select location code">
                    <Select.Option value={''}>All locations</Select.Option>
                    {locations.map((location) => (
                      <Select.Option
                        key={location.locationCode}
                        value={location.locationCode}
                      >
                        {location.locationCode} ({location.city},{' '}
                        {location.region})
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            )}
            <Divider orientation="left" orientationMargin="0">
              Company details
            </Divider>
            {standardQuestions.map((question) => (
              <>
                {question?.value?.filingQuestionId === 28 && (
                  <Form.Item label="Select address" name="address">
                    <Select
                      placeholder="Select a address"
                      onChange={handleLocationSelect}
                      allowClear={true}
                      style={{ width: '100%' }}
                    >
                      {locations.map((location) => (
                        <Select.Option
                          key={location.locationCode}
                          value={location.locationCode}
                        >
                          {location.description ||
                            `${location.line1}, ${location.city}`}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
                {/* Skip rendering ReturnQuestion for efile username (26) and password (27) */}
                {question?.value?.filingQuestionId !== 26 &&
                  question?.value?.filingQuestionId !== 27 && (
                    <ReturnQuestion
                      key={question.value.filingQuestionId}
                      {...question.value}
                    />
                  )}
              </>
            ))}
          </>
        )}
      </Form>
      {contextHolder}
    </Drawer>
  );
};

AddReturn.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  companyId: PropTypes.string,
  accountId: PropTypes.string,
  taxForm: PropTypes.shape({
    description: PropTypes.string,
    taxFormName: PropTypes.string,
    taxFormCode: PropTypes.string,
    region: PropTypes.string,
  }),
};

export default AddReturn;
