const router = require(`express`).Router()


const bcrypt = require('bcrypt');  // needed for password encryption


const firestore = require(`../config/db`);
const middleware = require(`../middleware/middleware`);

const messageRef = firestore.db.collection('post'); 


// List all records
router.post(`/messagesList/`, middleware.isLogged, middleware.isAdmin, async (req,res) =>  {	

			
	const queryRef = messageRef.orderBy('timestamp', 'desc');
	const snapshot = await queryRef.get();
	
	if (snapshot.empty) {
		
	  console.log('Empty messages list');
	  res.json({errorMessage: 'No messages records'});
	  
	}  else {
		
		console.log("Send messages list");
		let docs = [];
		let messageTable = [];
				
		snapshot.forEach((doc) => {docs.push(doc);});
		
		for (let i = 0; i < docs.length; ++i) {
			
			const currentDoc = docs[i];
			
			const user = await currentDoc.data().id_user.get();			
			let authorString = "";			
			if (!user.exists) {		
				
				authorString = "[deleted]";
					
			} else {
				authorString = `${user.data().firstName} ${user.data().lastName}`;
			}
			
			messageTable.push({
				  _id: currentDoc.id
				, author: authorString
				, author_id: currentDoc.data().id_user.id
				, timestamp: currentDoc.data().timestamp
				, content: currentDoc.data().message
			});				
		}
	
		console.log(messageTable);
		res.json(messageTable);
	}    
})


// Delete one record
router.delete(`/message/:id`, middleware.isLogged, middleware.isAdmin, async (req, res) => {	
    
	const id = req.params.id;
		
	console.log(`Delete message ${req.params.id}`);
	const del = await messageRef.doc(id).delete();
			
	res.json({});
})










module.exports = router