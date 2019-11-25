var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var bodyParser = require('body-parser');
var exec = require('child_process').exec, child;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/device', indexRouter);
app.use('/users', usersRouter);

app.use(bodyParser.urlencoded({extended:true}));

app.post('/mic_event', function(req, res){
	console.log("Click mic");
	child = exec("sudo omxplayer /home/pi/Demo_sound.wav", function(error, stdout, stderr){
		console.log(stdout);
		if(error != null)
		{
			console.log(error);;
		}
	});
});


app.post('/set_power', function(req, res){
  console.log("Click power");

  var mysql = require('mysql');
  var connection = mysql.createConnection({
      host: 'ninewatt-database.c0yjefof1hxj.ap-northeast-2.rds.amazonaws.com',
      post: 3306,
      user: 'admin',
      password: 'ninewattroot',
      database: 'ninewatt'
  });

  connection.connect();
  /*
  var sql = 'SELECT * FROM controlhistory';
  connection.query(sql, function (err, rows, fields) {
    if (err) console.log(err);
    console.log('rows', rows); //row는 배열이다.
    //console.log('fields', fields); //fields는 컬럼을 의미한다.
  });
  */
  /*
  console.log("power01");
  var sql = 'INSERT INTO agenthistory(date, mode, targetpower, active) VALUES("2019-11-25 12:10:00", "manual", 150, "device")';
  console.log("power01");
  connection.query(sql, function(err, result, fields){ // db에 query를 날린다. 1번째 인자로 sql문과, 배열 안에 담긴 값들, 그리고 함수를 전달한다.
    if(err) {
      console.log(err); //에러가 있다면, 보안을 위해 콘솔에 err로그를 찍고,
      res.status(500).send('Internal Server Error'); //사용자에게는 err로그를 보여주지 않는다.
    }
    console.log('The file has been saved!');//데이터가 db에 잘 저장 되었다면, 콘솔에 성공이라 찍는다.
  console.log("power02");
  });
  */
  
  var sql = 'INSERT INTO agenthistory(date, mode, targetpower, active) VALUES(?, ?, ?, ?)';
  var params = ['2019-11-25 12:15:00', 'manual', 250, 'device'];//파라미터를 값들로 줌(배열로 생성)
  connection.query(sql, params, function(err, rows, fields){// 쿼리문 두번째 인자로 파라미터로 전달함(값들을 치환시켜서 실행함. 보안과도 밀접한 관계가 있음(sql injection attack))
    if(err) console.log(err);
    console.log(rows.insertId);
  });
  
  connection.end();//접속이 끊긴다.
  console.log("power03");
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => {
console.log("3000 port")});

module.exports = app;
