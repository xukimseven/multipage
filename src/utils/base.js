import axios from 'axios';

// import qs from 'qs'; // 用于 form-data 的数据请求

export class JsonResponse {
  constructor (res){
    let { data: json } = res;
    this.json = json;
    this.res = res;
  }

  get headers (){
    return this.res.headers;
  }

  get config (){
    return this.res.config;
  }

  get success (){
    let res = this.res;
    return (res.status === 200 || res.status === 201 || res.status === 204);
  }
}

export default class SdkBase {
  constructor (key, baseDomain){
    const API_DOMAIN = `https://${window.location.host}`;
    // const API_DOMAIN = `https://...`;
    this.API_DOMAIN = API_DOMAIN;
    this.key = key;
    this.router = '';
    this.axios = axios.create({ baseURL: baseDomain || API_DOMAIN });
    this.setInterceptorsRequest();
    this.setInterceptorsResponse();
  }

  getPath (path){
    if (this.router.length > 0) {
      return [this.router, path].join('/');
    }
    return path;
  }

  setInterceptorsResponse (){
    this.axios.interceptors.response.use(
      (response) => {
        let resp = new JsonResponse(response);
        // console.log(response);
        if (resp.success) {
          return resp;
        }
        throw new Error(resp.json.error);
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  setInterceptorsRequest (){
    this.axios.interceptors.request.use(
      config => {
        config.headers['Content-Type'] = `application/x-www-form-urlencoded`;
        // console.log('before request', config);
        return config;
      },
      err => {
        return Promise.reject(err);
      });
  }

  _get (url, config){
    return this.axios.get(this.getPath(url), config);
  }

  _post (url, data, config){
    // return this.axios.post(this.getPath(url), qs.stringify(data), config);
    return this.axios.post(this.getPath(url), data, config);
  }

  _put (url, data, config){
    // return this.axios.put(this.getPath(url), qs.stringify(data), config);
    return this.axios.put(this.getPath(url), data, config);
  }

  _patch (url, data, config){
    // return this.axios.patch(this.getPath(url), qs.stringify(data), config);
    return this.axios.patch(this.getPath(url), data, config);
  }

  _delete (url, config){
    return this.axios.delete(this.getPath(url), config);
  }

  static getCookie (cookieName){
    let arrStr = document.cookie.split('; ');
    let cookie;
    // console.log(arrStr)
    for (let i = 0; i < arrStr.length; i++) {
      let temp = arrStr[i].split('=');
      if (temp[0] === cookieName) {
        cookie = temp[1];
      }
    }
    return cookie;
  }
}
