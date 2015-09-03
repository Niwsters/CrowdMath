var helper = {
  isError: function (str) {
    return str.substring(0, 4) === 'Error';
  },
  // asyncLoop is for doing for-like loops when async.
  // Thanks to http://stackoverflow.com/questions/4288759/asynchronous-for-cycle-in-javascript/4288992#4288992
  asyncLoop: function (iterations, func, callback) {
    var index = 0,
      done = false,
      loop = {
        next: function () {
          if (done) {
            return;
          }

          if (index < iterations) {
            index++;
            func(loop);

          } else {
            done = true;
            if(callback) callback();
          }
        },

        iteration: function () {
          return index - 1;
        },

        break: function () {
          done = true;
          callback();
        }
      };
    loop.next();
    return loop;
  }
};

module.exports = helper;