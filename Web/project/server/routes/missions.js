const router = require(`express`).Router()


const bcrypt = require('bcrypt');  // needed for password encryption


const firestore = require(`../config/db`);
const middleware = require(`../middleware/middleware`);

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
router.post(`/mission/`, middleware.isLogged, middleware.isAdmin, async (req, res) => {    
		
	const id = req.params.id;
		
	let missionObject = req.body;
	console.log(req.body);
	
	let nameValidation = missionObject.name.length >= 5;
		
	let categoryValidation = false;
	
	const snapshot = await categoryRef.get();
	
	if (snapshot.empty) {
		
	  console.log('Empty category list');
	  
	}  else {
		
		let categoryTable = [];
	
		snapshot.forEach((doc) => {
			
			categoryTable.push(doc.id);
				
		});
		
		for (let i = 0; i < categoryTable.length; ++i) {
			if (missionObject.id_category == categoryTable[i]) {
				categoryValidation = true;
				missionObject.id_category = categoryRef.doc(categoryTable[i]);
				break;
			}
		}
		
	} 
		
	missionObject.points = parseInt(missionObject.points);
	let pointsValidation = missionObject.points > 0;
		
	let dateValidation = true;
			
			//console.log(missionObject.when);
			//console.log(new Date(missionObject.when));
			//console.log(new Date());
	if (new Date(missionObject.when) <= new Date()) dateValidation = false;
	missionObject.when = firestore.admin.firestore.Timestamp.fromDate(new Date(missionObject.when));
		
	missionObject.durationMinutes = parseInt(missionObject.durationMinutes);
	let durationValidation = missionObject.durationMinutes > 0;
		
	let locationValidation = missionObject.location.length < 3 && missionObject.location.length > 0;
		
	let descriptionValidation = missionObject.description.trim().length >= 16;
		
	missionObject.requiredParticipants = parseInt(missionObject.requiredParticipants);
	let requiredParticipantsValidation = missionObject.requiredParticipants > 0;
		
	const errorMessage = {
		  nameError: nameValidation ? null : 'name has to be at least 5 characters long'
		, categoryError: categoryValidation ? null : 'category is required'
		, pointsError: pointsValidation ? null : 'points value has to be greater than 0'
		, dateError: dateValidation ? null : 'future date in format dd/mm/yyyy hh:mm:ss is required'
		, durationError: durationValidation ? null : 'duration value has to be greater than 0'
		, locationError: locationValidation ? null : 'location name has to be shorter than 3 characters'
		, descriptionError: descriptionValidation ? null : 'description has to be at least 16 characters long'
		, requiredParticipantsError: requiredParticipantsValidation ? null : 'value has to be greater than 0'
	}
	
	
	
	const snapshotT = await missionRef.where('name', '==', missionObject.name).get();	
	//console.log(snapshotT);
	if (!(snapshotT.empty)) { 
		nameValidation = false;
		errorMessage.nameError = 'Name is being used'; 
	}
	
		
	if (!(nameValidation && categoryValidation && pointsValidation && dateValidation && durationValidation && locationValidation && descriptionValidation && requiredParticipantsValidation)) {
		res.json({errorMessage});
		return;
	}
		
		
		
    missionObject.added = firestore.admin.firestore.Timestamp.fromDate(new Date(Date.now()));
	missionObject.currentParticipants = [];
	
    const doc = await missionRef.add(req.body);

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
router.put(`/mission/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {
		
		
	const id = req.params.id;
	let missionObject = req.body;
	console.log(req.body);
	
	let nameValidation = missionObject.name.length >= 5;
		
	let categoryValidation = false;
	
	const snapshot = await categoryRef.get();
	
	if (snapshot.empty) {
		
	  console.log('Empty category list');
	  
	}  else {
		
		let categoryTable = [];
	
		snapshot.forEach((doc) => {
			
			categoryTable.push(doc.id);
				
		});
		
		for (let i = 0; i < categoryTable.length; ++i) {
			if (missionObject.id_category == categoryTable[i]) {
				categoryValidation = true;
				missionObject.id_category = categoryRef.doc(categoryTable[i]);
				break;
			}
		}
		
	} 
		
	missionObject.points = parseInt(missionObject.points);
	let pointsValidation = missionObject.points > 0;
		
	let dateValidation = true;
			
			//console.log(missionObject.when);
			//console.log(new Date(missionObject.when));
			//console.log(new Date());
	if (new Date(missionObject.when) <= new Date()) {
		
		delete missionObject.when;
		
	} else {
		
		missionObject.when = firestore.admin.firestore.Timestamp.fromDate(new Date(missionObject.when));
	}
		
	missionObject.durationMinutes = parseInt(missionObject.durationMinutes);
	let durationValidation = missionObject.durationMinutes > 0;
		
	let locationValidation = missionObject.location.length < 3 && missionObject.location.length > 0;
		
	let descriptionValidation = missionObject.description.trim().length >= 16;
		
	missionObject.requiredParticipants = parseInt(missionObject.requiredParticipants);
	let requiredParticipantsValidation = missionObject.requiredParticipants > 0;
		
	const errorMessage = {
		  nameError: nameValidation ? null : 'name has to be at least 5 characters long'
		, categoryError: categoryValidation ? null : 'category is required'
		, pointsError: pointsValidation ? null : 'points value has to be greater than 0'
		, dateError: dateValidation ? null : 'future date in format dd/mm/yyyy hh:mm:ss is required'
		, durationError: durationValidation ? null : 'duration value has to be greater than 0'
		, locationError: locationValidation ? null : 'location name has to be shorter than 3 characters'
		, descriptionError: descriptionValidation ? null : 'description has to be at least 16 characters long'
		, requiredParticipantsError: requiredParticipantsValidation ? null : 'value has to be greater than 0'
	}
	
	
	
	const snapshotT = await missionRef.where('name', '==', missionObject.name).get();	
	//console.log(snapshotT);
	if (!(snapshotT.empty) && snapshotT.docs[0].id != id) { 
		//console.log(snapshot.docs[0].id)
		//console.log(id)
		nameValidation = false;
		errorMessage.nameError = 'Name is being used'; 
	}
	
		
	if (!(nameValidation && categoryValidation && pointsValidation && dateValidation && durationValidation && locationValidation && descriptionValidation && requiredParticipantsValidation)) {
		res.json({errorMessage});
		return;
	}
			
		
	const doc = await missionRef.doc(id).get();
	
	if (!doc.exists) {
			
		console.log('No mission');
		res.json({errorMessage: `No mission: ${id}`});
			
	} else {
			
		const docE = await missionRef.doc(id).set(missionObject, { merge: true });
	}
		

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
				
				console.log(docM.data().currentParticipants);
				
				for (let i = 0; i < docM.data().currentParticipants.length; ++i) {
					
					if (id_user == docM.data().currentParticipants[i].id_user.id) {
						
						let tempObjectMission = {currentParticipants: docM.data().currentParticipants};
						tempObjectMission.currentParticipants[i].confirmed = true;
						//console.log(tempObjectMission);
						//console.log(docM.data());
						const docEM = await missionRef.doc(id_mission).set(tempObjectMission, { merge: true });
						
						
						let tempObjectUser = {confirmedMissions: parseInt(parseInt(docU.data().confirmedMissions) + 1)};
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