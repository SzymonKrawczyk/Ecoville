// Server-side global variables
require(`dotenv`).config({path:`./config/.env`})


// Database
const firestore = require(`./config/db`)


// Express
const express = require(`express`)
const app = express()
app.use(require(`express-session`)({
    secret: process.env.SESSION_PRIVATE_KEY,
    resave: true,
    cookie: {secure: false, maxAge: 1000*60*60}, // an hour
    saveUninitialized: true
}))

app.use(require(`body-parser`).json())
app.use(require(`cors`)({credentials: true, origin: process.env.LOCAL_HOST}))

// Static files for clients
app.use(express.static('./public'));


// Routers
app.use(require(`../server/routes/administrators`))
app.use(require(`../server/routes/messages`))
app.use(require(`../server/routes/categories`))
app.use(require(`../server/routes/missions`))
app.use(require(`../server/routes/articles`))
app.use(require(`../server/routes/trophies`))
app.use(require(`../server/routes/gadgets`))
app.use(require(`../server/routes/users`))


//timers
const timers = require(`./timers/missionTimers`)


// Port
app.listen(process.env.SERVER_PORT, () => 
{
    console.log(`Connected to port ` + process.env.SERVER_PORT)
	timers.missionTimers();
	
	
	
	
	
	
	
	// zegar usługa free
	var net = require('net');
	var server = net.createServer();    
	server.on('connection', handleConnection);
	server.listen(8052, function() {    
	  console.log('tcp server listening to %j', server.address());  
	});
	function handleConnection(conn) {  
	
		var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;  
		console.log('new client connection from %s', remoteAddress);
		conn.setEncoding('utf8');
		
		const timestamp = (new Date()).getTime();
		console.log(`Sending date... ${timestamp} = ${new Date(timestamp)}`);
	  	  
		conn.write("" + timestamp); 

		conn.destroy();
	}
})


// Error 404
app.use((req, res, next) => {next(createError(404))})

// Other errors
app.use(function (err, req, res, next)
{
    console.error(err.message)
    if (!err.statusCode) 
    {
        err.statusCode = 500
    }
    res.status(err.statusCode).send(err.message)
})
