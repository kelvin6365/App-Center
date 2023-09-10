import { ResponseStatus } from './response.status';

export class ResponseCode {
  static readonly STATUS_1000_SUCCESS = new ResponseStatus(
    1000,
    'Success',
    'Success'
  );

  static readonly STATUS_1010_NOT_ENABLED = new ResponseStatus(
    1010,
    'Not Enabled',
    'Not Enabled'
  );
  static readonly STATUS_1011_NOT_FOUND = new ResponseStatus(
    1011,
    'Not Found',
    'Not Found'
  );
  static readonly STATUS_1012_FAIL_TO_CREATE = (message) =>
    new ResponseStatus(1012, 'Fail to create', message.toString());
  static readonly STATUS_1013_FAIL_TO_INSTALL = new ResponseStatus(
    1013,
    'Fail to install',
    'Fail to install'
  );
  static readonly STATUS_1014_INVALID_INSTALL_PASSWORD = new ResponseStatus(
    1014,
    'Fail to install',
    'Invalid install password'
  );
  static readonly STATUS_1015_FAIL_TO_DELETE = new ResponseStatus(
    1015,
    'Fail to delete',
    'Fail to delete'
  );
  static readonly STATUS_9000_BAD_REQUEST = new ResponseStatus(
    9000,
    'Bad Request',
    'Try again later!'
  );
  static readonly STATUS_9002_SYSTEM_ERROR = new ResponseStatus(
    9001,
    'System Error',
    'Try again later!'
  );
  static readonly STATUS_9003_UNSUPPORTED_PARAMS_TYPE = (
    type: string,
    value: string
  ) =>
    new ResponseStatus(
      9003,
      `Unsupported type for ${type}`,
      `The  '${value}' Not Allowed.`
    );
  static readonly STATUS_9004_MISSING_PARAMS = (
    types: string[],
    values: string[]
  ) =>
    new ResponseStatus(
      9004,
      `Missing types ${types.join(',')}`,
      `The '${values.join(',')}' are missing.`
    );

  //Role
  static readonly STATUS_2000_ROLE_NOT_EXIST = new ResponseStatus(
    2000,
    'Role Not Found',
    'Role not exist.'
  );

  //App Version
  static readonly STATUS_3000_APP_API_KEY_NOT_MATCH = new ResponseStatus(
    3000,
    'App Api Key Not Match',
    'App Api Key not match.'
  );

  //Category
  static readonly STATUS_4000_CATEGORY_NOT_EXIST = new ResponseStatus(
    4000,
    'Category Not Found',
    'Category not exist.'
  );
  static readonly STATUS_4001_CATEGORY_EXIST = new ResponseStatus(
    4001,
    'Category Found',
    'Category exist.'
  );

  //Advertisement
  static readonly STATUS_5000_ADVERTISEMENT_NOT_EXIST = new ResponseStatus(
    5000,
    'Advertisement Not Found',
    'Advertisement not exist.'
  );

  //Gallery
  static readonly STATUS_6000_GALLERY_NOT_EXIST = new ResponseStatus(
    6000,
    'Gallery Not Found',
    'Gallery not exist.'
  );

  //7*** File
  static readonly STATUS_7000_UNSUPPORTED_FILE_TYPE = (mimetype) =>
    new ResponseStatus(
      7000,
      `Unsupported file type ${mimetype}`,
      'File Type Not Allowed.'
    );

  //8*** User relayed
  static readonly STATUS_8000_UNAUTHORIZED = new ResponseStatus(
    8000,
    'Unauthorized',
    'Token unauthorized.'
  );
  static readonly STATUS_8001_USER_USERNAME_OR_PASSWORD_NOT_MATCH =
    new ResponseStatus(8001, 'Login Fail', 'Username or Password Not Match.');
  static readonly STATUS_8002_FORGET_PASSWORD_USER_NOT_FOUND =
    new ResponseStatus(
      8002,
      'Forget Password user not found',
      'this email is not registered'
    );
  static readonly STATUS_8003_PERMISSION_DENIED = new ResponseStatus(
    8003,
    'Permission Denied',
    'No Permission to call this action.'
  );
  static readonly STATUS_8004_USER_NOT_EXIST = new ResponseStatus(
    8004,
    'User Not Found',
    'User not exist.'
  );
  static readonly STATUS_8013_USER_ALREADY_EXIST = new ResponseStatus(
    8013,
    'User Already Exists',
    'User already exist.'
  );
}
