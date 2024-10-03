console.log('import.meta.env.PROD', import.meta.env.PROD);

const config = {
  GRAPHQL_URL: import.meta.env.PROD
    ? 'https://returns-api.platform.raas.sbx.avalara.io/graphql'
    : 'https://returns-api.foundation.raas.qa.avalara.io/graphql',
  AI_URL: import.meta.env.PROD
    ? 'https://ai-sbx.avlr.sh/connect/token'
    : 'https://ai-awsfqa.avlr.sh/connect/token',
};

export default config;
