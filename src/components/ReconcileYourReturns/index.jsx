import { useOutletContext } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import timezonePlugin from 'dayjs/plugin/timezone';
import { notification, theme, Layout } from 'antd';

import BreadcrumbMenu from '../../components/BreadCrumbMenu';
import Upper from './Upper';
import Lower from './Lower';

const { Header, Content } = Layout;

dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

const ReconcileYourReturns = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [date, setDate] = useState(dayjs());
  const { companyId } = useOutletContext();
  const [amountDue, setAmountDue] = useState();
  const [returnCount, setReturnCount] = useState();

  const isCurrentPeriod = useMemo(() => {
    return (
      date.year() === dayjs().tz('America/Los_Angeles').year() &&
      date.month() === dayjs().tz('America/Los_Angeles').month()
    );
  }, [date]);

  useEffect(() => {
    const now = dayjs().tz('America/Los_Angeles');
    // Get the 10th of the current month at 5 PM PDT
    const deadline = now.date(10).hour(17).minute(0).second(0);
    const isInFilingWindow = now.isBefore(deadline);

    if (isInFilingWindow && isCurrentPeriod && !!returnCount) {
      notification.info({
        message: "It's time to reconcile",
        description: `You have ${returnCount} returns to review and reconcile for the ${now.format(
          'MMMM YYYY',
        )} filing period. Make sure to reconcile before ${deadline.format(
          'MMMM D',
        )} at 5:00 p.m. PT.`,
        duration: 0,
      });
    }
  }, [isCurrentPeriod, returnCount]);

  const filingPeriodParams = useMemo(() => {
    return getFilingPeriodParameters(date);
  }, [date]);

  return (
    <>
      <div
        style={{
          backgroundColor: 'white',
          marginLeft: '-24px',
          padding: '24px',
        }}
      >
        <BreadcrumbMenu />
        <Content>
          <h1>Reconcile your returns</h1>
          <Upper
            companyId={companyId}
            date={date}
            setDate={setDate}
            amountDue={amountDue}
          />
        </Content>
      </div>
      <Content
        style={{
          margin: 0,
          minHeight: 280,
          borderRadius: borderRadiusLG,
        }}
      >
        <Layout>
          <Lower
            companyId={companyId}
            setAmountDue={setAmountDue}
            setReturnCount={setReturnCount}
            year={filingPeriodParams.year}
            month={filingPeriodParams.month}
            country="US"
          />
        </Layout>
      </Content>
    </>
  );
};

function getFilingPeriodParameters(dayjsObj) {
  const filingPeriod = dayjsObj.subtract(1, 'month');
  return {
    year: filingPeriod.year(),
    month: filingPeriod.month() + 1, // month() returns 0-11
  };
}

export default ReconcileYourReturns;
