const router = require(`express`).Router()

const firestore = require(`../config/db`);
const middleware = require(`../middleware/middleware`);

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
                image: doc.data().image,
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
            image: doc.data().image,
        }


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
			
		const docE = await trophyRef.doc(id).set(req.body, { merge: true });
	}
		
	console.log(`Updated trophy with ID: ${id}`);
	res.json({});
		
})


// Delete one record
router.delete(`/trophy/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {	
	
	const id = req.params.id;

	console.log(`Delete trophy ${req.params.id}`);
	const del = await trophyRef.doc(id).delete();
			
	res.json({});     
	   
})

module.exports = router