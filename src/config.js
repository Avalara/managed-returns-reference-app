const ENVIRONMENTS = {
  SANDBOX: {
    CRR_URL: 'https://returns-api.platform.raas.sbx.avalara.io/graphql',
    TOKEN_URL: 'https://ai-sbx.avlr.sh/connect/token',
  },
  QA: {
    CRR_URL: 'https://returns-api.foundation.raas.qa.avalara.io/graphql',
    TOKEN_URL: 'https://ai-awsfqa.avlr.sh/connect/token',
  },
  LOCAL: {
    CRR_URL: 'https://returns-api.foundation.raas.qa.avalara.io/graphql',
    TOKEN_URL: '/connect/token',
  },
};

const getEnvironmentConfig = () => {
  const origin = window.location.origin;

  if (
    origin ===
    'https://managed-returns-reference-app-raas.gamma.sbx.us-west-2.aws.avalara.io' // TODO: confirm sbx window origin
  ) {
    return ENVIRONMENTS.SANDBOX;
  }

  if (origin.includes('localhost')) {
    return ENVIRONMENTS.LOCAL;
  }

  return ENVIRONMENTS.QA;
};

const config = getEnvironmentConfig();

export default config;
