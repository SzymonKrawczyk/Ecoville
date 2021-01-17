const firestore = require(`../config/db`);

const missionRef = firestore.db.collection('mission');
const categoryRef = firestore.db.collection('category');
const userRef = firestore.db.collection('user');

const isLogged = (req, res, next) => {
	
    if(typeof req.session.user == `undefined`) {    
	
		console.log("Middleware isLogged: false");
		req.session.destroy();
        return res.json({errorMessage:`User is not logged`, isLogged: false});
		
    } else {
		
		console.log("Middleware isLogged: true");
		
        return next();
    }
}

const isAdmin = (req, res, next) => {
	
    if(req.session.user.accessLevel < process.env.ACCESS_LEVEL_ADMIN) {    
	
		console.log("Middleware isAdmin: false");
		req.session.destroy();
        return res.json({errorMessage:`User is not admin`, isAdmin: false});
		
		
    } else {
		
		console.log("Middleware isAdmin: true");
        return next();
    }
}



const validateMissionObject = async (req, res, next) => {
	
    let missionObject = req.body;
	console.log(`missionObject`);
	console.log(missionObject);
	
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
	
	if (!(nameValidation && categoryValidation && pointsValidation && dateValidation && durationValidation && locationValidation && descriptionValidation && requiredParticipantsValidation)) {
		return res.json({errorMessage});
	} else {
		return next();
	}
}

exports.isLogged = isLogged;
exports.isAdmin = isAdmin;
exports.validateMissionObject = validateMissionObject;
