const http = require("node:http");
const url = require("url");
const fs = require("fs");
const querystring = require("querystring");
// const ejs = require("ejs");

// fs.readFileSync("data.json", (err, data) => {
//   if (err) throw err;
//   const stringData = JSON.parse(data);
//   console.log(stringData);
// });
const data = fs.readFileSync("data.json");
let items = JSON.parse(data);

// console.log(items[items.length - 1].id);
let lastindex = items.length === 0 ? 0 : items[items.length - 1].id;

const server = http.createServer((req, res) => {
  const urlParse = url.parse(req.url);
  const reqUrl = urlParse.pathname;
  if (reqUrl == "/" && req.method == "GET") {
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
  } else if (reqUrl == "/items/tasks" && req.method == "POST") {
    req.on("data", (data) => {
      const search = urlParse.search;
      // console.log(urlParse);
      if (search) {
        const [, query] = urlParse.search.split("?");
        // console.log(query);
        const id = querystring.parse(query).id;
        if (id) {
          const jsondata = JSON.parse(data);
          const task = jsondata.task;
          // console.log(task);

          if (!task) {
            const message = { message: "no task found in body request!" };

            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify(message, null, 2));
          } else {
            items.forEach((item, index) => {
              if (item.id == id) {
                items[index].tasks.push(task);
              }
            });
            const jsonitems = JSON.stringify(items, null, 2);
            fs.writeFile("./data.json", jsonitems, (err) => {
              if (err) {
                const message = { message: "could not persist data!" };
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify(message, null, 2));
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(jsonitems);
              }
            });
          }
        } else {
          const message = { message: "no id parameter!" };

          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify(message, null, 2));
        }
      } else {
        const message = { message: "no query parameter!" };

        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify(message, null, 2));
      }
    });
  } else if (reqUrl == "/items" && req.method == "PUT") {
    req.on("data", (data) => {
      const search = urlParse.search;
      if (search) {
        const [, query] = urlParse.search.split("?");
        const id = querystring.parse(query).id;
        if (id) {
          const jsondata = JSON.parse(data);
          const title = jsondata.title;

          if (!title) {
            const message = { message: "no title found in body request!" };

            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify(message, null, 2));
          } else {
            items.forEach((item, index) => {
              if (item.id == id) {
                items[index].title = title;
              }
            });
            const jsonitems = JSON.stringify(items, null, 2);
            fs.writeFile("./data.json", jsonitems, (err) => {
              if (err) {
                const message = { message: "could not persist data!" };
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify(message, null, 2));
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(jsonitems);
              }
            });
          }
        } else {
          const message = { message: "no id parameter!" };
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify(message, null, 2));
        }
      } else {
        const message = { message: "no query parameter!" };
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify(message, null, 2));
      }
    });
  } else if (reqUrl == "/items" && req.method == "DELETE") {
    const search = urlParse.search;
    if (search) {
      const [, query] = urlParse.search.split("?");
      const data = querystring.parse(query);

      items = items.filter((item) => item.id != data.id);
      const jsonitems = JSON.stringify(items, null, 2);
      fs.writeFile("./data.json", jsonitems, (err) => {
        if (err) {
          const message = { message: "could not persist data!" };
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify(message, null, 2));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(jsonitems);
        }
      });
    } else {
      const message = { message: "no query parameter!" };
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify(message, null, 2));
    }
  }
});

server.listen(3000);
