/* eslint-disable prettier/prettier */
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
  response.redirect("/platformPages?page=1");
});

app.get("/platformPages", (req, response) => {
  const pageNumber = parseInt(String(req.query.page));
  request(`http://videogame-api.fly.dev/platforms/?page=${pageNumber}`, (error, body) => {
    if (error) {
      throw error;
    }
    const platformsList = JSON.parse(body);

    response.render("listOfPlatforms", { pageNumber, platforms: platformsList.platforms });

  });
});

app.get("/platform/:id", (req, response) => {
  const platformID = req.params.id;
  const pageNumber = parseInt(String(req.query.page));
  request(`http://videogame-api.fly.dev/games/platforms/${platformID}?page=${pageNumber}`, (error, body) => {
    if (error) {
      throw error;
    }
    const platform = JSON.parse(body);

    response.render("gamesNames", { pageNumber, platformID, games: platform.games });
  });
});

app.get("/games/:slug", (req, response) => {
  const routeSlug = req.params.slug;
  request(`http://videogame-api.fly.dev/games/slug/${routeSlug}`, (error, body) => {
    if (error) {
      throw error;
    }
    const game = JSON.parse(body);

    response.render("gameInfos", { game, gamePlatforms: game.games_platforms, gameGenres: game.games_genres, screenshots: game.game_screenshots });
  });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
