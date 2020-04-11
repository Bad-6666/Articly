var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var passwordHash = require('password-hash')
var cookieSession = require('cookie-session')
var app = express();


const urlencodedParser = bodyParser.urlencoded({extended:false});

let db = new sqlite3.Database('my.db')

app.set('views', './views')
app.set('view engine', 'pug')



app.use(cookieSession({
	name: 'session',
	keys: ['key1', 'key2'],
	resave: false,
	saveUninitialized: false
}));


app.get('/login', urlencodedParser, function(req, res){
	res.sendFile(__dirname + "/login.html");
});

app.post('/login', urlencodedParser, function(req, res){
	if(!req.body){
		return res.sendStatus(400);
	}

	var l = req.body.login
	var p = req.body.password

	sessionData = req.session;
	sql = `SELECT * FROM Users WHERE username='${l}'`;
	db.each(sql, function(err, row) {
		if (passwordHash.verify(p, row.password_hash)) {
			console.log("Good");
			sessionData.auth = true;
			req.session.save()
		}
		else {
			console.log("Bad")
			sessionData.auth = false
			req.session.save()
		}
	});



	// res.sendStatus(200);

});

app.get('/whoami', urlencodedParser, function(req, res){
	console.log("session", req.session.auth);
	if (req.session.auth) {
		res.send("Вы вошли!  :)")
	}
	else {
		res.send("Вы не вошли! :(")
	}
});


app.get('/register', urlencodedParser, function(req, res){
	res.sendFile(__dirname + "/index.html");
});


app.post('/register', urlencodedParser, function(req, res){
	if(!req.body){
		return res.sendStatus(400);
	}
	// t = String(req.body.userName)*Number(req.body.userAge);
	// req.body.userName
	// req.body.userAge
	res.sendStatus(200);
});

app.get('/posts', urlencodedParser,

	function(req, res, next){
		res.sendFile(__dirname + "/posts.html");
		next();
	},

	function (req, res){
		res.redirect('/all');
	}
);


app.post('/posts', urlencodedParser, function(req, res){
	if(!req.body){
		return res.sendStatus(400);
	}

	var ttl = req.body.title
	var txt = req.body.text

	db.run(`INSERT INTO Posts(title, text) VALUES ('${ttl}', '${txt}')`);

	res.sendStatus(200);
});



app.post('/articles', urlencodedParser, function(req, res){
	if(!req.body){
		return res.sendStatus(400);
	}
	console.log(req.body.title);
	res.sendStatus(200);
});



app.get('/', function (req, res) {
	let a = "QWERTY"
	res.send(`
		<h1>Hello!</h1>
		<ul>
			<li>`+a+`</li>
			<li>`+2*99+`</li>
			<li>`+3*99+`</li>
		</ul>
		`);
	// res.sendFile(__dirname + "/public/index.html")
});

app.get('/first', function (req, res) {
	// Числа от 1 до 100
	var t = "";
	let a = req.query.a;
	let b = req.query.b;

	a = Number(a);
	b = Number(b);
	for (var i = a; i <= b; i++) {
		t += String(i)+"</br>"
	}

	res.send(t);
});

app.get('/second', function (req, res) {
	// Появляется alert с любым текстом
	res.send(`
		<script type="text/javascript">
			alert("Hello");
		</script>
		`);
});

app.get('/site', function (req, res) {
	var name = "Hey";
	var text = "azazazazazazazazazazazazazaz"
	var a = "John"

	res.render('index', {title:"Article", name:name,
		text: text, author: a})
});

app.get('/p', function(req, res){
	let id = req.query.id;

	sql = `SELECT * FROM Posts WHERE id=${id}`;
	db.each(sql, function(err, row) {
		let title = row.title
		let text = row.text

		res.send(`
		<h2>${title}</h2>
		<h3>Статья <i>${id}</i></h3>
		<hr>
		<p>${text}</p>
		`);
	});
});

app.get('/all',  function(req, res){
	let id = req.query.id;

	sql = `SELECT * FROM Posts`;
	var page ='';
	db.each(sql, function(err, row){
		let title = row.title
		let text  = row.text
		console.log(title);
		page +=`
			<h2> ${title} </h2>
			<hr>
			`

	});

	res.send(page);


});

app.listen(3000, function () {
	console.log('I am alive! On 3000');
});
























