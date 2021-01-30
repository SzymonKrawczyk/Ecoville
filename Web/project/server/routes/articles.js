const router = require(`express`).Router()

const firestore = require(`../config/db`);
const middleware = require(`../middleware/middleware`);

const articleRef = firestore.db.collection('tips');
const userRef = firestore.db.collection('user');
 

// List all records
router.post(`/articlesList/`, middleware.isLogged, middleware.isAdmin, async (req,res) =>  {	

	const queryRef = articleRef.orderBy('added', 'desc');
	const snapshot = await queryRef.get();
	
	if (snapshot.empty) {
		
	  console.log('Empty articles list');
	  res.json({errorMessage: 'No articles records'});
	  
	}  else {
		
		console.log("Send articles list");
		//console.log(req.session);
		let articleTable = [];
	
		snapshot.forEach((doc) => {
            let temp = {
                title: doc.data().title,
                likedBy: doc.data().likedBy,
                shortDescription: doc.data().shortDescription,
                content: doc.data().content,
                added: doc.data().added,
                _id: doc.id
            }
            articleTable.push(temp);
		});
		console.log(articleTable);
		res.json(articleTable);
	}    
})


// Add new record
router.post(`/article/`, middleware.isLogged, middleware.isAdmin, middleware.trimObj, middleware.validateArticleObject, async (req, res) => {    
		
	const id = req.params.id;
	console.log(req.body);
        
    let temp = {
        title:  req.body.title,
        shortDescription:req.body.shortDescription,
        content: req.body.content,
        likedBy: [],
        added: firestore.admin.firestore.Timestamp.fromDate(new Date(Date.now()))
    }
    
    //const doc = await articleRef.add(req.body);
    const doc = await articleRef.add(temp);


	console.log(`Added article with ID: ${doc.id}`);
    res.json({});   
})

// Read one record
router.get(`/article/:id`,  middleware.isLogged, middleware.isAdmin, async (req, res) => {
	
	const id = req.params.id;
    console.log(`Get article ${id}`);
	const doc = await articleRef.doc(id).get();
	
	if (!doc.exists) {
		console.log('No article');
		res.json({errorMessage: `No article: ${id}`});
		
	} else {
        console.log('article ' + doc.data().title);
        
        articleObject = {
            title: doc.data().title,
            likes: doc.data().likedBy != null ? doc.data().likedBy.length : 0,
            shortDescription: doc.data().shortDescription,
            content: doc.data().content,
            added: doc.data().added
        }

		res.json(articleObject);
	}
			
	
})

// Update one record
router.put(`/article/:id`, middleware.isLogged, middleware.isAdmin, middleware.trimObj, middleware.validateArticleObject, async (req, res) => {
	
	const id = req.params.id;
    console.log(req.body);
    
	const doc = await articleRef.doc(id).get();
	
	if (!doc.exists) {
			
		console.log('No article');
		res.json({errorMessage: `No article: ${id}`});
			
	} else {
			
		const docE = await articleRef.doc(id).set(req.body, { merge: true });
	}
		
	console.log(`Updated article with ID: ${id}`);
	res.json({});
})


// Delete one record
router.delete(`/article/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {	
	
	const id = req.params.id;

	console.log(`Delete article ${req.params.id}`);
	const del = await articleRef.doc(id).delete();
			
	res.json({});     
	   
})

module.exports = router