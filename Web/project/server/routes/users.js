const router = require(`express`).Router()


const bcrypt = require('bcrypt');  // needed for password encryption


const firestore = require(`../config/db`);

const adminRef = firestore.db.collection('admin');
 

router.post(`/login/:username/:password`, async (req,res) =>  {	

	const username = req.params.username;
	const password = req.params.password;
	
	//validate
	if (username.length == 0 || password.length == 0) {
		console.log("hackers!");		
		res.json({errorMessage:'Could not log in'});
		return;
	}
	
	const queryRef = adminRef.where('username', '==', username).where('password', '==', password);
	const snapshot = await queryRef.get();
	//console.log(username + " " + req.params.password + " " + snapshot.empty);
	if (snapshot.empty) {
		
	  console.log('No matching documents.');
	  res.json({errorMessage:'Could not log in'});
	  
	}  else {
		
		console.log("works");
		req.session.user = {username: username, accessLevel:parseInt(process.env.ACCESS_LEVEL_ADMIN)};
        res.json({username: username, accessLevel:parseInt(process.env.ACCESS_LEVEL_ADMIN)});
	}
    
})


router.post(`/logout`, (req,res) => 
{       
    req.session.destroy()
    res.json({})
})


module.exports = router