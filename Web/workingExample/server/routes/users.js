const router = require(`express`).Router()


const bcrypt = require('bcrypt');  // needed for password encryption


const firestore = require(`../config/db`);

const adminRef = firestore.db.collection('admin');
 

router.post(`/login/:email/:password`, async (req,res) =>  {	

	const email = req.params.email;
	const queryRef = adminRef.where('username', '==', email).where('password', '==', req.params.password);
	const snapshot = await queryRef.get();
	console.log(snapshot.empty);
	if (snapshot.empty) {
		
	  console.log('No matching documents.');
	  res.json({errorMessage:'Could not log in'});
	  
	}  else {
		
		console.log("works");
		req.session.user = {email: email, accessLevel:parseInt(process.env.ACCESS_LEVEL_ADMIN)};
        res.json({email: email, accessLevel:parseInt(process.env.ACCESS_LEVEL_ADMIN)});
	}
    
})


router.post(`/logout`, (req,res) => 
{       
    req.session.destroy()
    res.json({})
})


module.exports = router