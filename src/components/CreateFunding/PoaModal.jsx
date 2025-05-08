import React, { useState } from 'react';
import { Typography, Modal, Radio, Input, Divider } from 'antd';

const { Text } = Typography;

import { POA_SELF, POA_EMAIL } from '.';

const isValidEmail = (email) => {
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  return emailRegex.test(email);
};

const PoaModal = ({ open, setPoaAuthorization, sendPOAEmail }) => {
  const [poaType, setPoaType] = useState('');
  const [signeeEmail, setSigneeEmail] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const signeeEmailIsValid = isValidEmail(signeeEmail);

  const handlePoaAuthSelection = async () => {
    setConfirmLoading(true);
    if (poaType === POA_EMAIL) {
      const response = await sendPOAEmail({ email: signeeEmail });
      Modal.success({
        content: 'Success',
        onOk: () => {
          window.location.href = '/returns/get-started';
        },
        onCancel: () => {
          window.location.href = '/returns/get-started';
        },
      });
    }
    setConfirmLoading(false);
    setPoaAuthorization(poaType);
  };

  return (
    <Modal
      style={{
        minWidth: '600px',
      }}
      title="Are you authorized to fill out and sign this funding power of attorney?"
      open={open}
      onOk={handlePoaAuthSelection}
      confirmLoading={confirmLoading}
      onCancel={() => (window.location.href = '/returns/get-started')}
      okButtonProps={{
        disabled:
          poaType === '' || (poaType === POA_EMAIL && !signeeEmailIsValid),
      }}
    >
      <Divider />
      <Radio.Group
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
        value={poaType}
        onChange={(e) => setPoaType(e.target.value)}
        options={[
          { value: POA_SELF, label: 'Yes' },
          {
            value: POA_EMAIL,
            label: 'No, someone else at my business signs',
          },
        ]}
      />
      <br />
      <Text disabled={poaType !== POA_EMAIL}>Email address of signee*</Text>
      <Input
        disabled={poaType !== POA_EMAIL}
        value={signeeEmail}
        onChange={(e) => setSigneeEmail(e.target.value)}
      />
      <Divider />
    </Modal>
  );
};

export default PoaModal;
