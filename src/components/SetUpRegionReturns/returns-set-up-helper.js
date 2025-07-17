export const E_FILE_USERNAME_QUESTION_CODE = 'EfileUsername';
export const E_FILE_PASSWORD_QUESTION_CODE = 'EfilePassword';
export const ADDRESS_LINE_1_QUESTION_CODE = 'AddressLine1';
export const ADDRESS_LINE_2_QUESTION_CODE = 'AddressLine2';
export const CITY_QUESTION_CODE = 'City';
export const REGION_QUESTION_CODE = 'Region';
export const ZIP_CODE_QUESTION_CODE = 'ZipCode';
export const COUNTRY_QUESTION_CODE = 'Country';

export const isEfileUsernameQuestion = (question) =>
  question?.filingQuestionCode === E_FILE_USERNAME_QUESTION_CODE;

export const isEfilePasswordQuestion = (question) =>
  question?.filingQuestionCode === E_FILE_PASSWORD_QUESTION_CODE;

export const isAddressLine1Question = (question) =>
  question?.filingQuestionCode === ADDRESS_LINE_1_QUESTION_CODE;
