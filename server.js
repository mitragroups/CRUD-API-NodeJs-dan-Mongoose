//=== settingan
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var router     = express.Router();
var port       = process.env.PORT || 3000;

//==== setting database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/apiusers');

var User = require('./models/user');

//==== konfigrasi bodyParser
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

//midlleware
router.use(function(req, res, next) {
  console.log('Middleware berjalan pada: ', Date.now());
  next();
});

//test router
router.get('/', function(req, res){
  res.json({ message: "anda di home!"});
});

router.route('/users')

  .post(function(req, res) {

      var user      = new User();
      user.name     = req.body.name;
      user.password = req.body.password;

      user.save(function(err){
        if(err) res.send(err);
        res.json({message: "user berhasil dimasukkan"});
      });

  }).get(function(req, res) {

    User.find(function(err, users) {
      if(err) res.send(err);
      res.json(users);
    });

});

router.route('/users/:name')
  .get(function(req, res){
      User.find({name:req.params.name}, function(err, user) {
        if(err) res.send(err);
        res.json(user);
      });
}).put(function(req, res){
    User.update(
      { name:req.params.name },
      { name:req.body.name },
      function(err, user) {
        if(err) res.send(err);
        res.json(" user berhasil diupdate! ");
    });
}).delete(function(req, res) {
  User.remove({
    name: req.params.name
  }, function(err, user){
    if(err) res.send(err);
    res.json({message: "user berhasil dihapus!"});
  });
});


//===== prefix api
app.use('/api', router);

app.listen(port);
console.log(' port run on.. '  + port);
