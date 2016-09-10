/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {

  index: function(req, res) {
    res.view();
  },

  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  },
    
  // https://developers.google.com/
  // https://developers.google.com/accounts/docs/OAuth2Login#scope-param
  google: function(req, res) {
    passport.authenticate('google', { failureRedirect: '/login', scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'] }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }
        req.session.authenticated = true;
        req.session.user = user;
        res.redirect('/');
        return;
      });
    })(req, res);
  },
      callback: function(req, res) {
          sails.log(req._passport.instance);
          req._passport.instance.callback(req, res, function() {
              sails.log(req);
              sails.log(req.user);
          });  
       
        // Mark the session as authenticated to work with default Sails sessionAuth.js policy
        req.session.authenticated = true;
        
        // Upon successful login, send the user to the homepage were req.user
        // will be available.
        res.redirect('/home');
      }
};