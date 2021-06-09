const router = require(`express`).Router()

const firestore = require(`../config/db`);
const middleware = require(`../middleware/middleware`);

const categoryRef = firestore.db.collection('category');
 

// List all records
router.post(`/CategoriesList/`, middleware.isLogged, middleware.isAdmin, async (req,res) =>  {	

	const queryRef = categoryRef;
	const snapshot = await queryRef.get();
	
	if (snapshot.empty) {
		
	  console.log('Empty category list');
	  res.json({errorMessage: 'No category records'});
	  
	}  else {
		
		console.log("Send category list");
		//console.log(req.session);
		let categoryTable = [];
	
		snapshot.forEach((doc) => {
            let temp = {
                name: doc.data().name,
				used: doc.data().used,
                _id: doc.id
            }
            categoryTable.push(temp);
		});
		console.log(categoryTable);
		res.json(categoryTable);
	}    
})


// Add new record
router.post(`/category/`, middleware.isLogged, middleware.isAdmin, middleware.trimObj, middleware.validateCategoryObject, async (req, res) => {    
		
	const id = req.params.id;
	req.body.used = false;
	console.log(req.body);
	
	    
    const doc = await categoryRef.add(req.body);
	

	console.log(`Added category with ID: ${doc.id}`);
    res.json({});   
})

// Read one record
router.get(`/category/:id`,  middleware.isLogged, middleware.isAdmin, async (req, res) => {
	
	const id = req.params.id;
    console.log(`Get category ${id}`);
	const doc = await categoryRef.doc(id).get();
	
	if (!doc.exists) {

		console.log('No category');
		res.json({errorMessage: `No category: ${id}`});
		
	} else {
		console.log('category ' + doc.data().name);
		res.json({
			name: doc.data().name,
			used: doc.data().used,
			_id: doc.id
			});
	}
			
	
})

// Update one record
router.put(`/category/:id`, middleware.isLogged, middleware.isAdmin, middleware.trimObj, middleware.validateCategoryObject, async (req, res) => {
	
	const id = req.params.id;
	console.log(req.body);
	
	const doc = await categoryRef.doc(id).get();
	
	if (!doc.exists || req.body.used) {
			
		console.log('No category');
		res.json({errorMessage: `No category: ${id}`});
			
	} else {
			
		const docE = await categoryRef.doc(id).set(req.body, { merge: true });
	}
		
	console.log(`Updated category with ID: ${id}`);
	res.json({});
		
})


// Delete one record
router.delete(`/category/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {	
	
	const id = req.params.id;

	console.log(`Delete category ${req.params.id}`);
	
	const doc = await categoryRef.doc(id).get();
	
	if (!doc.exists) {

		console.log('No category');
		res.json({errorMessage: `No category: ${id}`});
		
	} else {
		
		if (doc.data().used == false) {
			
			const del = await categoryRef.doc(id).delete();
			res.json({});  
			
		} else {
			
			res.json({errorMessage: `Category used`});  
		}
	}
			   
	   
})

module.exports = router