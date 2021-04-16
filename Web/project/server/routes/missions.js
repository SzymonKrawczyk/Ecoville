const router = require(`express`).Router()


const firestore = require(`../config/db`);
const middleware = require(`../middleware/middleware`);
const timers = require(`../timers/missionTimers`);

const missionRef = firestore.db.collection('mission');
const categoryRef = firestore.db.collection('category');
const userRef = firestore.db.collection('user');
 



// List all records
router.post(`/missionsList/`, middleware.isLogged, middleware.isAdmin, async (req,res) =>  {	

			
	const queryRef = missionRef.orderBy('when', 'desc');
	const snapshot = await queryRef.get();
	
	if (snapshot.empty) {
		
	  console.log('Empty mission list');
	  res.json({errorMessage: 'No mission records'});
	  
	}  else {
		
		console.log("Send mission list");
		//console.log(req.session);
		let missionDocs = [];
		let missionTable = [];
	
		snapshot.forEach((doc) => { missionDocs.push(doc); });
		
		for (let i = 0; i < missionDocs.length; ++i) {
			
			const currentDoc = missionDocs[i];
			
			const category = await currentDoc.data().id_category.get();			
			let categoryString = "";			
			if (!category.exists) {		
				
				categoryString = "[deleted]";
					
			} else {
				categoryString = category.data().name;
			}
			
			missionTable.push({
				  _id: currentDoc.id
				, name: currentDoc.data().name
				, category: categoryString
				, points: currentDoc.data().points
				, currentParticipants: currentDoc.data().currentParticipants ? currentDoc.data().currentParticipants.length : 0
				, totalParticipants: currentDoc.data().requiredParticipants
				, when: currentDoc.data().when
			});				
		}
		
		console.log(missionTable);
		res.json(missionTable);
	}    
})


// Add new record
router.post(`/mission/`, middleware.isLogged, middleware.isAdmin, middleware.trimObj, middleware.validateMissionObject, async (req, res) => {    
		
	const id = req.params.id;
		
	let missionObject = req.body;
	console.log(req.body);
	
    missionObject.added = firestore.admin.firestore.Timestamp.fromDate(new Date(Date.now()));
	missionObject.currentParticipants = [];
	missionObject.completed = false;
	
    const doc = await missionRef.add(req.body);

	timers.missionTimers();

	console.log(`Added mission with ID: ${doc.id}`);
    res.json({});   
})

// Read one record
router.get(`/mission/:id`,  middleware.isLogged, middleware.isAdmin, async (req, res) => {
	
	const id = req.params.id;
    console.log(`Get mission ${id}`);
	const doc = await missionRef.doc(id).get();
	
	if (!doc.exists) {
		
		console.log('No mission');
		res.json({errorMessage: `No mission: ${id}`});
		
	} else {
		console.log('Mission ' + doc.data().name);
		
		const snapshotCat = await categoryRef.get();
		let categoryTable = [];
		
		if (snapshotCat.empty) {
			
		  console.log('Empty category list');
		  
		}  else {
			
			snapshotCat.forEach((docC) => {
				
				categoryTable.push({
					name: docC.data().name,
					_id: docC.id
				});
					
			});
		} 
		
		userArr = doc.data().currentParticipants != null ? doc.data().currentParticipants : [];
		userProcessedArr = [];
		
		for (let i = 0; i < userArr.length; ++i) {
			const currentUser = userArr[i].id_user;
			const userGet = await currentUser.get();	
			
			if (userGet.exists) {		
								
				userProcessedArr.push({
					  _id: userGet.id
					, firstName: userGet.data().firstName
					, lastName: userGet.data().lastName
					, confirmed: userArr[i].confirmed
				});		
			}
		}
		
		
		missionObject = {
			  _id: doc.id
			, currentParticipants: userProcessedArr
			, description: doc.data().description
			, durationMinutes: doc.data().durationMinutes
			, categories: categoryTable
			, id_category: doc.data().id_category.id
			, location: doc.data().location
			, name: doc.data().name
			, points: doc.data().points
			, requiredParticipants: doc.data().requiredParticipants
			, when: doc.data().when
			, added: doc.data().added
		}
		
		console.log(missionObject);
		res.json(missionObject);
	}
})

// Update one record
router.put(`/mission/:id`, middleware.isLogged, middleware.isAdmin, middleware.trimObj, middleware.validateMissionObject, async (req, res) => {
		
		
	const id = req.params.id;
	
	let missionObject = req.body;
	missionObject.completed = false;
	console.log(req.body);
	
	let errorMessage = {};
			
		
	const doc = await missionRef.doc(id).get();
	
	if (!doc.exists) {
			
		console.log('No mission');
		res.json({errorMessage: `No mission: ${id}`});
			
	} else {
			
		const docE = await missionRef.doc(id).set(missionObject, { merge: true });
	}
		
	timers.missionTimers();
	console.log(`Updated mission with ID: ${id}`);
	res.json({});
})


