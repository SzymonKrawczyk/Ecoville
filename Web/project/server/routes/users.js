const router = require(`express`).Router()

const firestore = require(`../config/db`);
const middleware = require(`../middleware/middleware`);

const userRef = firestore.db.collection('user');
const categoryRef = firestore.db.collection('category');
const missionRef = firestore.db.collection('mission');
const trophyRef = firestore.db.collection('trophy');
const gadgetRef = firestore.db.collection('gadget');
const postRef = firestore.db.collection('post');

const appDataRef = firestore.db.collection('_appData');



  

// List all records
router.post(`/usersList/`, middleware.isLogged, middleware.isAdmin,  async (req,res) =>  {	

	const queryRef = userRef.orderBy('created', 'desc');
	const snapshot = await queryRef.get();
	
	if (snapshot.empty) {
		
	  console.log('Empty users list');
	  res.json({errorMessage: 'No users records'});
	  
	}  else {
		
		console.log("Send users list");
		//console.log(req.session);
		let userTable = [];
	
		snapshot.forEach((doc) => {
            let temp = {
                firstName: doc.data().firstName,
                lastName: doc.data().lastName,
                email: doc.data().email,
                currentPoints: doc.data().currentPoints,
                totalPointsSum: doc.data().totalPointsSum,
                created: doc.data().created,
                _id: doc.id
            }
            userTable.push(temp);
		});
		console.log(userTable);
		res.json(userTable);
	}    
})

// Read one record
router.get(`/user/:id`,  middleware.isLogged, middleware.isAdmin, async (req, res) => {
	
	const id = req.params.id;
    console.log(`Get user ${id}`);
	const doc = await userRef.doc(id).get();
	
	if (!doc.exists) {
		console.log('No user');
		res.json({errorMessage: `No user: ${id}`});
		
	} else {
        console.log('user ' + doc.data().firstName + " " + doc.data().lastName);
		
		
		
		// img
		const profilePic = doc.data().profilePic;
		
		console.log(`Profile pic: ${profilePic}`);
		
		if (profilePic != null && typeof(profilePic) != 'undefined'){
		
			console.log(`Get user image ${profilePic}`);
			
			let bucket = firestore.admin.storage().bucket();
			//console.log(bucket);
			try {
				await bucket.file("users/" + profilePic).download({destination: "./public/userImg/" + profilePic}); 
			} catch (error) {
				console.log("no pic");
			}
		}
		
		
		
		
        
        //totalPoints
        totalPointsArr = doc.data().totalPoints != null ? doc.data().totalPoints : [];
		totalPointsProcessedArr = [];
		//console.log(totalPointsArr);
		
		for (let i = 0; i < totalPointsArr.length; ++i) {
			const currentCategory = totalPointsArr[i].id_category;
			//console.log(totalPointsArr[i]);
			//console.log(currentCategory);
			const categoryGet = await currentCategory.get();	
			
			if (categoryGet.exists) {		
								
				totalPointsProcessedArr.push({
					  _id: categoryGet.id
					, name: categoryGet.data().name
					, points: totalPointsArr[i].points
				});		
			}
		}

        //trophies
        trophiesArr = doc.data().trophies != null ? doc.data().trophies : [];
		trophiesProcessedArr = [];
		
		for (let i = 0; i < trophiesArr.length; ++i) {
			const currentTrophy = trophiesArr[i].trophy_id;
			const trophyGet = await currentTrophy.get();	
			
			if (trophyGet.exists) {		
								
				trophiesProcessedArr.push({
					  _id: trophyGet.id
					, name: trophyGet.data().name
				});
			}
        }
		
		//gadgets
		let gadgetsArrT = doc.data().gadgets != null ? doc.data().gadgets : [];
		let gadgetsArr = [];
		
		for (let i = 0; i < gadgetsArrT.length; ++i) {
			const current = gadgetsArrT[i].ref;
			const gadgetGet = await current.get();	
			
			if (gadgetGet.exists) {		
			
				let tempGadgetObj = {
					  _id: gadgetGet.id
					, name: gadgetGet.data().name
					, pic: "defaultGadget.jpg"
					, collected: gadgetsArrT[i].collected
				};
				
				const pic = gadgetGet.id;			
				let bucket = firestore.admin.storage().bucket();
				try {
					await bucket.file("gadgets/" + pic).download({destination: "./public/gadgets/" + pic}); 
					
					tempGadgetObj.pic = pic;
				} catch (error) {
					console.log("no pic");
				}
								
				gadgetsArr.push(tempGadgetObj);
			}
        }
        

        userObject = {
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            email: doc.data().email,
            currentPoints: doc.data().currentPoints,
            totalPointsSum: doc.data().totalPointsSum,
            created: doc.data().created,
            confirmedMissions: doc.data().confirmedMissions,
            totalPoints: totalPointsProcessedArr,
            trophies: trophiesProcessedArr,
			gadgets: gadgetsArr,
			
            ban: doc.data().ban,
			
            _id: doc.id
        }
		
		if (profilePic != null && typeof(profilePic) != 'undefined') userObject.profilePic = doc.data().profilePic;
		//console.log(userObject);
		res.json(userObject);
	}
})

