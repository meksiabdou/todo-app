/// 30** code error
/// 20** code success
const Codes = {
  '3000': {
    code: 3000,
    description: 'key not exist',
    text: 'noInternet',
  },
  '3001': {
    code: 3001,
    description: 'There is a problem!',
    text: 'noInternet',
  },
  '3002': {
    code: 3002,
    description: 'User information is not valid',
    text: 'YourInfoNotValid',
  },
  '3004': {
    code: 3004,
    description: 'Error The new account registration was not completed',
    text: 'RegisterFiled',
  },
  '3006': {
    code: 3006,
    description: 'Email Already Used or Invalid',
    text: 'EmailNoValid',
  },
  '3008': {
    code: 3008,
    description: 'The {key} field is required.',
    text: 'FieldEmpty',
  },
  '3009': {
    code: 3009,
    description: 'Password should be more than 8 characters',
    text: 'MinPassWord',
  },
  '3010': {
    code: 3010,
    description: '',
    text: 'noInternet',
  },
  '3012': {
    code: 3012,
    description: 'Update unsuccessfully',
    text: 'youInfoUpdatedUnsuccess',
  },
  '2002': {
    code: 2002,
    description: 'Edited successfully',
    text: 'youInfoUpdated',
  },
  '2004': {
    code: 2004,
    description: 'Add successfully',
    text: 'addIsSuccess',
  },
  '2003': {
    code: 2003,
    description: 'Account Successfully Created',
    text: 'youAccountCreated',
  },
};

export default Codes;