// Delete one record
router.delete(`/mission/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {	
    
	const id = req.params.id;
		
	console.log(`Delete mission ${req.params.id}`);
	const del = await missionRef.doc(id).delete();
			
	res.json({});
})

/*
// Confirm user on mission
router.post(`/missionConfirmUser/:idM/:idU`, middleware.isLogged, middleware.isAdmin, async (req,res) =>  {	

	const id_mission = req.params.idM;
	const id_user = req.params.idU;
	console.log(`confirm: mission ${id_mission}, user ${id_user}`);
	
	//validate
	const docU = await userRef.doc(id_user).get();
	
	if (!docU.exists) {
			
		console.log('No user');
		res.json({errorMessage: `No user: ${id_user}`});
			
	} else {
			
		const docM = await missionRef.doc(id_mission).get();
	
		if (!docM.exists) {
				
			console.log('No mission');
			res.json({errorMessage: `No mission: ${id_mission}`});
				
		} else {
			//console.log(docM.data());
			//console.log(docM.data().currentParticipants);
			if (docM.data().currentParticipants != null) {
				
				//console.log(docM.data().currentParticipants);
				
				for (let i = 0; i < docM.data().currentParticipants.length; ++i) {
					
					if (id_user == docM.data().currentParticipants[i].id_user.id) {
						
						let tempObjectMission = {currentParticipants: docM.data().currentParticipants};
						tempObjectMission.currentParticipants[i].confirmed = true;
						//console.log(tempObjectMission);
						//console.log(docM.data());
						const docEM = await missionRef.doc(id_mission).set(tempObjectMission, { merge: true });
						
						
						pointArray = docU.data().totalPoints != null ? docU.data().totalPoints : [];
						let addedPoints = false;
						//console.log(docM.data().id_category._path.segments)
						//console.log(pointArray[0].id_category._path.segments)
						for (let p = 0; p < pointArray.length; ++p) {
							
							if (pointArray[p].id_category._path.segments[1] == docM.data().id_category._path.segments[1]) {
								
								pointArray[p].points = pointArray[p].points + docM.data().points;
								addedPoints = true;
								break;
							}
						}
						if (!addedPoints) {
							pointArray.push({
								  id_category: docM.data().id_category
								, points: docM.data().points
								})
						}
						
						let tempObjectUser = {
							  confirmedMissions: parseInt(parseInt(docU.data().confirmedMissions) + 1)
							, totalPoints: pointArray
							, currentPoints: parseInt(parseInt(docU.data().currentPoints) + parseInt(docM.data().points))
							, totalPointsSum: parseInt(parseInt(docU.data().totalPointsSum) + parseInt(docM.data().points))
							};
						const docEU = await userRef.doc(id_user).set(tempObjectUser, { merge: true });
						break;
					}
				}				
			}
			res.json({});
		}
	}
	
	
    
})
*/


// Confirm user on mission
router.post(`/missionConfirmUser/:idM/:idU`, middleware.isLogged, middleware.isAdmin, async (req,res) =>  {	

	const id_mission = req.params.idM;
	const id_user = req.params.idU;
	console.log(`confirm: mission ${id_mission}, user ${id_user}`);
	
	//validate
	const docU = await userRef.doc(id_user).get();
	
	if (!docU.exists) {
			
		console.log('No user');
		res.json({errorMessage: `No user: ${id_user}`});
			
	} else {
			
		const docM = await missionRef.doc(id_mission).get();
	
		if (!docM.exists) {
				
			console.log('No mission');
			res.json({errorMessage: `No mission: ${id_mission}`});
				
		} else {
			//console.log(docM.data());
			//console.log(docM.data().currentParticipants);
			if (docM.data().currentParticipants != null) {
				
				//console.log(docM.data().currentParticipants);
				
				for (let i = 0; i < docM.data().currentParticipants.length; ++i) {
					
					if (id_user == docM.data().currentParticipants[i].id_user.id) {
						
						let tempObjectMission = {currentParticipants: docM.data().currentParticipants};
						tempObjectMission.currentParticipants[i].confirmed = false;
						//console.log(tempObjectMission);
						//console.log(docM.data());
						const docEM = await missionRef.doc(id_mission).set(tempObjectMission, { merge: true });
						
						
						pointArray = docU.data().totalPoints != null ? docU.data().totalPoints : [];
						let addedPoints = false;
						//console.log(docM.data().id_category._path.segments)
						//console.log(pointArray[0].id_category._path.segments)
						for (let p = 0; p < pointArray.length; ++p) {
							
							if (pointArray[p].id_category._path.segments[1] == docM.data().id_category._path.segments[1]) {
								
								pointArray[p].points = pointArray[p].points - docM.data().points;
								addedPoints = true;
								break;
							}
						}
						if (!addedPoints) {
							pointArray.push({
								  id_category: docM.data().id_category
								, points: -1 * docM.data().points
								})
						}
						
						let tempObjectUser = {
							  confirmedMissions: parseInt(parseInt(docU.data().confirmedMissions) - 1)
							, totalPoints: pointArray
							, currentPoints: parseInt(parseInt(docU.data().currentPoints) - parseInt(docM.data().points))
							, totalPointsSum: parseInt(parseInt(docU.data().totalPointsSum) - parseInt(docM.data().points))
							};
						const docEU = await userRef.doc(id_user).set(tempObjectUser, { merge: true });
						break;
					}
				}				
			}
			res.json({});
		}
	}
	
	
    
})









module.exports = router