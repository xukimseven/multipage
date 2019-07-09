import SdkBase from './base';

export default class CodeLoginApi extends SdkBase {

  call (url){
    return `/api/${url}`;
  }

  /**
   * 登录接口模板
   * @param username
   * @param password
   * @returns {*}
   */
  login (username, password){
    let data = { username, password };
    let url = this.call(`users/user/login/`);
    return this._post(url, data);
  }
}