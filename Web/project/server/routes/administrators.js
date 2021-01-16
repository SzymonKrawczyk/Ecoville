const router = require(`express`).Router()


const bcrypt = require('bcrypt');  // needed for password encryption


const firestore = require(`../config/db`);
const middleware = require(`../middleware/middleware`);

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
	
	if (snapshot.empty) {
		
	  console.log('Bad login.');
	  res.json({errorMessage:'Login and password do not match'});
	  
	}  else {
		
		let _id = null;
		_id = snapshot.docs[0].id;
		
		req.session.user = {id: _id, username: username, accessLevel:parseInt(process.env.ACCESS_LEVEL_ADMIN)};
		console.log("Logged: " + _id);
        res.json({username: username, accessLevel:parseInt(process.env.ACCESS_LEVEL_ADMIN)});
		
	}
    
})


router.post(`/logout`, (req,res) => 
{       
	console.log('logout');
    req.session.destroy()
    res.json({})
})







// List all records
router.post(`/administratorsList/`, middleware.isLogged, middleware.isAdmin, async (req,res) =>  {	

			
	const queryRef = adminRef;
	const snapshot = await queryRef.get();
	
	if (snapshot.empty) {
		
	  console.log('Empty admin list');
	  res.json({errorMessage: 'No admin records'});
	  
	}  else {
		
		console.log("Send admin list");
		//console.log(req.session);
		let adminTable = [];
	
		snapshot.forEach((doc) => {
			if (doc.id != req.session.user.id) {
				let temp = {
					username: doc.data().username,
					_id: doc.id
				}
				adminTable.push(temp);
				
			}
		});
		console.log(adminTable);
		res.json(adminTable);
	}    
})


// Add new record
router.post(`/administrator/`, middleware.isLogged, middleware.isAdmin, async (req, res) => {    
		
	let usernameValidation = req.body.username.length >= 5;
	let passwordValidation = req.body.password.length >= 8;
		
	let errorMessage = {
		  usernameError: usernameValidation ? null : 'username has to be at least 5 characters long'
		, passwordError: passwordValidation ? null : 'password has to be at least 8 characters long'
	};
		
	if (!(usernameValidation && passwordValidation)) {
		res.json({errorMessage});
		return;
	}
		// validacja czy nie ma już o tej nazwie
    
    const doc = await adminRef.add(req.body);

	console.log(`Added admin with ID: ${doc.id}`);
    res.json({});   
})

// Read one record
router.get(`/administrator/:id`,  middleware.isLogged, middleware.isAdmin, async (req, res) => {
	
	const id = req.params.id;
    console.log(`Get admin ${id}`);
	const doc = await adminRef.doc(id).get();
	
	if (!doc.exists) {
		
		console.log('No admin');
		res.json({errorMessage: `No admin: ${id}`});
		
	} else {
		console.log('Admin ' + doc.data().username);
		res.json({username: doc.data().username, _id: doc.id});
	}
			
	
})

// Update one record
router.put(`/administrator/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {
	
	const id = req.params.id;
	
    if(req.session.user.id != id) {
		
		let usernameValidation = req.body.username.length >= 5;
			
		let errorMessage = {
			  usernameError: usernameValidation ? null : 'username has to be at least 5 characters long'
		};
			
		if (!(usernameValidation)) {
			res.json({errorMessage});
			return;
		}
			
		
		const doc = await adminRef.doc(id).get();
	
		if (!doc.exists) {
			
			console.log('No admin');
			res.json({errorMessage: `No admin: ${id}`});
			
		} else {
			
			const docE = await adminRef.doc(id).set(req.body, { merge: true });
		}
		

		console.log(`Updated admin with ID: ${id}`);
		res.json({});
		
	} else {
		
		console.log(`User wants to edit themselves!`);
        res.json({errorMessage:`You can't edit yourself`});
    } 
})


// Delete one record
router.delete(`/administrator/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {	
    
	const id = req.params.id;
    if(req.session.user.id != id) {
		
		console.log(`Delete admin ${req.params.id}`);
		const del = await adminRef.doc(id).delete();
			
		res.json({});
            
    } else {
		
		console.log(`User wants to delete themselves!`);
        res.json({errorMessage:`You can't delete yourself`});
    } 
})










module.exports = router