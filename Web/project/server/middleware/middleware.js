const isLogged = (req, res, next) =>
{
    if(typeof req.session.user == `undefined`) {    
	
		console.log("Middleware isLogged: false");
		req.session.destroy();
        return res.json({errorMessage:`User is not logged`, isLogged: false});
		
    } else {
		
		console.log("Middleware isLogged: true");
		
        return next();
    }
}

const isAdmin = (req, res, next) =>
{
    if(req.session.user.accessLevel < process.env.ACCESS_LEVEL_ADMIN) {    
	
		console.log("Middleware isAdmin: false");
		req.session.destroy();
        return res.json({errorMessage:`User is not admin`, isAdmin: false});
		
    } else {
		
		console.log("Middleware isAdmin: true");
        return next();
    }
}

exports.isLogged = isLogged;
exports.isAdmin = isAdmin;
