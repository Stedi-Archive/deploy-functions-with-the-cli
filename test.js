const fs = require("fs/promises");
const index = require("./index.js");

const main = async () => {
  // Read the test data from event.json. The test data is a regular JSON
  // object, so you don’t have to read it from a file, but it’s easier
  // to use a file when you’re calling code that’s uploaded to Stedi
  // Functions, so we might as well use the same file when calling the
  // code locally.
  const fileContents = await fs.readFile("event.json");
  const testData = JSON.parse(fileContents);

  const result = await index.handler(testData);
  console.log(result);
}

main();