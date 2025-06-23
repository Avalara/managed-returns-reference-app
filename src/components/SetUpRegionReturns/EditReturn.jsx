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
import PropTypes from 'prop-types';
import {
  Drawer,
  Space,
  Button,
  Alert,
  Typography,
  Modal,
  Result,
  notification,
} from 'antd';
import { useQuery, useMutation } from '@apollo/client';
import { useOutletContext } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { filingCalendarRequestWithModel as FILING_CALENDAR_REQUEST_WITH_MODEL } from '../../graphql/queries';
import {
  cancelFilingCalendarRequest as CANCEL_FILING_CALENDAR_REQUEST,
  updateFilingCalendarRequest as UPDATE_FILING_CALENDAR_REQUEST,
  createFilingCalendarRequests as CREATE_FILING_CALENDAR_REQUESTS,
} from '../../graphql/mutations';
import ReturnForm from './ReturnForm.jsx';

const { Text } = Typography;

/**
 * A drawer component for editing filing calendar requests that are in "Pending" status.
 * Allows users to update return details and cancel returns
 *
 * Features:
 * - Validates form and shows confirmation modal on unsaved changes detection
 * - Cancel return functionality with confirmation modal
 * - Update return details
 *
 * @param {Object} props - Component props
 * @param {Object} props.returnData - The return data object containing id, taxFormName, description etc.
 * @param {Function} props.onClose - Callback function to close the drawer
 *
 * @returns {React.ReactElement} The drawer component.
 */
