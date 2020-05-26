// eslint-disable-next-line import/no-extraneous-dependencies
function getFakeCaptcha(req, res) {
  return res.json('captcha-xxx');
}

export default {
  'POST  /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;

    if (password === '123' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }

    if (password === '123' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }

    if (type === 'mobile') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'GET  /api/login/captcha': getFakeCaptcha,
};
