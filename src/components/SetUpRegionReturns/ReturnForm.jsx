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

import { Alert, Divider, Form, Select, Skeleton, Typography } from 'antd';
import PropTypes from 'prop-types';
import React, { useImperativeHandle } from 'react';
import { useQuery } from '@apollo/client';
import {
  companyLocations as COMPANY_LOCATIONS,
  filingCalendarMetadata as FILING_CALENDAR_METADATA,
} from '../../graphql/queries/index.js';
import ReturnQuestion from './ReturnQuestion.jsx';
import EfileCredentialVerification from './EfileCredentialVerification.jsx';
import {
  ADDRESS_LINE_1_QUESTION_CODE,
  ADDRESS_LINE_2_QUESTION_CODE,
  CITY_QUESTION_CODE,
  COUNTRY_QUESTION_CODE,
  isAddressLine1Question,
  isEfilePasswordQuestion,
  isEfileUsernameQuestion,
  REGION_QUESTION_CODE,
  ZIP_CODE_QUESTION_CODE,
} from './returns-set-up-helper.js';

const { Text } = Typography;
const FormLoading = () => (
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
);

const FilingFrequency = ({
  formFilingFrequencies,
  selectedFilingFrequency,
}) => {
  // TODO : remove upperCase after https://avalara.atlassian.net/browse/RAAS-17961
  const filingFrequencyOptions = formFilingFrequencies.reduce((acc, item) => {
    acc[item.filingFrequency?.toUpperCase()] = item.filingPeriodDates;
    return acc;
  }, {});

  return (
    <>
      <Form.Item
        label="Filing Frequency"
        name="filingFrequencyId"
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
        name="effDate"
        rules={[{ required: true, message: 'Please select a filing period' }]}
      >
        <Select
          placeholder="Select filing period"
          disabled={!selectedFilingFrequency}
          style={{ width: '100%' }}
        >
          {filingFrequencyOptions?.[selectedFilingFrequency]?.map(
            (period, index) => (
              <Select.Option
                key={index}
                value={period.transactionalPeriodStart}
              >
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
  selectedFilingFrequency: PropTypes.string,
};

const ReturnForm = React.forwardRef((props, ref) => {
  const {
    loading = false,
    taxFormCode,
    region, // TODO: remove and extract this from the filing request model
    companyId,
    initialValues = {},
    onFinish = () => {},
  } = props;

  const [form] = Form.useForm();
  const selectedFilingFrequency = Form.useWatch('filingFrequencyId', form);

  // Expose form to parent
  useImperativeHandle(ref, () => ({
    getForm: () => form,
  }));

  // Get questions for form
  const { loading: questionsLoading, data: questionsData } = useQuery(
    FILING_CALENDAR_METADATA,
    {
      variables: { taxFormCode: taxFormCode },
    }
  );

  // Get company locations
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

  const locationList =
    locationsData?.companies?.value?.[0]?.locations.map((location) => ({
      [ADDRESS_LINE_1_QUESTION_CODE]: location.line1,
      [ADDRESS_LINE_2_QUESTION_CODE]: location.line2,
      [CITY_QUESTION_CODE]: location.city,
      [REGION_QUESTION_CODE]: location.region,
      [ZIP_CODE_QUESTION_CODE]: location.postalCode,
      [COUNTRY_QUESTION_CODE]: location.country,
      isDefault: location.isDefault,
      locationCode: location.locationCode,
      value: location.locationCode,
      label: `${location.line1}, ${location.city}, ${location.region}, (${location.locationCode})`,
    })) || [];

  const handleAddressSelect = (value) => {
    const selectedLocation = locationList.find((loc) => loc.value === value);
    if (selectedLocation) {
      form.setFieldsValue({
        [ADDRESS_LINE_1_QUESTION_CODE]:
          selectedLocation[ADDRESS_LINE_1_QUESTION_CODE],
        [ADDRESS_LINE_2_QUESTION_CODE]:
          selectedLocation[ADDRESS_LINE_2_QUESTION_CODE],
        [CITY_QUESTION_CODE]: selectedLocation[CITY_QUESTION_CODE],
        [REGION_QUESTION_CODE]: selectedLocation[REGION_QUESTION_CODE],
        [ZIP_CODE_QUESTION_CODE]: selectedLocation[ZIP_CODE_QUESTION_CODE],
        [COUNTRY_QUESTION_CODE]: selectedLocation[COUNTRY_QUESTION_CODE],
      });
    } else {
      form.setFieldsValue({
        [ADDRESS_LINE_1_QUESTION_CODE]: '',
        [ADDRESS_LINE_2_QUESTION_CODE]: '',
        [CITY_QUESTION_CODE]: '',
        [REGION_QUESTION_CODE]: '',
        [ZIP_CODE_QUESTION_CODE]: '',
        [COUNTRY_QUESTION_CODE]: '',
      });
    }
  };

  const formatFormValues = (values) => {
    const answers = [];

    standardQuestions.forEach((question) => {
      const questionId = question.filingQuestionId;
      const questionCode = question.filingQuestionCode;
      if (values[questionCode]) {
        answers.push({
          filingQuestionId: questionId,
          answer: values[questionCode],
        });
      }
    });

    customQuestions.forEach((question) => {
      const questionId = question.filingQuestionId;
      const questionCode = question.filingQuestionCode;
      if (values[questionCode]) {
        answers.push({
          filingQuestionId: questionId,
          answer: values[questionCode],
        });
      }
    });

    // Create request payload
    return {
      filingFrequencyId: values.filingFrequencyId,
      effDate: values.effDate,
      locationCode: values.locationCode,
      answers: answers,
    };
  };

  if (loading || locationsLoading || questionsLoading) {
    return <FormLoading />;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      name="returnSetupForm"
      wrapperCol={{ span: 16 }}
      initialValues={{ ...initialValues }}
      onFinish={(values) => {
        const formattedFormValues = formatFormValues(values);
        onFinish(formattedFormValues);
      }}
    >
      <Divider orientation="left" orientationMargin="0">
        State required information
      </Divider>
      {customQuestions.map((question) => (
        <ReturnQuestion key={question?.filingQuestionCode} {...question} />
      ))}
      <FilingFrequency
        formFilingFrequencies={formFilingFrequencies}
        selectedFilingFrequency={selectedFilingFrequency}
      />
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
            taxFormCode={taxFormCode}
            region={region}
            dorWebsite={dorWebsite}
            standardQuestions={standardQuestions}
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
                These are all the locations that you are filing in this return:
              </Text>
              {locationList.length === 0 ? (
                <div style={{ marginTop: '8px' }}>
                  <Text type="secondary">
                    No locations found for this company.
                  </Text>
                </div>
              ) : (
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  {locationList.map((location) => (
                    <li key={location.locationCode}>
                      <Text>
                        {location.label}
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
              {locationList.map((location) => (
                <Select.Option key={location.value} value={location.value}>
                  {location.label}
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
        <React.Fragment key={question?.filingQuestionCode}>
          {isAddressLine1Question(question) && (
            <Form.Item label="Select address" name="address">
              <Select
                showSearch
                allowClear
                mode="combobox"
                defaultValue={
                  locationList.find(
                    (loc) =>
                      loc[ADDRESS_LINE_1_QUESTION_CODE] ===
                        initialValues[ADDRESS_LINE_1_QUESTION_CODE] &&
                      (loc[ADDRESS_LINE_2_QUESTION_CODE] ||
                      initialValues[ADDRESS_LINE_2_QUESTION_CODE]
                        ? loc[ADDRESS_LINE_2_QUESTION_CODE] ===
                          initialValues[ADDRESS_LINE_2_QUESTION_CODE]
                        : true) &&
                      loc[CITY_QUESTION_CODE] ===
                        initialValues[CITY_QUESTION_CODE] &&
                      loc[REGION_QUESTION_CODE] ===
                        initialValues[REGION_QUESTION_CODE] &&
                      loc[ZIP_CODE_QUESTION_CODE] ===
                        initialValues[ZIP_CODE_QUESTION_CODE] &&
                      loc[COUNTRY_QUESTION_CODE] ===
                        initialValues[COUNTRY_QUESTION_CODE]
                  )?.value
                }
                placeholder="Select or type a new address"
                onSelect={handleAddressSelect}
                onChange={handleAddressSelect}
                style={{ width: '100%' }}
              >
                {locationList.map((location) => (
                  <Select.Option key={location.value} value={location.value}>
                    {`${location.label}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          {/* Skip rendering ReturnQuestion for efile username and password  */}
          {!isEfileUsernameQuestion(question) &&
            !isEfilePasswordQuestion(question) && (
              <ReturnQuestion key={question.filingQuestionCode} {...question} />
            )}
        </React.Fragment>
      ))}
    </Form>
  );
});

ReturnForm.displayName = 'ReturnForm';

ReturnForm.propTypes = {
  loading: PropTypes.bool,
  taxFormCode: PropTypes.string,
  region: PropTypes.string,
  companyId: PropTypes.string,
  initialValues: PropTypes.object,
  onFinish: PropTypes.func,
};
export default ReturnForm;
