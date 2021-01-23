const router = require(`express`).Router()

const firestore = require(`../config/db`);
const middleware = require(`../middleware/middleware`);

const userRef = firestore.db.collection('user');
const categoryRef = firestore.db.collection('category');
const missionRef = firestore.db.collection('mission');
const trophyRef = firestore.db.collection('trophy');



 

// List all records
router.post(`/usersList/`, middleware.isLogged, middleware.isAdmin, async (req,res) =>  {	

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

            _id: doc.id
        }

		res.json(userObject);
	}
})

// Update one record
router.put(`/user/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {
	
	const id = req.params.id;
    console.log(req.body);
    
    let firstNameValidation =  req.body.firstName.length >= 3;
    let lastNameValidation =  req.body.lastName.length >= 3;
    

    let errorMessage = {
        firstNameError: firstNameValidation ? null : 'first name has to be at least 3 characters long',
        lastNamenError: lastNameValidation ? null : 'last name has to be at least 3 characters long',
    };
		
	if (!(firstNameValidation && lastNameValidation)) {
		res.json({errorMessage});
		return;
	}
		
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
	const del = await userRef.doc(id).delete();
			
	res.json({});     
	   
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
        console.log('before: ' + doc.data().totalPointsSum + ', ' + doc.data().currentPoints );

        userObject = {
            currentPoints: parseInt(doc.data().currentPoints) + parseInt(req.params.points),
            totalPointsSum: parseInt(doc.data().totalPointsSum) + parseInt(req.params.points),
            _id: doc.id
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
                    trophies: newTrophielist,
                    _id: docU.id
                }

                const docEM = await userRef.doc(id).set(userObject, { merge: true });
                res.json({});     	   
            }
        }
    }
})


module.exports = router