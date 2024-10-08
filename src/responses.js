const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

// function to get the index page
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });

  if (request.method !== 'HEAD') {
    response.write(index);
  }

  response.end();
};

// function to get css page
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  if (request.method !== 'HEAD') {
    response.write(style);
  }
  response.end();
};

//  object that only exists in memory while application is running
const users = {};

// function to respond with a json object
const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }

  response.end();
};

//  returns list of users and a 200 code
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  if (request.method === 'HEAD') {
    return respondJSON(request, response, 200, {});
  }

  return respondJSON(request, response, 200, responseJSON);
};

const addUser = (request, response) => {
  const { name, age } = request.body;

  let responseCode = 204;

  //  if both feilds are not present an error message will be sent back
  if (!name || !age) {
    const responseJSON = {
      message: 'Name and age are required',
      id: 'missingParams',
    };
    return respondJSON(request, response, 400, responseJSON);
  }

  if (!users[name]) {
    responseCode = 201;
  }

  users[name] = { name, age };
  const responseJSON = {
    message: 'User added or updated successfully',
  };

  // Respond with a 201 Created if a new user was added
  return respondJSON(request, response, responseCode, responseJSON);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };

  if (request.method === 'HEAD') {
    return respondJSON(request, response, 404, {});
  }

  return respondJSON(request, response, 404, responseJSON);
};

// set out public exports
module.exports = {
  getIndex,
  getCSS,
  getUsers,
  addUser,
  notFound,
};
