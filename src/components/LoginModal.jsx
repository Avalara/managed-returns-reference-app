import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
import { Input, Modal } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const LoginModal = ({
  isLoginModalOpen,
  setIsLoginModalOpen,
  setIsLoggedIn,
}) => {
  const [clientId, setClientId] = useState(localStorage.getItem('clientId'));
  const [clientSecret, setClientSecret] = useState(
    localStorage.getItem('clientSecret '),
  );
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (!clientId) {
      console.log('not logged in');
      setIsLoginModalOpen(true);
    }
  }, [clientId, setIsLoginModalOpen]);

  return (
    <Modal
      title="Client credentials"
      open={isLoginModalOpen}
      closable={false}
      maskClosable={false}
      onOk={() => {
        localStorage.setItem('clientId', clientId);
        localStorage.setItem('clientSecret', clientSecret);
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
      }}
      onCancel={() => setIsLoginModalOpen(false)}
      okButtonProps={{ disabled: !clientId || !clientSecret }}
    >
      <Input
        value={clientId}
        onChange={(e) => {
          setClientId(e.target.value);
        }}
        placeholder="Client Id"
      />
      <br />
      <br />
      <Input.Password
        value={clientSecret}
        onChange={(e) => {
          setClientSecret(e.target.value);
        }}
        placeholder="Client Secret"
        iconRender={(passwordVisible) =>
          passwordVisible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
        visibilityToggle={{
          visible: passwordVisible,
          onVisibleChange: setPasswordVisible,
        }}
      />
    </Modal>
  );
};

LoginModal.propTypes = {
  isLoginModalOpen: PropTypes.bool.isRequired,
  setIsLoginModalOpen: PropTypes.func.isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default LoginModal;
