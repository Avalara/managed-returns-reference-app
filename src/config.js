const ENVIRONMENTS = {
  SANDBOX: {
    CRR_URL: 'https://returns-api.sbx.avalara.com/graphql',
    TOKEN_URL: 'https://ai-sbx.avlr.sh/connect/token',
  },
  QA: {
    CRR_URL: 'https://returns-api.gamma.qa.us-west-2.aws.avalara.io/graphql',
    TOKEN_URL: 'https://identity.qa.avalara.io/connect/token',
  },
  LOCAL: {
    CRR_URL: 'https://returns-api.gamma.qa.us-west-2.aws.avalara.io/graphql',
    TOKEN_URL: '/connect/token',
  },
};

const getEnvironmentConfig = () => {
  const origin = window.location.origin;

  if (origin === 'https://returnsreference.sbx.avalara.com') {
    return ENVIRONMENTS.SANDBOX;
  }

  if (origin.includes('localhost')) {
    return ENVIRONMENTS.LOCAL;
  }

  return ENVIRONMENTS.QA;
};

const config = getEnvironmentConfig();

export default config;
