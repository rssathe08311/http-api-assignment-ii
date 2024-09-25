const http = require('http');

const responseHandler = require('./responses.js');
const { parse } = require('path');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getCSS,
  '/getUsers': responseHandler.getUsers,
  '/notReal': responseHandler.notFound,
  '/addUser': responseHandler.addUser,
}

const handlePost = (request, response, parsedUrl) => {
    if(parsedUrl.pathname === '/addUser') {
        paseBody(request, response, responseHandler.addUser);
    }
    else{
        responseHandler.notFound(request, response);
    }
}

const onRequest = (request, response) => {
  // parse url into individual parts
  // returns an object of url parts by name
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  if(request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  }
  else if(['GET', 'HEAD'].includes(request.method)) {
    handleHead(request, response, parsedUrl);
  }
  else {
    responseHandler.notFound(request, response);
  }


  http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`)
  });
}