const http = require("node:http");
const url = require("url");
const fs = require("fs");
// const ejs = require("ejs");

// fs.readFileSync("data.json", (err, data) => {
//   if (err) throw err;
//   const stringData = JSON.parse(data);
//   console.log(stringData);
// });
const data = fs.readFileSync("data.json");
let items = JSON.parse(data);
let lastindex = items.length === 0 ? 0 : items[items.length1].id;

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url).pathname;
  if (reqUrl == "/" && req.method == "GET") {
    // res.write("Hello");
    // res.end();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(items, null, 2));
  } else if (reqUrl == "/items" && req.method == "POST") {
    // res.write();
    // res.end("from home");
    req.on("data", (data) => {
      const jsondata = JSON.parse(data);

      const title = jsondata.title;
      //   console.log(title);
      if (title) {
        items.push({ id: ++lastindex, title, tasks: [] });
        // console.log(items);

        const jsonitems = JSON.stringify(items, null, 2);
        fs.writeFile("data.json", jsonitems, (err) => {
          //   console.log(items);
          if (err) {
            const message = { message: "could not persist data!" };
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify(message, null, 2));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            // console.log(JSON.stringify(items, null, 2));
            res.end(jsonitems);
          }
        });
      } else {
        const message = { message: "no title in body request!" };

        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify(message, null, 2));
      }
    });
  }
});

server.listen(3000);
