import { useRouteError, useNavigate } from 'react-router-dom';
import {Button, Result} from "antd";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error(error);

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary" onClick={() => navigate('/')}>Back Home</Button>}
    />
  );
}
