const router = require(`express`).Router()

const firestore = require(`../config/db`);
const middleware = require(`../middleware/middleware`);

const path = require("path");
const multer = require("multer");

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
	
	console.log(req.body.pic)

    const doc = await gadgetRef.add(req.body);
	console.log(`Added gadget with ID: ${doc.id}`);
	
    res.json({id: doc.id});   
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
		const pic = doc.id;
		
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



router.post(`/gadgetUploadPicture/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {
	
	console.log("pic gadget upload")
	const id = req.params.id;
    //console.log(req.body);
		
	const doc = await gadgetRef.doc(id).get();	
	if (!doc.exists) {
			
		console.log('No gadget');
		res.json({errorMessage: `No gadget: ${id}`});
			
	} else {
		
		
		const upload = multer({ storage: multer.memoryStorage() }).single('file')
		
		upload(req, res, (err) => {
		
			//console.log("Request ---", req.body);
			console.log("Request file ---", req.file);
			
			let bucket = firestore.admin.storage().bucket();
		
			try {
				
				
				const blob = bucket.file("gadgets/" + doc.id);
				
				const blobWriter = blob.createWriteStream({
					metadata: {
						contentType: req.file.mimetype
					}
				})
				
				blobWriter.on('error', (err) => {
					console.log(err)
				})
				
				blobWriter.on('finish', () => {
					console.log(`Updated gadget picture with ID: ${id}`);
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

/*router.post(`/gadgetUploadPicture/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {
	
	console.log("pic gadget upload")
	const id = req.params.id;
    //console.log(req.body);
		
	const doc = await gadgetRef.doc(id).get();	
	if (!doc.exists) {
			
		console.log('No gadget');
		res.json({errorMessage: `No gadget: ${id}`});
			
	} else {
		
		const storage = multer.diskStorage({
			//destination: "./public/uploads/",
			destination: function (req, file, cb) {
			  cb(null, './public/uploads/')
			},
			filename: function(req, file, cb){
				cb(null,doc.id);
			}
		});
		var upload = multer({ storage: storage }).single('file')
		
		upload(req, res, (err) => {
		
			console.log("Request ---", req.body);
			console.log("Request file ---", req.file);
			
			let bucket = firestore.admin.storage().bucket();
		
			try {
				const options = {
				  destination: 'gadgets/' + doc.id
				};

				bucket.upload('./uploads/' + doc.id, options, function(err, file) {
				  // Your bucket now contains:
				  // - "new-image.png" (with the contents of `local-image.png')

				  // `file` is an instance of a File object that refers to your new file.
				});
				
				//gadgetObject.pic = pic;
			} catch (error) {
				console.log("pic error");
			}
			
			
			console.log(`Updated gadget picture with ID: ${id}`);
			res.json({});
			
			//if(!err) return res.send(200).end();
		})
		
		//const tempGadget = {pic: id}
		//const docE = await gadgetRef.doc(id).set(tempGadget, { merge: true });
		
		
	}
})
*/


// Delete one record
router.delete(`/gadget/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {	
	
	const id = req.params.id;

	console.log(`Delete gadget ${req.params.id}`);
	
	
	// delete files

    const docU = await gadgetRef.doc(id).get();

    if (!docU.exists) {
		
        console.log('No gadget');
        res.json({errorMessage: `No gadget: ${id}`});
		
    }else{

		// img
		const pic = id;
		
		console.log(`Gadget pic: ${pic}`);
		
		// delete from storage
			try {
				let bucket = firestore.admin.storage().bucket();
			//console.log(bucket);
				await bucket.file("gadgets/" + pic).delete(); 
			} catch (error) {
				console.log("no pic");
			}
			
		
			
		// delete local
			try { 
				var fs = require('fs');
				var filePath = './public/gadgets/' + pic;
				fs.unlink(filePath);
			} catch (error) {
				console.log("no local pic");
			}
		console.log(`Deleted gadget image`);

        const del = await gadgetRef.doc(id).delete();
		console.log('Successfully deleted gadget ' + id);
		res.json({});  
    }
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
		const pic = id;
		
		console.log(`Gadget pic: ${pic}`);
		
		// delete from storage
			try {
				let bucket = firestore.admin.storage().bucket();
			//console.log(bucket);
				await bucket.file("gadgets/" + pic).delete(); 
			} catch (error) {
				console.log("no pic");
			}
			
		
			
		// delete local
			try { 
				var fs = require('fs');
				var filePath = './public/gadgets/' + pic;
				fs.unlink(filePath);
			} catch (error) {
				console.log("no local pic");
			}
		console.log(`Deleted gadget image`);

        res.json({});    
    }
})

module.exports = router