// Update one record
router.put(`/user/:id`, middleware.isLogged, middleware.isAdmin, middleware.trimObj, middleware.validateUserObject, async (req, res) => {
	
	const id = req.params.id;
    console.log(req.body);
		
	const doc = await userRef.doc(id).get();
	
	if (!doc.exists) {
			
		console.log('No user');
		res.json({errorMessage: `No user: ${id}`});
			
	} else {
			
		const docE = await userRef.doc(id).set(req.body, { merge: true });
	}
		
	console.log(`Updated user with ID: ${id}`);
	res.json({});
		
})


// Delete one record
router.delete(`/user/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {	
	
	const id = req.params.id;

	console.log(`Delete user ${req.params.id}`);
	
	
	// delete files

    const docU = await userRef.doc(id).get();

    if (!docU.exists) {
		
        console.log('No user');
		
    }else{
		
		//add to ban list
		
		const docApp = await appDataRef.doc('bannedUsers').get();
		
		if (docApp.exists) {
			
			let newObj = {
				emails: docApp.data().emails
			}
			newObj.emails.push(docU.data().email);
			
			const docAU = await appDataRef.doc('bannedUsers').set(newObj, { merge: true });
		}
		
		
		
		

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
    }
	
	
	
	
	
	
	
	
	
	
	
	
	firestore.admin
	  .auth()
	  .deleteUser(id)
	  .then(async () => {
		const del = await userRef.doc(id).delete();
		console.log('Successfully deleted user' + id);
		res.json({}); 
	  })
	  .catch((error) => {
		console.log('Error deleting user:', error);
		res.json('Error deleting user:' + error); 
	  });
			  
})

//confirm gadget redeem
router.post(`/userRedeemGadget/:id/:gadget_id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {	
	
    const id = req.params.id;
    const gadget_id = req.params.gadget_id;

    const docG = await gadgetRef.doc(gadget_id).get();

    console.log(id + "  " + gadget_id);

	if (!docG.exists) {
		console.log('No gadget');
		res.json({errorMessage: `No gadget: ${id}`});
		
	} else {

        const docU = await userRef.doc(id).get();

        if (!docU.exists) {
            console.log('No user');
            res.json({errorMessage: `No user: ${id}`});
        }else{

            console.log(docU.data().gadgets);


            if(docU.data().gadgets != null){

                let newGadgetslist = docU.data().gadgets;
				
                for (let i = 0; i < newGadgetslist.length; ++i) {

                    if (gadget_id == newGadgetslist[i].ref.id) {

						newGadgetslist[i].collected = true;
						break;
                    }
                }

                console.log(newGadgetslist);

                userObject = {
                      gadgets: newGadgetslist
                    //, _id: docU.id
                }

                const docEM = await userRef.doc(id).set(userObject, { merge: true });
                res.json({});     	   
            }
			else res.json({errorMessage: `No gadgets..`});
        }
    }
})





