const http = require("node:http");

const server = http.createServer((req, res) => {
  res.write("Hello");
  res.end();
});

server.listen(3000);
