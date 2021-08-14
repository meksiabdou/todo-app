const userData = (user , token = null) => {

  const _user =  {
    id: user.id,
    token: token,
    fullname: user.fullname,
    email: user.email,
    username: user.username,
    active : user.active,
    created_at: user.created_at,
    updated_at : user.updated_at,
  };

  return _user;

};

module.exports = {
  userData,
};
