var helper = {
  isError: function (str) {
    return str.substring(0,4) === 'Error';
  }
};

module.exports = helper;