exports.myMiddleware = (req, res, next) => {
  req.name = 'Micah';
  if (req.name = 'Micah') {
    throw Error('That is a stupid name');
  }
  next();
}

exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
}
