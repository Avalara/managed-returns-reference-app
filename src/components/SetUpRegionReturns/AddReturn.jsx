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

import React, { useRef } from 'react';
import {
  Drawer,
  Button,
  Space,
  Typography,
  Modal,
  Result,
  notification,
} from 'antd';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';
import { createFilingCalendarRequests as CREATE_FILING_CALENDAR_REQUESTS } from '../../graphql/mutations';
import { filingCalendarRequestWithModel as FILING_CALENDAR_REQUEST_WITH_MODEL } from '../../graphql/queries';
import { useOutletContext } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ReturnForm from './ReturnForm.jsx';

const { Text } = Typography;

/**
 * A drawer component for adding a new filing calendar request
 * Allows users to enter return details and save the request
 *
 * Features:
 * - Validates form and shows confirmation modal on unsaved changes detection
 * - Cancel return functionality with confirmation modal
 * - Save return details
 *
 * @param {Object} props - Component props
 * @param {Object} props.taxForm - The tax form data object containing taxFormCode, description, etc.
 * @param {Function} props.onClose - Callback function to close the drawer
 *
 * @returns {React.ReactElement} The drawer component.
 */
const AddReturn = ({ taxForm, onClose }) => {
  // Refs and context
  const { companyId } = useOutletContext();
  const childFormRef = useRef();

  // UI state management
  const [modal, modalContextHolder] = Modal.useModal();

  // Create filing calendar request
  const [
    createFilingCalendarRequest,
    { loading: createFilingRequestInProgress },
  ] = useMutation(CREATE_FILING_CALENDAR_REQUESTS, {
    onCompleted: () => {
      notification.success({
        message: 'Return created successfully',
        description: (
          <span>
            <strong>
              {taxForm?.taxFormName || 'Return'} ({taxForm?.description})
            </strong>{' '}
            has been created successfully
          </span>
        ),
        placement: 'topRight',
        duration: 10,
      });
      onClose();
    },
    onError: (error) => {
      notification.error({
        message: `Return creation failed`,
        description: (
          <span>
            Failed to create{' '}
            <strong>
              {taxForm?.taxFormName || 'return'} ({taxForm?.description})
            </strong>
            . Please try again.
          </span>
        ),
        placement: 'topRight',
        duration: 10,
      });
      console.error('Error creating filing request:', error);
    },
  });

  // Query variables for fetching filing calendar request model for tax form code and company
  const queryVariables = {
    companyId: parseInt(companyId),
    taxFormCode: taxForm?.taxFormCode,
  };

  // Fetch filing calendar request model
  const {
    loading: loadingFilingCalendarRequestModel,
    error: didErrorFilingCalendarRequestModel,
    data: filingCalendarRequestModelData,
  } = useQuery(FILING_CALENDAR_REQUEST_WITH_MODEL, {
    variables: queryVariables,
    skip: !taxForm?.taxFormCode || !companyId,
  });

  const requestModel =
    filingCalendarRequestModelData?.filingCalendarRequests?.value
      ?.filingCalendarRequestModel;
  const requestData = requestModel?.data;

  // Extract filing frequencies from the request model
  const filingFrequencies = requestData?.formFilingFrequencies;

  // Transform answers array into key-value pairs for form initial values
  const formAnswers = requestData?.answers?.reduce((acc, answer) => {
    acc[answer.filingQuestionCode] = answer.answer;
    return acc;
  }, {});

  /**
   * Handles closing the drawer
   * Shows confirmation modal if form is touched
   */
  const handleDrawerClose = () => {
    if (childFormRef.current) {
      const form = childFormRef.current.getForm();
      const isFormTouched = form.isFieldsTouched() === true;

      if (isFormTouched) {
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
          onOk: onClose,
        });
      } else {
        onClose();
      }
    } else {
      onClose();
    }
  };
  /**
   * Handles form submission by triggering the child's form submission
   */
  const handleSubmit = () => {
    if (childFormRef.current) {
      childFormRef.current.getForm().submit(); // Trigger child's form submission
    }
  };
  /**
   * Handles form submission and creates new filing calendar request with answers
   * @param {Object} formattedFormValues - The formatted form values from ReturnForm
   */
  const onFinish = (formattedFormValues) => {
    // Create request payload
    const data = {
      // taxAuthorityName: requestData.taxAuthorityName,
      // taxAuthorityId: requestData.taxAuthorityId,
      region: requestData.region,
      country: requestData.country,
      // endDate: requestData.endDate,
      // effDate: requestData.effDate,
      // locationCode: requestData.locationCode,
      // registrationId: requestData.registrationId, // TODO: is this needed?
      // filingFrequencyId: requestData.filingFrequencyId,
      taxFormCode: requestData.taxFormCode,
      // returnName: requestData.returnName,
      companyReturnId: requestData.companyReturnId,
      ...formattedFormValues,
    };

    createFilingCalendarRequest({
      variables: {
        filingRequestInput: {
          companyId: parseInt(companyId),
          filingRequest: {
            data: data,
            companyId: requestModel.companyId,
            filingRequestStatusId: requestModel.filingRequestStatusId,
          },
        },
      },
    });
  };

  const drawerTitle = (
    <Space direction="vertical" size={0} style={{ width: '100%' }}>
      <div>{`Set up ${taxForm?.description || 'Return'}`}</div>
      <Text type="secondary" style={{ fontSize: '14px' }}>
        {taxForm?.taxFormName || ''}
      </Text>
    </Space>
  );

  if (didErrorFilingCalendarRequestModel) {
    return (
      <Drawer title={drawerTitle} open={true} onClose={onClose} width={600}>
        <Result
          status="error"
          title="Failed to load return setupinformation"
          subTitle={
            didErrorFilingCalendarRequestModel?.message ||
            'An error occurred while loading the return setup information. Please try again later.'
          }
          extra={[
            <Button key="close" onClick={onClose}>
              Close
            </Button>,
          ]}
        />
      </Drawer>
    );
  }

  return (
    <Drawer
      title={drawerTitle}
      onClose={handleDrawerClose}
      open={true}
      width={600}
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
          {modalContextHolder}
        </Space>
      }
    >
      <ReturnForm
        ref={childFormRef}
        loading={loadingFilingCalendarRequestModel}
        companyId={companyId}
        region={taxForm?.region}
        taxFormCode={taxForm?.taxFormCode}
        filingFrequencies={filingFrequencies}
        onFinish={onFinish}
        initialValues={{
          ...formAnswers,
          filingFrequencyId: requestData?.filingFrequencyId,
          effDate: requestData?.effDate,
          locationCode: requestData?.locationCode,
        }}
      />
      {modalContextHolder}
    </Drawer>
  );
};

AddReturn.propTypes = {
  onClose: PropTypes.func.isRequired,
  taxForm: PropTypes.shape({
    description: PropTypes.string,
    taxFormName: PropTypes.string,
  }),
};

export default AddReturn;