// tempBan
//if (new Date(missionObject.when) <= new Date()) dateValidation = false;
//		missionObject.when = firestore.admin.firestore.Timestamp.fromDate(new Date(missionObject.when));
//
router.put(`/userTempBan/:id`, middleware.isLogged, middleware.isAdmin, middleware.trimObj, async (req, res) => {	
	
	const id = req.params.id;

	console.log(`Temp ban user ${req.params.id}`);
	

    const doc = await userRef.doc(id).get();

    if (!doc.exists) {
		
        console.log('No user');
		
		return res.json({});
		
    }else{

		try {
			
			const firestoreBanDate = firestore.admin.firestore.Timestamp.fromDate(new Date(req.body.ban));
			
			let tempUser = {
				ban: firestoreBanDate
			};
			const docU = await userRef.doc(id).set(tempUser, { merge: true });
			
			return res.json({});
			
		} catch (error) {
			console.log("Bad date");
			console.log(error);
			
			const errorMessage = {
				banError: 'date in format dd/mm/yyyy hh:mm:ss is required'
			}
			
			return res.json({errorMessage});
		}
    }
				  
})


// Add points to user
router.post(`/userAddPoints/:id/:points`, middleware.isLogged, middleware.isAdmin, async (req, res) => {	
	
	const id = req.params.id;

    const doc = await userRef.doc(id).get();
	
	if (!doc.exists) {
		console.log('No user');
		res.json({errorMessage: `No user: ${id}`});
		
	} else {
        console.log('adding points to user:  ${id}' + doc.data().firstName + " " + doc.data().lastName);
        console.log('before: '+ doc.data().currentPoints );

		var pointsValidation = parseInt(doc.data().currentPoints) + parseInt(req.params.points);
		
        userObject = {
            currentPoints: pointsValidation > 0 ? pointsValidation : 0
        }

        const docE = await userRef.doc(id).set(userObject, { merge: true });
    }
	res.json({});     	   
})

// remove trophy from user's list
router.post(`/userDeleteTrophy/:id/:trophy_id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {	
	
    const id = req.params.id;
    const trophy_id = req.params.trophy_id;

    const docT = await trophyRef.doc(trophy_id).get();

    console.log(id + "  " + trophy_id);

	if (!docT.exists) {
		console.log('No trophy');
		res.json({errorMessage: `No trophy: ${id}`});
		
	} else {

        const docU = await userRef.doc(id).get();

        if (!docU.exists) {
            console.log('No user');
            res.json({errorMessage: `No user: ${id}`});
        }else{

            console.log(docU.data().trophies);


            if(docU.data().trophies != null){

                let newTrophielist = [];
                for (let i = 0; i < docU.data().trophies.length; ++i) {

                    if (trophy_id != docU.data().trophies[i].trophy_id.id) {

                        newTrophielist.push( docU.data().trophies[i] )
                    }
                }

                console.log(newTrophielist);

                userObject = {
                      trophies: newTrophielist
                    //, _id: docU.id
                }

                const docEM = await userRef.doc(id).set(userObject, { merge: true });
                res.json({});     	   
            }
        }
    }
})

// delete all posts
router.post(`/userDeletePosts/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {	
	
    const id = req.params.id;


    const doc = await userRef.doc(id).get();

    if (!doc.exists) {
		
        console.log('No user');
        res.json({errorMessage: `No user: ${id}`});
		
    }else{

		const userRefCurrent = userRef.doc(id);
		const queryRef = await postRef.where('id_user', '==', userRefCurrent).get();
		
		if (queryRef.empty) {
		  console.log('No matching posts.');
		  res.json({});
		  return;
		}  

		let tempPostArr = [];
		queryRef.forEach(doca => {
			
			tempPostArr.push(doca.id);
		});
		
		for (let i = 0; i < tempPostArr.length; ++i){
			
			const del = await postRef.doc(tempPostArr[i]).delete();
		}

		console.log(`deleted posts made by user: ${id}`);
		
        res.json({});    
    }
})


// remove user's profile picture
router.post(`/userDeletePic/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {	
	
    const id = req.params.id;


    const docU = await userRef.doc(id).get();

    if (!docU.exists) {
		
        console.log('No user');
        res.json({errorMessage: `No user: ${id}`});
		
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

        res.json({});    
    }
})
module.exports = router