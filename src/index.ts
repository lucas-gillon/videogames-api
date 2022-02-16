import request from "@fewlines-education/request";
import express from "express";
import nunjucks from "nunjucks";

const app = express();

app.use(express.static("public"));

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
app.set("view engine", "njk");

app.get("/", (req, response) => {
  request("http://videogame-api.fly.dev/platforms", (error, body) => {
    if (error) {
      throw error;
    }
    const platformsList = JSON.parse(body);

    response.render("listOfPlatforms", { platforms: platformsList.platforms });
  });
});

app.get("/platform/:id", (req, response) => {
  const routeParameters = req.params.id;
  console.log(routeParameters);
  request(`http://videogame-api.fly.dev/games/platforms/${routeParameters}`, (error, body) => {
    if (error) {
      throw error;
    }
    const platform = JSON.parse(body);
    console.log(platform);

    response.render("platformName", { games: platform.games });
  });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
