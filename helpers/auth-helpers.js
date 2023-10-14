const getUser = (req) => {
  //console.log(req.user);
  return req.user || null;
};
// passport isAuthenticated()
const ensureAuthenticated = (req) => {
  return req.isAuthenticated(); 
  // whether the value req.user is set
};

module.exports = {
  getUser,
  ensureAuthenticated,
};
