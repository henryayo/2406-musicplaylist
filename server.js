const express = require("express");
const http = require("http");
const PORT = process.env.PORT || 3000;

const app = express();

//Middleware
app.use(express.static(__dirname + "/public"));

//Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/mytunes", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/mytunes.html", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/index.html", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/songs", (request, response) => {
  console.log(request.path);
  let songTitle = request.query.title;
  let titleWithPlusSigns = songTitle.trim().replace(/\s/g, "+");
  console.log("titleWithPlusSigns: " + titleWithPlusSigns);

  console.log("query: " + JSON.stringify(request.query));
  if (!songTitle) {
    response.json({ message: "Please enter Song Title" });
    return;
  }

  const options = {
    method: "GET",
    hostname: "itunes.apple.com",
    port: null,
    path: `/search?term=${titleWithPlusSigns}&entity=musicTrack&limit=3`,
    headers: {
      useQueryString: true,
    },
  };
 
  http
    .request(options, function (apiResponse) {
      let songData = "";
      apiResponse.on("data", function (chunk) {
        songData += chunk;
      });
      apiResponse.on("end", function () {
        response.contentType("application/json").json(JSON.parse(songData));
      });
    })
    .end();
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else {
    console.log(`Server listening on port: ${PORT}`);
    console.log(`To Test:`);
    console.log("http://localhost:3000/mytunes.html");
    console.log("http://localhost:3000/mytunes");
    console.log("http://localhost:3000/index.html");
    console.log("http://localhost:3000/");
    console.log("http://localhost:3000");
  }
});
