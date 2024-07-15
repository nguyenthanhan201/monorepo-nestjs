const addCustomParamToUrl = (url: string, key: string, value: string) => {
  return url + (url.indexOf("?") > 0 ? "&" : "?") + key + "=" + value;
};

export { addCustomParamToUrl };
