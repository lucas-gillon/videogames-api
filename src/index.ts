import express from "express";
import nunjucks from "nunjucks";
import fetch from "node-fetch";

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
  fetch(`http://videogame-api.fly.dev/platforms/?page=${pageNumber}`)
    .then((response) => response.json())
    .then((platformsList) =>
      response.render("listOfPlatforms", {
        pageNumber,
        platforms: platformsList.platforms,
      }),
    );
});

app.get("/randomGame", (req, response) => {
  function entierAleatoire(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const entier = entierAleatoire(0, 19);
  fetch(`http://videogame-api.fly.dev/games`)
    .then((response) => response.json())
    .then((data) => {
      const routeSlug = data.games[entier].slug;
      fetch(`http://videogame-api.fly.dev/games/slug/${routeSlug}`)
        .then((response) => response.json())
        .then((game) =>
          response.render("random-game", {
            game,
            gamePlatforms: game.games_platforms,
            gameGenres: game.games_genres,
            screenshots: game.game_screenshots,
          }),
        );
    });
});

app.get("/platform/:slug", (req, response) => {
  const platformSlug = req.params.slug;
  const pageNumber = parseInt(String(req.query.page));
  fetch(`http://videogame-api.fly.dev/platforms/slug/${platformSlug}`)
    .then((response) => response.json())
    .then((platform) => {
      const platformID = platform.id;
      fetch(`http://videogame-api.fly.dev/games/platforms/${platformID}?page=${pageNumber}`)
        .then((response) => response.json())
        .then((data) => {
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
  fetch(`http://videogame-api.fly.dev/games/slug/${routeSlug}`)
    .then((response) => response.json())
    .then((game) =>
      response.render("gameInfos", {
        game,
        gamePlatforms: game.games_platforms,
        gameGenres: game.games_genres,
        screenshots: game.game_screenshots,
      }),
    );
});

app.get("/allGames", (req, response) => {
  const pageNumber = parseInt(String(req.query.page));
  fetch(`http://videogame-api.fly.dev/games?page=${pageNumber}`)
    .then((response) => response.json())
    .then((gamesList) =>
      response.render("all-games", {
        pageNumber,
        games: gamesList.games,
      }),
    );
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
