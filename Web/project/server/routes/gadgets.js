const router = require(`express`).Router()

const firestore = require(`../config/db`);
const middleware = require(`../middleware/middleware`);

const gadgetRef = firestore.db.collection('gadget');



  

// List all records
router.post(`/gadgetsList/`, middleware.isLogged, middleware.isAdmin,  async (req,res) =>  {	

	const queryRef = gadgetRef.orderBy('name', 'desc');
	const snapshot = await queryRef.get();
	
	if (snapshot.empty) {
		
	  console.log('Empty gadgets list');
	  res.json({errorMessage: 'No gadgets records'});
	  
	}  else {
		
		console.log("Send gadgets list");
		//console.log(req.session);
		let gadgetTable = [];
	
		snapshot.forEach((doc) => {
            let temp = {
                  name: doc.data().name
                , cost: doc.data().cost
                , amount: doc.data().amount
                , _id: doc.id
            }
            gadgetTable.push(temp);
		}); 
		console.log(gadgetTable);
		res.json(gadgetTable);
	}    
})


// Add new record
router.post(`/gadget/`, middleware.isLogged, middleware.isAdmin, middleware.trimObj, middleware.validateGadgetObject, async (req, res) => {    
	
	const id = req.params.id;
    console.log(req.body);
	req.body.cost = parseInt(req.body.cost);
	req.body.amount = parseInt(req.body.amount);

    const doc = await gadgetRef.add(req.body);

	console.log(`Added gadget with ID: ${doc.id}`);
    res.json({});   
})


// Read one record
router.get(`/gadget/:id`,  middleware.isLogged, middleware.isAdmin, async (req, res) => {
	
	const id = req.params.id;
    console.log(`Get gadget ${id}`);
	const doc = await gadgetRef.doc(id).get();
	
	if (!doc.exists) {
		console.log('No gadget');
		res.json({errorMessage: `No gadget: ${id}`});
		
	} else {
        console.log('gadget ' + doc.data().name);
		
		gadgetObject = {
              name: doc.data().name
            , cost: doc.data().cost
            , amount: doc.data().amount
			, pic: "defaultGadget.jpg"
			
            , _id: doc.id
        }
		
		// img
		const pic = doc.data().pic;
		
		console.log(`Pic: ${id}`);
			
		let bucket = firestore.admin.storage().bucket();
		//console.log(bucket);
		try {
			await bucket.file("gadgets/" + pic).download({destination: "./public/gadgets/" + pic}); 
			
			gadgetObject.pic = pic;
		} catch (error) {
			console.log("no pic");
		}
		
		console.log(gadgetObject);
		res.json(gadgetObject);
	}
})

// Update one record
router.put(`/gadget/:id`, middleware.isLogged, middleware.isAdmin, middleware.trimObj, middleware.validateGadgetObject, async (req, res) => {
	
	const id = req.params.id;
    console.log(req.body);
		
	const doc = await gadgetRef.doc(id).get();
	
	if (!doc.exists) {
			
		console.log('No gadget');
		res.json({errorMessage: `No gadget: ${id}`});
			
	} else {
			
		const docE = await gadgetRef.doc(id).set(req.body, { merge: true });
	}
		
	console.log(`Updated gadget with ID: ${id}`);
	res.json({});
		
}) 


// Delete one record
router.delete(`/gadget/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {	
	
	const id = req.params.id;

	console.log(`Delete gadget ${req.params.id}`);
	
	
	// delete files

    const docU = await gadgetRef.doc(id).get();

    /*if (!docU.exists) {
		
        console.log('No gadget');
		
    }else{
		
		

		// img
		const profilePic = docU.data().profilePic;
		
		console.log(`Profile pic: ${profilePic}`);
		
		if (profilePic != null && typeof(profilePic) != 'undefined'){
		
			
			// delete from storage
			try {
				let bucket = firestore.admin.storage().bucket();
			//console.log(bucket);
				await bucket.file("users/" + profilePic).delete(); 
			} catch (error) {
				console.log("no pic");
			}
			
			// delete from user
			try {
				await userRef.doc(id).update({
				  profilePic: null
				});
			} catch (error) {
				console.log("no pic field");
			}
			
			// delete local
			try { 
				var fs = require('fs');
				var filePath = './public/userImg/' + profilePic;
				fs.unlinkSync(filePath);
			} catch (error) {
				console.log("no local pic");
			}
		}
		console.log(`Deleted user image`);
    }*/
	
	
	
	
	const del = await gadgetRef.doc(id).delete();
	console.log('Successfully deleted gadget ' + id);
	res.json({}); 
})


// remove gadget's picture
router.post(`/gadgetDeletePic/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {	
	
    const id = req.params.id;


    const docU = await gadgetRef.doc(id).get();

    if (!docU.exists) {
		
        console.log('No gadget');
        res.json({errorMessage: `No gadget: ${id}`});
		
    }else{

		// img
		const pic = docU.data().pic;
		
		console.log(`Gadget pic: ${pic}`);
		
		// delete from storage
			try {
				let bucket = firestore.admin.storage().bucket();
			//console.log(bucket);
				await bucket.file("gadgets/" + pic).delete(); 
			} catch (error) {
				console.log("no pic");
			}
			
		// delete from gadget
			try {
				await gadgetRef.doc(id).update({
				  pic: null
				});
			} catch (error) {
				console.log("no pic field");
			}
		
			
		// delete local
			try { 
				var fs = require('fs');
				var filePath = './public/gadgets/' + pic;
				fs.unlinkSync(filePath);
			} catch (error) {
				console.log("no local pic");
			}
		console.log(`Deleted gadget image`);

        res.json({});    
    }
})

module.exports = router