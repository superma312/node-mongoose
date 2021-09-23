const APIsuccess = (code, msg, data) => {
  return {
    code,
    msg,
    records: data
  };
};

const APIerror = (code, msg) => {
  return {
    code,
    msg
  };
};

module.exports = {
  APIsuccess,
  APIerror
}
