const { writeFile } = require("node:fs");
const { Buffer } = require("node:buffer");

const data = new Uint8Array(Buffer.from("Hello Node.js"));
console.log(data);
writeFile("message.txt", data, (err) => {
  if (err) throw err;
  console.log("The file has been saved!");
});
