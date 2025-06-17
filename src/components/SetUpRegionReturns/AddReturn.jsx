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
import { Drawer, Form, Button, Space, Typography, Modal, message } from 'antd';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { createFilingCalendarRequests as CREATE_FILING_CALENDAR_REQUESTS } from '../../graphql/mutations';
import { useOutletContext } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ReturnForm from './ReturnForm.jsx';

const { Text } = Typography;

const AddReturn = ({ visible, onClose, taxForm }) => {
  const { companyId } = useOutletContext();
  const childFormRef = useRef();

  const [modal, contextHolder] = Modal.useModal();

  // Create Filing Calendar Requests mutation
  const [createFilingCalendar, { loading: createFilingRequestInProgress }] =
    useMutation(CREATE_FILING_CALENDAR_REQUESTS, {
      onCompleted: (data) => {
        console.log('return success', data);
        message.success('Return successfully saved');
        onClose();
      },
      onError: (error) => {
        message.error(`Error saving return: ${error.message}`);
      },
    });
  const onFinish = (formattedFormValues) => {
    // Create request payload
    const requestData = {
      ...formattedFormValues,
      returnName: taxForm?.taxFormName || '',
      taxFormCode: taxForm?.taxFormCode || '',
      country: taxForm?.country,
      region: taxForm?.region || '',
      taxAuthorityName: taxForm?.description || '',
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
  };

  const handleSubmit = () => {
    if (childFormRef.current) {
      childFormRef.current.getForm().submit(); // Trigger child's form submission
    }
  };

  const handleDrawerClose = () => {
    if (childFormRef.current) {
      if (childFormRef.current.getForm().isFieldsTouched() === true) {
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
    }
  };

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
      <ReturnForm
        ref={childFormRef}
        taxFormCode={taxForm?.taxFormCode}
        region={taxForm?.region}
        companyId={companyId}
        onFinish={onFinish}
      />
      {contextHolder}
    </Drawer>
  );
};

AddReturn.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  accountId: PropTypes.string,
  taxForm: PropTypes.shape({
    description: PropTypes.string,
    taxFormName: PropTypes.string,
    taxFormCode: PropTypes.string,
    region: PropTypes.string,
  }),
};

export default AddReturn;
