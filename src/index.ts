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
  // console.log(routeParameters);
  request(`http://videogame-api.fly.dev/games/platforms/${routeParameters}`, (error, body) => {
    if (error) {
      throw error;
    }
    const platform = JSON.parse(body);
    // console.log(platform);

    response.render("gamesNames", { games: platform.games });
  });
});

app.get("/games/:slug", (req, response) => {
  const routeSlug = req.params.slug;
  // console.log(routeParameters);
  request(`http://videogame-api.fly.dev/games/slug/${routeSlug}`, (error, body) => {
    if (error) {
      throw error;
    }
    const game = JSON.parse(body);
    console.log(game.games_genres);

    response.render("gameInfos", { game, gameGenres: game.games_genres });
  });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
