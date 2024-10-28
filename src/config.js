const origin = window.location.origin;

console.log('origin', origin);

const config = {
  CRR_URL:
    origin === ''
      ? 'https://returns-api.platform.raas.sbx.avalara.io/graphql'
      : 'https://returns-api.foundation.raas.qa.avalara.io/graphql',
  TOKEN_URL:
    origin === ''
      ? 'https://ai-sbx.avlr.sh/connect/token'
      : 'https://ai-awsfqa.avlr.sh/connect/token',
};

export default config;
