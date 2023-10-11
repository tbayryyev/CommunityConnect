//Here you will require route files and export the constructor method as shown in lecture code and worked in previous labs.
const routesAPI = require('./routesAPI');

const constructorMethod = (app) => {
  app.use('/', routesAPI);

  app.use('*', (req, res) => {
    res.status(404).json({ error: "Page not found" })
  });

};

module.exports = constructorMethod;