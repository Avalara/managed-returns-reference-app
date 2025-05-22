import { theme } from 'antd';

const { useToken } = theme;

const PageHeader = ({ children }) => {
  const { token } = useToken();
  return (
    <div
      style={{
        // backgroundColor: token.colorPrimaryBg,
        // marginLeft: '-24px',
        // padding: '24px',
        // marginRight: '-24px',
        marginBottom: '24px',
        // marginTop: '-24px',
      }}
    >
      {children}
    </div>
  );
};
export default PageHeader;
