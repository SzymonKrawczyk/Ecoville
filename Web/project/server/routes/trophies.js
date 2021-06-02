const router = require(`express`).Router()

const firestore = require(`../config/db`);
const middleware = require(`../middleware/middleware`);

const path = require("path");
const multer = require("multer");

const trophyRef = firestore.db.collection('trophy');
 

// List all records
router.post(`/trophiesList/`, middleware.isLogged, middleware.isAdmin, async (req,res) =>  {	

	const queryRef = trophyRef;
	const snapshot = await queryRef.get();
	
	if (snapshot.empty) {
		
	  console.log('Empty trophy list');
	  res.json({errorMessage: 'No trophy records'});
	  
	}  else {
		
		console.log("Send trophy list");
		//console.log(req.session);
		let trophyTable = [];
	
		snapshot.forEach((doc) => {
            let temp = {
                name: doc.data().name,
                description: doc.data().description,
                cost: doc.data().cost,
                _id: doc.id
            }
            trophyTable.push(temp);
		});
		console.log(trophyTable);
		res.json(trophyTable);
	}    
})


// Add new record
router.post(`/trophy/`, middleware.isLogged, middleware.isAdmin, middleware.trimObj, middleware.validateTrophyObject, async (req, res) => {    
	
	const id = req.params.id;
    console.log(req.body);
	req.body.cost = parseInt(req.body.cost);

    const doc = await trophyRef.add(req.body);

	console.log(`Added trophy with ID: ${doc.id}`);
    res.json({});   
})

// Read one record
router.get(`/trophy/:id`,  middleware.isLogged, middleware.isAdmin, async (req, res) => {
	
	const id = req.params.id;
    console.log(`Get trophy ${id}`);
	const doc = await trophyRef.doc(id).get();
	
	if (!doc.exists) {

		console.log('No trophy');
		res.json({errorMessage: `No trophy: ${id}`});
		
	} else {		
		console.log('trophy ' + doc.data().name);

		trophyObject = {
            name: doc.data().name,
            description: doc.data().description,
            cost: doc.data().cost,
			pic: "defaultTrophy.jpg"
			
            , _id: doc.id
			
        }
		
		// img
		const pic = doc.id;
		
		console.log(`Pic: ${id}`);
			
		let bucket = firestore.admin.storage().bucket();
		//console.log(bucket);
		try {
			await bucket.file("trophies/" + pic).download({destination: "./public/trophies/" + pic}); 
			
			trophyObject.pic = pic;
		} catch (error) {
			console.log("no pic");
			console.log(error);
		}
		
		console.log(trophyObject);


		res.json(trophyObject);
	}
			
	
})

// Update one record
router.put(`/trophy/:id`, middleware.isLogged, middleware.isAdmin, middleware.trimObj, middleware.validateTrophyObject, async (req, res) => {
	
	const id = req.params.id;
	console.log(req.body);
		
	const doc = await trophyRef.doc(id).get();
	
	if (!doc.exists) {
			
		console.log('No trophy');
		res.json({errorMessage: `No trophy: ${id}`});
			
	} else {
			
		req.body.cost = parseInt(req.body.cost);
		const docE = await trophyRef.doc(id).set(req.body, { merge: true });
	}
		
	console.log(`Updated trophy with ID: ${id}`);
	res.json({});
		
})

router.post(`/trophyUploadPicture/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {
	
	console.log("pic trophy upload")
	const id = req.params.id;
    //console.log(req.body);
		
	const doc = await trophyRef.doc(id).get();	
	if (!doc.exists) {
			
		console.log('No trophy');
		res.json({errorMessage: `No trophy: ${id}`});
			
	} else {
		
		console.log(req.body)
		console.log(req.data)
		
		
		const upload = multer({ storage: multer.memoryStorage() }).single('file')
		
		upload(req, res, (err) => {
		
			//console.log("Request ---", req.body);
			console.log("Request file ---", req.file);
			
			let bucket = firestore.admin.storage().bucket();
		
			try {
				
				
				const blob = bucket.file("trophies/" + doc.id);
				
				const blobWriter = blob.createWriteStream({
					metadata: {
						contentType: req.file.mimetype
					}
				})
				
				blobWriter.on('error', (err) => {
					console.log(err)
				})
				
				blobWriter.on('finish', () => {
					console.log(`Updated trophy picture with ID: ${id}`);
					res.status(200).send("File uploaded.")
				})
				
				blobWriter.end(req.file.buffer)

				
			} catch (error) {
				console.log("pic error");
			}
			
			
			//res.json({});
			
		})	
		
	}
})


// Delete one record
router.delete(`/trophy/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {	
	
	const id = req.params.id;

	console.log(`Delete trophy ${req.params.id}`);
	
	const docU = await trophyRef.doc(id).get();

    if (!docU.exists) {
		
        console.log('No trophy');
        res.json({errorMessage: `No trophy: ${id}`});
		
    }else{

		// img
		const pic = id;
		
		console.log(`Trophy pic: ${pic}`);
		
		// delete from storage
			try {
				let bucket = firestore.admin.storage().bucket();
			//console.log(bucket);
				await bucket.file("trophies/" + pic).delete(); 
			} catch (error) {
				console.log("no pic");
			}
			
		
			
		// delete local
			try { 
				var fs = require('fs');
				var filePath = './public/trophies/' + pic;
				fs.unlink(filePath);
			} catch (error) {
				console.log("no local pic");
			}
		console.log(`Deleted trophy image`);

		const del = await trophyRef.doc(id).delete();
        res.json({});    
    }	   
})

// remove picture
router.post(`/trophyDeletePic/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {	
	
    const id = req.params.id;


    const docU = await trophyRef.doc(id).get();

    if (!docU.exists) {
		
        console.log('No trophy');
        res.json({errorMessage: `No trophy: ${id}`});
		
    }else{

		// img
		const pic = id;
		
		console.log(`Trophy pic: ${pic}`);
		
		// delete from storage
			try {
				let bucket = firestore.admin.storage().bucket();
			//console.log(bucket);
				await bucket.file("trophies/" + pic).delete(); 
			} catch (error) {
				console.log("no pic");
			}
			
		
			
		// delete local
			try { 
				var fs = require('fs');
				var filePath = './public/trophies/' + pic;
				fs.unlink(filePath);
			} catch (error) {
				console.log("no local pic");
			}
		console.log(`Deleted trophy image`);

        res.json({});    
    }
})

module.exports = router