const EditFilingRequest = ({ returnData, onClose }) => {
  // TODO : show alert for form dependencies ?
  // TODO : Do we need to disable filing frequency input ?
  // Refs and context
  const { companyId } = useOutletContext();
  const childFormRef = useRef();

  // UI state management
  const [modal, modalContextHolder] = Modal.useModal();

  // Cancel filing request
  const [
    cancelFilingCalendarRequest,
    { loading: isCancellingFilingCalendarRequest },
  ] = useMutation(CANCEL_FILING_CALENDAR_REQUEST, {
    onCompleted: () => {
      notification.success({
        message: `Return cancelled successfully`,
        description: (
          <span>
            <strong>
              {returnData?.taxFormName || 'Return'} ({returnData?.description})
            </strong>{' '}
            has been cancelled successfully
          </span>
        ),
        placement: 'topRight',
        duration: 10,
      });
      onClose();
    },
    onError: (error) => {
      notification.error({
        message: `Return cancellation failed`,
        description: (
          <span>
            Failed to cancel{' '}
            <strong>
              {returnData?.taxFormName || 'Return'} ({returnData?.description})
            </strong>
            . Please try again.
          </span>
        ),
        placement: 'topRight',
        duration: 10,
      });
      console.error('Error cancelling filing request:', error);
    },
  });

  // Update filing calendar request
  const [
    updateFilingCalendarRequest,
    { loading: isUpdatingFilingCalendarRequest },
  ] = useMutation(UPDATE_FILING_CALENDAR_REQUEST, {
    onCompleted: () => {
      notification.success({
        message: `Return updated successfully`,
        description: (
          <span>
            <strong>
              {returnData?.taxFormName || 'Return'} ({returnData?.description})
            </strong>{' '}
            has been updated successfully.
          </span>
        ),
        placement: 'topRight',
        duration: 10,
      });
      onClose();
    },
    onError: (error) => {
      notification.error({
        message: `Return update failed`,
        description: (
          <span>
            Failed to update{' '}
            <strong>
              {returnData?.taxFormName || 'return'} ({returnData?.description})
            </strong>
            . Please try again.
          </span>
        ),
        placement: 'topRight',
        duration: 10,
      });
      console.error('Error updating filing request:', error);
    },
  });

  // Query variables for fetching filing request data
  const queryVariables = {
    companyId: parseInt(companyId),
    taxFormCode: returnData?.taxFormCode,
    filter: `id eq ${returnData.id}`,
  };

  // Fetch filing calendar request data
  const {
    loading: loadingFilingCalendarRequestData,
    error: didErrorFilingCalendarRequestData,
    data: filingCalendarRequestData,
  } = useQuery(FILING_CALENDAR_REQUEST_WITH_MODEL, {
    variables: queryVariables,
    skip: !returnData.id || !companyId,
  });

  // Extract and transform data for form initialization
  const filingRequests =
    filingCalendarRequestData?.filingCalendarRequests?.value?.filingRequests
      ?.value;
  const requestData = Array.isArray(filingRequests)
    ? filingRequests[0]?.data
    : null;

  // TODO: extract filing frequencies

  // Transform answers array into key-value pairs for form initial values
  const formAnswers =
    requestData?.answers?.reduce((acc, answer) => {
      acc[answer.filingQuestionCode] = answer.answer;
      return acc;
    }, {}) || {};

  /**
   * Handles closing the drawer with form touched detection
   * Shows confirmation modal if form is touched
   */
  const handleDrawerClose = () => {
    if (childFormRef.current) {
      const form = childFormRef.current.getForm();
      const isFormTouched = form.isFieldsTouched() === true;

      if (isFormTouched) {
        modal.confirm({
          title: 'Are you sure you want to close without saving?',
          icon: <ExclamationCircleOutlined />,
          content: (
            <div>
              <p>
                You have unsaved changes for{' '}
                <strong>
                  {returnData
                    ? `${returnData?.taxFormName} (${returnData?.description})`
                    : 'this return'}
                </strong>
                .
              </p>
              <p>
                Are you sure you want to close without saving? Your changes will
                be lost.
              </p>
            </div>
          ),
          okText: 'Yes, Close Without Saving',
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
   * Triggers form submission from the child ReturnForm component
   */
  const handleSubmit = () => {
    if (childFormRef.current) {
      childFormRef.current.getForm().submit();
    }
  };

  /**
   * Handles form submission and updates filing calendar request with updated answers
   * @param {Object} formattedFormValues - The formatted form values from ReturnForm
   */
  const onFinish = (formattedFormValues) => {
    const data = {
      region: requestData?.region || '',
      country: requestData?.country,
      taxFormCode: requestData?.taxFormCode || '',
      companyReturnId: requestData?.companyReturnId,
      taxAuthorityName: requestData?.taxAuthorityName || '',
      returnName: requestData?.returnName || '',
      ...formattedFormValues,
    };

    updateFilingCalendarRequest({
      variables: {
        companyId: parseInt(companyId),
        id: parseFloat(returnData.id),
        data: data,
      },
    });
  };

  /**
   * Handles canceling a return with confirmation modal
   * Executes the cancel mutation after user confirmation
   */
  const handleCancelReturn = () => {
    modal.confirm({
      title: 'Cancel Return',
      content: (
        <div>
          <p>
            These settings for{' '}
            <strong>
              {returnData
                ? `${returnData?.taxFormName} (${returnData?.description})`
                : 'this return'}
            </strong>{' '}
            will be canceled and this return will not be filed.
          </p>
        </div>
      ),
      okText: 'Yes, Cancel Return',
      cancelText: "Don't cancel",
      confirmLoading: isCancellingFilingCalendarRequest,
      onOk: async () => {
        try {
          await cancelFilingCalendarRequest({
            variables: {
              id: parseInt(returnData.id),
              companyId: parseInt(companyId),
            },
          });
        } catch (error) {
          // Error is already handled in the onError callback
          console.error('Error in handleCancelReturn:', error);
        }
      },
    });
  };

  const drawerTitle = (
    <Space direction="vertical" size={0} style={{ width: '100%' }}>
      <div>{`${returnData?.taxFormName || 'Return'}`}</div>
      <Text type="secondary" style={{ fontSize: '14px' }}>
        {returnData?.description || ''}
      </Text>
    </Space>
  );

  if (didErrorFilingCalendarRequestData) {
    return (
      <Drawer title={drawerTitle} open={true} onClose={onClose} width={600}>
        <Result
          status="error"
          title="Failed to load return information"
          subTitle={
            didErrorFilingCalendarRequestData?.message ||
            'An error occurred while loading the return information. Please try again later.'
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
      open={true}
      onClose={handleDrawerClose}
      width={600}
      extra={
        <Space>
          <Button onClick={handleCancelReturn} danger>
            Cancel this return
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={isUpdatingFilingCalendarRequest}
          >
            Save
          </Button>
        </Space>
      }
    >
      <Alert
        message="This return is in a requested status and will be eligible for filing once the Avalara review is complete."
        type="warning"
        showIcon
      />
      <ReturnForm
        ref={childFormRef}
        loading={loadingFilingCalendarRequestData}
        companyId={companyId}
        region={returnData?.region}
        taxFormCode={returnData?.taxFormCode}
        // TODO: do we need to pass filing frequencies here?
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

EditFilingRequest.propTypes = {
  /** The return data object containing filing request information */
  returnData: PropTypes.shape({
    /** Unique identifier for the return */
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    /** Display name of the tax form */
    taxFormName: PropTypes.string,
    /** Tax form code identifier */
    taxFormCode: PropTypes.string,
    /** Country code */
    country: PropTypes.string,
    /** Region/state code */
    region: PropTypes.string,
    /** Description of the tax authority */
    description: PropTypes.string,
    /** Current status of the return */
    status: PropTypes.string,
  }).isRequired,
  /** Callback function to close the drawer */
  onClose: PropTypes.func.isRequired,
};

/**
 * A drawer component for editing a filing calendar request.
 *
 * @param {Object} props Component props.
 * @param {Object} props.returnData The return data object containing id, taxFormName, description etc
 * @param {Function} props.onClose Callback function to close the drawer.
 *
 * @returns {React.ReactElement} The drawer component.
 */
const EditFilingCalendar = ({ returnData, onClose }) => {
  // TODO : alert for expiring filing calendar
  // TODO : alert for pending filing requests for this calendar
  // Context and refs
  const { companyId } = useOutletContext();
  const childFormRef = useRef();

  // UI state management
  const [modal, modalContextHolder] = Modal.useModal();

  // TODO: add mutation to stop filing calendar request

  // Create filing calendar request
  const [
    createFilingCalendarRequest,
    { loading: isCreatingFilingCalendarRequest },
  ] = useMutation(CREATE_FILING_CALENDAR_REQUESTS, {
    onCompleted: () => {
      notification.success({
        message: 'Return updated successfully',
        description: (
          <span>
            A request with updated values has been created successfully for
            <strong>
              {' '}
              {returnData?.taxFormName || 'Return'} ({returnData?.description})
            </strong>{' '}
            .
          </span>
        ),
        placement: 'topRight',
        duration: 10,
      });
      onClose();
    },
    onError: (error) => {
      notification.error({
        message: `Return update failed`,
        description: (
          <span>
            Failed to create a request to update{' '}
            <strong>
              {returnData?.taxFormName || 'return'} ({returnData?.description})
            </strong>
            . Please try again.
          </span>
        ),
        placement: 'topRight',
        duration: 10,
      });
      console.error('Error updating filing calendar:', error);
    },
  });

  // Query variables for fetching filing calendar request model for filing calendar
  const queryVariables = {
    companyId: parseInt(companyId),
    taxFormCode: returnData?.taxFormCode,
    filingCalendarId: parseInt(returnData.id),
  };

  // Fetch filing calendar data
  const {
    loading: loadingFilingCalendarRequestModel,
    error: didErrorFilingCalendarRequestModel,
    data: filingCalendarRequestModelData,
  } = useQuery(FILING_CALENDAR_REQUEST_WITH_MODEL, {
    variables: queryVariables,
    skip: !returnData.id || !companyId || !returnData?.taxFormCode,
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
          title: 'Are you sure you want to close without saving?',
          icon: <ExclamationCircleOutlined />,
          content: (
            <div>
              <p>
                You have unsaved changes for{' '}
                <strong>
                  {returnData
                    ? `${returnData?.taxFormName} (${returnData?.description})`
                    : 'this return'}
                </strong>
                .
              </p>
              <p>
                Are you sure you want to close without saving? Your changes will
                be lost.
              </p>
            </div>
          ),
          okText: 'Yes, Close Without Saving',
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
      childFormRef.current.getForm().submit();
    }
  };

  /**
   * Handles form submission and creates change request for filing calendar with updated answers
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

  const handleStopFilingReturn = () => {
    // TODO : handle stop filing return
  };

  const drawerTitle = (
    <Space direction="vertical" size={0} style={{ width: '100%' }}>
      <div>{`${returnData?.taxFormName || 'Return'}`}</div>
      <Text type="secondary" style={{ fontSize: '14px' }}>
        {returnData?.description || ''}
      </Text>
    </Space>
  );

  if (didErrorFilingCalendarRequestModel) {
    return (
      <Drawer title={drawerTitle} open={true} onClose={onClose} width={600}>
        <Result
          status="error"
          title="Failed to load return information"
          subTitle={
            didErrorFilingCalendarRequestModel?.message ||
            'An error occurred while loading the return information. Please try again later.'
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
      open={true}
      onClose={handleDrawerClose}
      width={600}
      extra={
        <Space>
          <Button onClick={handleStopFilingReturn} danger>
            Stop filing this return
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={isCreatingFilingCalendarRequest}
          >
            Save
          </Button>
        </Space>
      }
    >
      <ReturnForm
        ref={childFormRef}
        loading={loadingFilingCalendarRequestModel}
        companyId={companyId}
        region={returnData?.region}
        taxFormCode={returnData?.taxFormCode}
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

EditFilingCalendar.propTypes = {
  /** The return data object containing filing calendar information */
  returnData: PropTypes.shape({
    /** Unique identifier for the return */
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    /** Display name of the tax form */
    taxFormName: PropTypes.string,
    /** Tax form code identifier */
    taxFormCode: PropTypes.string,
    /** Country code */
    country: PropTypes.string,
    /** Region/state code */
    region: PropTypes.string,
    /** Description of the tax authority */
    description: PropTypes.string,
    /** Current status of the return */
    status: PropTypes.string,
  }).isRequired,
  /** Callback function to close the drawer */
  onClose: PropTypes.func.isRequired,
};

const EditReturn = ({ onClose, returnData = {} }) => {
  // Determine which component to render based on status
  const status = returnData?.status;

  if (status === 'Pending') {
    return <EditFilingRequest returnData={returnData} onClose={onClose} />;
  } else if (status === 'Active' || status === 'Expired') {
    return <EditFilingCalendar returnData={returnData} onClose={onClose} />;
  } else {
    // Default fallback
    return <EditFilingCalendar returnData={returnData} onClose={onClose} />;
  }
};

EditReturn.propTypes = {
  onClose: PropTypes.func.isRequired,
  returnData: PropTypes.object,
};

export default EditReturn;
