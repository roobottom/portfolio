//appends unix datetime now to the end of input string
function appendtime(input) {
  return input + Date.now()
}
module.exports = appendtime;
