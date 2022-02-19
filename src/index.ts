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

    response.render("listOfPlatforms", {
      pageNumber,
      platforms: platformsList.platforms,
    });
  });
});

app.get("/randomGame", (req, response) => {
  request(`http://videogame-api.fly.dev/games`, (error, body) => {
    const data = JSON.parse(body);

    function entierAleatoire(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const entier = entierAleatoire(0, 19);
    const routeSlug = data.games[entier].slug;

    request(`http://videogame-api.fly.dev/games/slug/${routeSlug}`, (error, body) => {
      if (error) {
        throw error;
      }
      const game = JSON.parse(body);

      response.render("random-game", {
        game,
        gamePlatforms: game.games_platforms,
        gameGenres: game.games_genres,
        screenshots: game.game_screenshots,
      });
    });
  });
});

app.get("/platform/:slug", (req, response) => {
  const platformSlug = req.params.slug;
  const pageNumber = parseInt(String(req.query.page));
  request(`http://videogame-api.fly.dev/platforms/slug/${platformSlug}`, (error, body) => {
    if (error) {
      throw error;
    }
    const platform = JSON.parse(body);
    const platformID = platform.id;
    request(`http://videogame-api.fly.dev/games/platforms/${platformID}?page=${pageNumber}`, (error, body) => {
      if (error) {
        throw error;
      }
      const data = JSON.parse(body);

      response.render("gamesNames", {
        pageNumber,
        platformSlug,
        games: data.games,
      });
    });
  });
});

app.get("/games/:slug", (req, response) => {
  const routeSlug = req.params.slug;
  request(`http://videogame-api.fly.dev/games/slug/${routeSlug}`, (error, body) => {
    if (error) {
      throw error;
    }
    const game = JSON.parse(body);

    response.render("gameInfos", {
      game,
      gamePlatforms: game.games_platforms,
      gameGenres: game.games_genres,
      screenshots: game.game_screenshots,
    });
  });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
