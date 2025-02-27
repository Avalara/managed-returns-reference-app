import React, { useState } from 'react';
import { Typography, Modal, Radio, Input, Divider } from 'antd';

const { Text } = Typography;

const POA_SELF = 'self';
const POA_EMAIL = 'email';

const isValidEmail = (email) => {
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  return emailRegex.test(email);
};

const PoaModal = ({ open, setOpenState }) => {
  const [poaType, setPoaType] = useState('');
  const [signeeEmail, setSigneeEmail] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const signeeEmailIsValid = isValidEmail(signeeEmail);

  const handlePoaAuthSelection = () => {
    setConfirmLoading(true);
    if (poaType === POA_SELF) {
      console.log('Open POA pdf');
    } else if (poaType === POA_EMAIL) {
      console.log('Send email to signee', signeeEmail);
    }
    setConfirmLoading(false);
    setOpenState(false);
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
      onCancel={() => setOpenState(false)}
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
