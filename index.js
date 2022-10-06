const axios = require("axios");

exports.handler = async (event) => {  
  // event should contain the name of the topic to search for, e.g.
  // {
  //   "topic": "Electronic_data_interchange"
  // }

  const response = await axios.get(
    "https://en.wikipedia.org/w/api.php?action=query&prop=extracts" +   // Find an article on Wikipedia.
    "&titles=" + event.topic +    // Look for the topic passed to the function.
    "&explaintext=1" +            // Inlcude the article as plain text (instead of HTML).
    "&format=json"                // Format the response body as JSON.
  );
  const pages = response.data.query.pages;
  const key = Object.keys(pages)[0];  // The page key in Wikipedia’s response is unpredictable. We
                                      // just pick the first key in the pages-object. We only expect
                                      // a single page anyway.
  const extract = pages[key].extract;
  return extract;
};