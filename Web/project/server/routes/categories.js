const router = require(`express`).Router()

const firestore = require(`../config/db`);
const middleware = require(`../middleware/middleware`);

const categoryRef = firestore.db.collection('category');
 


// List all records
router.post(`/categoriesList/`, middleware.isLogged, middleware.isAdmin, async (req,res) =>  {	

			
	const queryRef = categoryRef;
	const snapshot = await queryRef.get();
	
	if (snapshot.empty) {
		
	  console.log('Empty category list');
	  res.json({errorMessage: 'No categories'});
	  
	}  else {
		
		console.log("Send category list");
		//console.log(req.session);
		let categoryTable = [];
	
		snapshot.forEach((doc) => {
			
			categoryTable.push({
				name: doc.data().name,
				_id: doc.id
			});
				
		});
		console.log(categoryTable);
		res.json(categoryTable);
	}    
})


module.exports = router