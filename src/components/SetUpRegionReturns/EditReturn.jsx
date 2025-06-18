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
  cancelFilingCalendarRequest,
  updateFilingCalendarRequest,
  cancelFilingCalendarRequest as CANCEL_FILING_CALENDAR_REQUEST,
  updateFilingCalendarRequest as UPDATE_FILING_CALENDAR_REQUEST,
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
      // taxAuthorityName: returnData?.description || '',
      ...formattedFormValues,
    };

    updateFilingCalendarRequest({
      variables: {
        companyId: parseInt(companyId),
        id: parseFloat(returnData.id),
        filingRequestStatusId: 'CHANGEREQUEST',
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

const EditFilingCalendar = ({ returnData }) => {
  const { companyId } = useOutletContext();

  // Prepare query variables
  const queryVariables = {
    companyId: parseInt(companyId),
    taxFormCode: returnData?.taxFormCode,
    filingCalendarId: parseInt(returnData.id),
  };

  // Get answers for filing calendar using the enhanced query
  const {
    loading: loadingFilingCalendarData,
    error: didErrorFilingCalendarData,
    data: filingCalendarData,
  } = useQuery(filingCalendarRequestModel, {
    variables: queryVariables,
    skip: !returnData.id || !companyId || !returnData?.taxFormCode,
  });

  const requestModel =
    filingCalendarData?.filingCalendarRequests?.value
      ?.filingCalendarRequestModel;
  const data = requestModel?.data;
  const answers = data?.answers?.reduce((acc, answer) => {
    acc[answer.filingQuestionCode] = answer.answer;
    return acc;
  }, {});

  if (didErrorFilingCalendarData) {
    return null;
  }
  console.log('EditFilingCalendar - answers:', answers);

  return (
    <div>
      <ReturnForm
        loading={loadingFilingCalendarData}
        companyId={companyId}
        region={returnData?.region}
        taxFormCode={returnData?.taxFormCode}
        initialValues={{
          ...answers,
          filingFrequency: data?.filingFrequencyId,
          filingPeriod: data?.effDate,
        }}
      />
    </div>
  );
};

EditFilingCalendar.propTypes = {
  returnData: PropTypes.object.isRequired,
};

const EditReturn = ({ open, onClose, returnData = {} }) => {
  const handleSubmit = () => {
    // TODO: Implement save functionality
    onClose();
  };

  // Determine which component to render based on status
  const renderContent = () => {
    const status = returnData?.status;

    if (status === 'Pending') {
      return <EditFilingRequest returnData={returnData} onClose={onClose} />;
    } else if (status === 'Active' || status === 'Expired') {
      return <EditFilingCalendar returnData={returnData} />;
    } else {
      // Default fallback
      return <EditFilingCalendar returnData={returnData} />;
    }
  };

  return renderContent();

  // return (

  // <Drawer
  //   title={
  //     <Space direction="vertical" size={0} style={{ width: '100%' }}>
  //       <div>{`${returnData?.taxFormName || 'Return'}`}</div>
  //       <Text type="secondary" style={{ fontSize: '14px' }}>
  //         {returnData?.description || ''}
  //       </Text>
  //     </Space>
  //   }
  //   placement="right"
  //   onClose={onClose}
  //   open={open}
  //   width={600}
  //   extra={
  //     <Space>
  //       <Button onClick={onClose}>Cancel</Button>
  //       <Button type="primary" onClick={handleSubmit}>
  //         Save
  //       </Button>
  //     </Space>
  //   }
  // >
  //   {renderContent()}
  // {
  /*</Drawer>*/
  // }
  // );
};

EditReturn.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  returnData: PropTypes.object,
};

export default EditReturn;
