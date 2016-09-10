/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
//

var activeGames = Array();
var roundRemainingSeconds = 30;
var roundsRemaining = 10;
var cities = [
    {name: 'Newmarket, Canada', location:{lat: -34.397, lng: 150.644}}
];
var players = Array();
var timerId = 0;

var lastRoundTimeCheck;

var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};

var gameLoop = function(gameConfig) {
    
    var gameCities = [];
    for(round = 0; round < gameConfig.numberRounds; round++) {
        var city = cities[Math.floor(Math.random() * cities.length)];
        gameCities.push(city);
    }
    sails.log(gameCities);
    gameCities.forEach(function(city) {
        roundRemainingSeconds = gameConfig.turnTimeSeconds;
        
        var roundLoop = function() {
            sails.log('seconds: ' + roundRemainingSeconds);
            sails.sockets.broadcast('abc12', 'gameState', {
                remainingSeconds: roundRemainingSeconds, 
                city: city,
                test: 'test'
            });
            roundRemainingSeconds--;
        };
        
        var roundCompleted = function() {
            roundsRemaining = roundsRemaining - 1;
            sails.log('Round has ended');
        };
        
        var loopsToSchedule = roundRemainingSeconds;
        
        while (loopsToSchedule > 0) {
            sails.log(1000 * (gameConfig.turnTimeSeconds - loopsToSchedule));
            setTimeout(roundLoop, 1000 * (gameConfig.turnTimeSeconds + 1 - loopsToSchedule)); 
            loopsToSchedule--;
        }
        setTimeout(roundCompleted, 1000 * (gameConfig.turnTimeSeconds + 3));
                
        
        // show city name
        // start timer -> in timer interval
            // listen for socket submissions from players
                // compute distance from current city
                // award points
                // mark player as round done (can't submit again)
            // if timer is at zero, it fires a separate event
                // mark all players still playing as round done
    });
};



module.exports = {
    play: function(req, res) {  
        sails.log(req.user);      
        res.view('play', {
            user: req.user
        });
    },

    guess: function(req, res) {
        if (!req.isSocket) {return res.badRequest();}

        activeGames.indexOf(req.param('gameId'));
        var player = players.indexOf();
        sails.sockets.join(req, 'funSockets');

        sails.log(req.param('coords'));
        
        sails.sockets.broadcast('funSockets', 'joined', {id: 'my id'});

        return res.ok({
            message: "OK"
        });
    },

    join: function(req, res) {
        if (!req.isSocket) {return res.badRequest();}

        var gameId = req.param('game');
        var matchedGames = activeGames.indexOf(gameId);
        if (matchedGames.length == -1) {
            return res.badRequest();
        };
        Game.findOne({id: gameId}).exec(function (err, game) {
              if (err || !game) {
                return res.serverError(err);
              }
              sails.log(req);
              User.findOne({email: 'dennis.turko@gmail.com'}).exec(function (err, usr) {
                  console.log(usr);
                  game.players.add(usr);
                  players.push(usr);
                  game.save(function(err){
                      if (err) { return res.serverError(err); }
                      sails.sockets.join(req, gameId);
                      sails.sockets.broadcast(gameId, 'joined', {name:usr.name});
                      return res.ok();
                    });

              });
        });
    },
    
    create: function(req, res) {
        var gameId = req.param('game');
        Game.create({
            id: 'abc12',
            numberRounds: 1,
            turnTimeSeconds: 30,
            timeMultiplier: true,
            difficultyLower: 1,
            difficultyUpper: 2
        }).exec(function (err, game) {
              sails.log(err);
        });        

        return res.ok({
            message: "OK"
        });
    },
    
    start: function(req, res) {
        lastRoundTimeCheck = new Date();
        gameLoop({
            numberRounds: 1,
            turnTimeSeconds: 30,
            timeMultiplier: true,
            difficultyLower: 1,
            difficultyUpper: 2
        });
    }
};

