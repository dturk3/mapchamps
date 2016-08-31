/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  index: function(req, res) {  
    sails.log(req.user);
    res.view('home', {
      user: req.user
    });
  },

  menu: function(req, res) {
    res.view('index.ejs');
  }
};

