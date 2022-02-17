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
  const pageNumber = req.query.page;
  request(`http://videogame-api.fly.dev/platforms/`, (error, body) => {
    if (error) {
      throw error;
    }
    const platformsList = JSON.parse(body);
    // console.log(platformsList);

    response.render("listOfPlatforms", { pageNumber, platforms: platformsList.platforms });
  });
});

app.get("/platformPages", (req, response) => {
  const pages = req.query.page;
  console.log(pages);
  if (pages === undefined) {
    response.render("/");
  } else {
    request(`http://videogame-api.fly.dev/platforms/?page=${pages}`, (error, body) => {
      if (error) {
        throw error;
      }
      const platformsList = JSON.parse(body);

      response.render("listOfPlatforms", { pages, platforms: platformsList.platforms });
    });
  }
});

app.get("/platform/:id", (req, response) => {
  const platformID = req.params.id;
  request(`http://videogame-api.fly.dev/games/platforms/${platformID}`, (error, body) => {
    if (error) {
      throw error;
    }
    const platform = JSON.parse(body);
    // console.log(platform.games);

    response.render("gamesNames", { games: platform.games });
  });
});

app.get("/games/:slug", (req, response) => {
  const routeSlug = req.params.slug;
  request(`http://videogame-api.fly.dev/games/slug/${routeSlug}`, (error, body) => {
    if (error) {
      throw error;
    }
    const game = JSON.parse(body);

    response.render("gameInfos", { game, gameGenres: game.games_genres, screenshots: game.game_screenshots });
  });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
