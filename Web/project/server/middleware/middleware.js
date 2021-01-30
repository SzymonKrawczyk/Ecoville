const firestore = require(`../config/db`);

const adminRef = firestore.db.collection('admin');
const missionRef = firestore.db.collection('mission');
const categoryRef = firestore.db.collection('category');
const userRef = firestore.db.collection('user');
const articleRef = firestore.db.collection('tips');
const trophyRef = firestore.db.collection('trophy');

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


const validateAdministratorObject = async (req, res, next) => {

	const id = req.params.id;
	let administratorObject = req.body;
	console.log(`administratorObject`);
	console.log(administratorObject);

	let usernameValidation = req.body.username.length >= 5;
	let passwordValidation = typeof(req.body.password) != 'undefined' ? req.body.password.length >= 8 : true;
		
	let usernameIsUsedValidation;

	const snapshotT = await adminRef.where('name', '==', administratorObject.username).get();	

	console.log(snapshotT.size);

	if(snapshotT.size == 0){
		usernameIsUsedValidation = true;
	}else if(typeof(id) != 'undefined'){
		snapshotT.forEach((doc) => {
			if(id == doc.id){
				usernameIsUsedValidation = true;
			}else{
				usernameIsUsedValidation = false;
			}
		});
	}else{
		usernameIsUsedValidation = false;
	}

	let errorMessage = {
		  usernameError:  usernameValidation ? usernameIsUsedValidation ? null : 'login already in use' : 'username has to be at least 5 characters long'
		, passwordError: passwordValidation ? null : 'password has to be at least 8 characters long'
	};
		
	if (!(usernameValidation && usernameIsUsedValidation && passwordValidation)) {
		return res.json({errorMessage});
	}else{
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
	
	
	let nameIsUsedValidation;

	const snapshotT = await missionRef.where('name', '==', missionObject.name).get();	

	if(snapshotT.size == 0){
		nameIsUsedValidation = true;
	}else if( typeof(id) != 'undefined'){
		snapshotT.forEach((doc) => {
			if(id == doc.id){
				nameIsUsedValidation = true;
			}else{
				nameIsUsedValidation = false;
			}
		});
	}else{
		nameIsUsedValidation = false;
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
		  nameError:  nameValidation ? nameIsUsedValidation ? null : 'mission with this name already exists' : 'name has to be at least 5 characters long'
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

const validateUserObject = async (req, res, next) => {

	const id = req.params.id;
	let userObject = req.body;
	console.log(`userObject`);
	console.log(userObject);
    
    let firstNameValidation =  userObject.firstName.length >= 3;
    let lastNameValidation = userObject.lastName.length >= 3;
	
    let errorMessage = {
        firstNameError: firstNameValidation ? null : 'first name has to be at least 3 characters long',
		lastNamenError: lastNameValidation ? null : 'last name has to be at least 3 characters long',
    };
		
	if (!(firstNameValidation && lastNameValidation)) {
		return res.json({errorMessage});
	} else {
		return next();
	}
}


const validateArticleObject = async (req, res, next) => {

	const id = req.params.id;
	let articleObject = req.body;
	console.log(`articleObject`);
	console.log(articleObject);

	let titleValidation = articleObject.title.length >= 5;
    let shortDescriptionValidation = articleObject.shortDescription.length >= 16;
    let contentValidation = articleObject.content.length >= 64;
		
	let titleIsUsedValidation;

	const snapshotT = await articleRef.where('title', '==', articleObject.title).get();	

	console.log(snapshotT.size);

	if(snapshotT.size == 0){
		titleIsUsedValidation = true;
	}else if(typeof(id) != 'undefined'){
		snapshotT.forEach((doc) => {
			if(id == doc.id){
				titleIsUsedValidation = true;
			}else{
				titleIsUsedValidation = false;
			}
		});
	}else{
		titleIsUsedValidation = false;
	}

	let errorMessage = {
		  titleError:  titleValidation ? titleIsUsedValidation ? null : 'article with this title already exists' : 'articles has to be at least 5 characters long',
		  shortDescriptionError: shortDescriptionValidation ? null : 'short description has to be at least 16 characters long',
		  contentError: contentValidation ? null : 'content has to be at least 64 characters long',
	};

	
	if (!(titleValidation && shortDescriptionValidation && contentValidation && titleIsUsedValidation)) {
		return res.json({errorMessage});
	}else{
		return next();
	}
}


const validateTrophyObject = async (req, res, next) => {

	const id = req.params.id;
	let trophyObject = req.body;
	console.log(`trophyObject`);
	console.log(trophyObject);

	let nameValidation = trophyObject.name.length >= 5;
    let descriptionValidation = trophyObject.description.length >= 16;
    let costValidation = trophyObject.cost >= 0;
    let imageValidation = trophyObject.image.length > 0;
			
	let nameIsUsedValidation;

	const snapshotT = await trophyRef.where('name', '==', trophyObject.name).get();	

	if(snapshotT.size == 0){
		nameIsUsedValidation = true;
	}else if( typeof(id) != 'undefined'){
		snapshotT.forEach((doc) => {
			if(id == doc.id){
				nameIsUsedValidation = true;
			}else{
				nameIsUsedValidation = false;
			}
		});
	}else{
		nameIsUsedValidation = false;
	}

	let errorMessage = {
		nameError:  nameValidation ? nameIsUsedValidation ? null : 'trophy with this name already exists' : 'name has to be at least 5 characters long',
		descriptionError: descriptionValidation ? null : 'description has to be at least 16 characters long',
		costError: costValidation ? null : 'cost has to be non-negative number',
		imageError: imageValidation ? null : 'Media Path is required'
	};
		
	if (!(nameValidation && descriptionValidation && costValidation && imageValidation && nameIsUsedValidation)) {
		return res.json({errorMessage});
	} else {
		return next();
	}
}

const validateCategoryObject = async (req, res, next) => {

	const id = req.params.id;
	let categoryObject = req.body;
	console.log(`categoryObject`);
	console.log(categoryObject);

	let nameValidation = req.body.name.length >= 3;
		
	let nameIsUsedValidation;

	const snapshotT = await categoryRef.where('name', '==', categoryObject.name).get();	

	if(snapshotT.size == 0){
		nameIsUsedValidation = true;
	}else if(typeof(id) != 'undefined'){
		snapshotT.forEach((doc) => {
			if(id == doc.id){
				nameIsUsedValidation = true;
			}else{
				nameIsUsedValidation = false;
			}
		});
	}else{
		nameIsUsedValidation = false;
	}

	let errorMessage = {
		nameError:  nameValidation ? nameIsUsedValidation ? null : 'category with this name already exists' : 'category name has to be at least 3 characters long'
	};
		
	if (!(nameValidation && nameIsUsedValidation)) {
		return res.json({errorMessage});
	}else{
		return next();
	}
}

const trimObj = (req, res, next) => {
	for (var key in req.body) {
		if (typeof(req.body[key]) == 'string'){
			req.body[key] = req.body[key].trim();
		}
	}
	return next();
}


exports.isLogged = isLogged;
exports.isAdmin = isAdmin;
exports.validateAdministratorObject = validateAdministratorObject;
exports.validateMissionObject = validateMissionObject;
exports.validateUserObject = validateUserObject;
exports.validateArticleObject =validateArticleObject;
exports.validateTrophyObject = validateTrophyObject;
exports.validateCategoryObject = validateCategoryObject;
exports.trimObj = trimObj;

