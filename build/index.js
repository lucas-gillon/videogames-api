"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var nunjucks_1 = __importDefault(require("nunjucks"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var app = (0, express_1.default)();
app.use(express_1.default.static("public"));
nunjucks_1.default.configure("views", {
    autoescape: true,
    express: app,
});
app.set("view engine", "njk");
app.get("/", function (request, response) {
    response.redirect("/homepage");
});
app.get("/homepage", function (request, response) {
    response.render("home-page");
});
app.get("/platformPages", function (req, response) {
    var pageNumber = parseInt(String(req.query.page));
    (0, node_fetch_1.default)("http://videogame-api.fly.dev/platforms/?page=".concat(pageNumber))
        .then(function (response) { return response.json(); })
        .then(function (platformsList) {
        return response.render("listOfPlatforms", {
            pageNumber: pageNumber,
            platforms: platformsList.platforms,
        });
    });
});
app.get("/randomGame", function (req, response) {
    function entierAleatoire(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    var entier = entierAleatoire(0, 19);
    (0, node_fetch_1.default)("http://videogame-api.fly.dev/games")
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var routeSlug = data.games[entier].slug;
        (0, node_fetch_1.default)("http://videogame-api.fly.dev/games/slug/".concat(routeSlug))
            .then(function (response) { return response.json(); })
            .then(function (game) {
            return response.render("random-game", {
                game: game,
                gamePlatforms: game.games_platforms,
                gameGenres: game.games_genres,
                screenshots: game.game_screenshots,
            });
        });
    });
});
app.get("/platform/:slug", function (req, response) {
    var platformSlug = req.params.slug;
    var pageNumber = parseInt(String(req.query.page));
    (0, node_fetch_1.default)("http://videogame-api.fly.dev/platforms/slug/".concat(platformSlug))
        .then(function (response) { return response.json(); })
        .then(function (platform) {
        var platformID = platform.id;
        var platformName = platform.name;
        (0, node_fetch_1.default)("http://videogame-api.fly.dev/games/platforms/".concat(platformID, "?page=").concat(pageNumber))
            .then(function (response) { return response.json(); })
            .then(function (data) {
            response.render("gamesNames", {
                platformName: platformName,
                pageNumber: pageNumber,
                platformSlug: platformSlug,
                games: data.games,
            });
        });
    });
});
app.get("/games/:slug", function (req, response) {
    var routeSlug = req.params.slug;
    (0, node_fetch_1.default)("http://videogame-api.fly.dev/games/slug/".concat(routeSlug))
        .then(function (response) { return response.json(); })
        .then(function (game) {
        return response.render("gameInfos", {
            game: game,
            gamePlatforms: game.games_platforms,
            gameGenres: game.games_genres,
            screenshots: game.game_screenshots,
        });
    });
});
app.get("/allGames", function (req, response) {
    var pageNumber = parseInt(String(req.query.page));
    (0, node_fetch_1.default)("http://videogame-api.fly.dev/games?page=".concat(pageNumber))
        .then(function (response) { return response.json(); })
        .then(function (gamesList) {
        return response.render("all-games", {
            pageNumber: pageNumber,
            games: gamesList.games,
        });
    });
});
app.listen(3000, function () {
    console.log("Server started on http://localhost:3000");
});
//# sourceMappingURL=index.js.map