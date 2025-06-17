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

import React, { useState } from 'react';
import { Form, Button, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';
import { verifyEFileCredentialStatus as VERIFY_EFILE_CREDENTIAL_STATUS } from '../../graphql/queries';
import { verifyEFileCredential as VERIFY_EFILE_CREDENTIAL } from '../../graphql/mutations';
import ReturnQuestion from './ReturnQuestion.jsx';
import {
  E_FILE_PASSWORD_QUESTION_CODE,
  E_FILE_USERNAME_QUESTION_CODE,
  isEfilePasswordQuestion,
  isEfileUsernameQuestion,
} from './returns-set-up-helper.js';

const { Text } = Typography;

// Define constants
const MAX_VERIFICATION_ATTEMPTS = 8;

const EfileCredentialVerification = ({
  form,
  companyId,
  taxFormCode,
  standardQuestions,
  region,
  dorWebsite,
}) => {
  const [status, setStatus] = useState(''); // 'success_login', 'failed_login', 'error', 'warning', 'validating'
  const [attempts, setAttempts] = useState(0);
  const [metadata, setMetadata] = useState({});

  const [verifyCredentials] = useMutation(VERIFY_EFILE_CREDENTIAL, {
    fetchPolicy: 'no-cache',
  });

  const { refetch: checkCredentialStatus } = useQuery(
    VERIFY_EFILE_CREDENTIAL_STATUS,
    {
      fetchPolicy: 'no-cache',
      skip: true,
    }
  );

  // Derive help text based on current state
  const getHelpText = () => {
    switch (status) {
      case 'validating':
        return attempts > 0
          ? `Verifying credentials (attempt ${attempts}/${MAX_VERIFICATION_ATTEMPTS})...`
          : 'Verifying your login credentials...';
      case 'success_login':
        return 'You have successfully verified your login credentials.';
      case 'failed_login':
        return 'The login credentials you provided are not valid. Please try again.';
      case 'error':
        return 'Something went wrong. Please try again';
      case 'warning':
        return 'Verification timed out. Please try again or save without validation.';
      default:
        return '';
    }
  };

  const getValidationStatus = () => {
    switch (status) {
      case 'success_login':
        return 'success';
      case 'failed_login':
        return 'error';
      default:
        return status;
    }
  };
  // Helper to get credential key
  const getCredentialKey = (userName, password) => `${userName}:${password}`;

  const handleTestEFileLogin = async () => {
    try {
      const values = form.getFieldsValue();
      const userName = values[E_FILE_USERNAME_QUESTION_CODE];
      const password = values[E_FILE_PASSWORD_QUESTION_CODE];

      // Check if username or password is undefined
      if (!userName || !password) {
        throw new Error('Username or password is undefined');
      }

      const credentialKey = getCredentialKey(userName, password);

      // Check if we're using the same credentials
      const isSameCredentials = metadata[credentialKey]?.jobId;
      let jobId = isSameCredentials || null;

      // Update verification state to show we're validating
      setStatus('validating');
      setAttempts(0);

      if (!isSameCredentials) {
        const { data } = await verifyCredentials({
          variables: {
            companyId: Number(companyId),
            input: {
              taxFormCode: taxFormCode || '',
              userName,
              password,
            },
          },
        });

        jobId = data?.verifyEFileCredential?.jobId;
        if (!jobId) {
          throw new Error('Failed to get job ID');
        }

        // Update metadata with new job ID and credentials
        setMetadata((prev) => ({
          ...prev,
          [credentialKey]: {
            jobId,
          },
        }));
      }

      let currentAttempts = 0;

      const checkStatus = async () => {
        currentAttempts++;
        setAttempts(currentAttempts);

        const { data } = await checkCredentialStatus({
          companyId: Number(companyId),
          jobId: parseFloat(jobId),
        });

        const statusResponse = data?.verifyEFileCredentialStatus;

        if (statusResponse?.status === 'SUCCESS') {
          setStatus(
            statusResponse.loginSuccess ? 'success_login' : 'failed_login'
          );
          return true;
        }

        if (currentAttempts >= MAX_VERIFICATION_ATTEMPTS) {
          setStatus('warning');
          return true;
        }

        return false;
      };

      const intervalId = setInterval(async () => {
        const shouldStop = await checkStatus();
        if (shouldStop) {
          clearInterval(intervalId);
        }
      }, 2000);

      // Initial check
      await checkStatus();
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <>
      <Text style={{ marginBottom: 24, display: 'block' }}>
        Enter your{' '}
        <a href={dorWebsite} target="_blank" rel="noreferrer">
          {region} DOR website{' '}
        </a>{' '}
        login details so Avalara can file for you.
      </Text>

      {/* Render username field using ReturnQuestion */}
      {standardQuestions.find(isEfileUsernameQuestion) && (
        <ReturnQuestion
          {...standardQuestions.find(isEfileUsernameQuestion)}
          hasFeedback={!!status}
          validateStatus={getValidationStatus()}
        />
      )}

      {/* Render password field using ReturnQuestion */}
      {standardQuestions.find(isEfilePasswordQuestion) && (
        <ReturnQuestion
          {...standardQuestions.find(isEfilePasswordQuestion)}
          dataType="PASSWORD"
          hasFeedback={!!status}
          validateStatus={getValidationStatus()}
          statusText={status ? getHelpText() : undefined}
        />
      )}
      <Form.Item>
        <Button
          type="default"
          onClick={handleTestEFileLogin}
          loading={status === 'validating'}
        >
          Test your login
        </Button>
      </Form.Item>
    </>
  );
};

EfileCredentialVerification.propTypes = {
  form: PropTypes.object.isRequired,
  companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  taxFormCode: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  dorUrl: PropTypes.string,
  standardQuestions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default EfileCredentialVerification;
