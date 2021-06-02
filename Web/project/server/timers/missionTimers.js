const firestore = require(`../config/db`);

let missionTimersArray = [1, 2];



const missionCompleter = async (mission) => {
				
	//mission.confirmed = true;
	const docM = await firestore.db.collection('mission').doc(mission._id).get();
				
	if (docM.exists) {
		//console.log(docM.data())
		let currentMissionObject = {
			  currentParticipants: []
			, name: docM.data().name
			, completed: true
			}
		
		let userArr = docM.data().currentParticipants != null ? docM.data().currentParticipants : [];
		
				
		for (let i = 0; i < userArr.length; ++i) {
			
			if (userArr[i].confirmed == false){
				
				const currentUser = userArr[i].id_user;
				const userGet = await currentUser.get();	
						
				if (userGet.exists) {		
										
					currentMissionObject.currentParticipants.push({
						  id_user: currentUser
						, confirmed: false
					});		
				}
			}
		}
		
						
		
			
			
		for (let i = 0; i < currentMissionObject.currentParticipants.length; ++i) {
					
			if (currentMissionObject.currentParticipants[i].confirmed == false){
				
				currentMissionObject.currentParticipants[i].confirmed = true;
				
				id_user = currentMissionObject.currentParticipants[i].id_user.id;
							
					
				const docU = await firestore.db.collection('user').doc(id_user).get();
						
				if (docU.exists) {
							
					pointArray = docU.data().totalPoints != null ? docU.data().totalPoints : [];
					let addedPoints = false;
					for (let p = 0; p < pointArray.length; ++p) {
								
						if (pointArray[p].id_category._path.segments[1] == docM.data().id_category._path.segments[1]) {
									
							pointArray[p].points = pointArray[p].points + docM.data().points;
							addedPoints = true;
							break;
						}
					}
					
					if (!addedPoints) {
						pointArray.push({
							  id_category: docM.data().id_category
							, points: docM.data().points
							})
					}
							
					let tempObjectUser = {
						  confirmedMissions: parseInt(parseInt(docU.data().confirmedMissions) + 1)
						, totalPoints: pointArray
						, currentPoints: parseInt(parseInt(docU.data().currentPoints) + parseInt(docM.data().points))
						, totalPointsSum: parseInt(parseInt(docU.data().totalPointsSum) + parseInt(docM.data().points))
						};
						//console.log(tempObjectUser)
					const docEU = await firestore.db.collection('user').doc(id_user).set(tempObjectUser, { merge: true });
				}
			} 
		}		
				
				
		//console.log(currentMissionObject)
		const docEM = await firestore.db.collection('mission').doc(mission._id).set(currentMissionObject, { merge: true });
				
		console.log("complete: " + currentMissionObject.name);
	}

		
}






const missionTimers = async() => {		
	
	//console.log(missionTimersArray)
	
	missionTimersArray.forEach((timer) => { clearTimeout(timer); });
	
	missionTimersArray = [];
	
	//console.log(missionTimersArray);
	
	console.log("\n Fetching missions...");
	const snapshot = await firestore.db.collection('mission').get();
	console.log(` ${snapshot.docs.length} missions found`);
		
	if (!snapshot.empty) {
		for (let i = 0; i < snapshot.docs.length; ++i) {
			
			const currentDoc = snapshot.docs[i];
			
			let currentMissionObject = {
			  _id: currentDoc.id
			, currentParticipants: []
			, name: currentDoc.data().name
			, when: currentDoc.data().when
			, completed: currentDoc.data().completed
			}
			
			//console.log(` mission: ${currentMissionObject.name}`);
			
			
			
			
			if (typeof(currentMissionObject.completed) == "undefined"){
				currentMissionObject.completed = false;
				//console.log(` mission: ${currentMissionObject.completed}`);
			}		
			
			
			console.log(` mission ${currentMissionObject.name}: completed=${currentMissionObject.completed}`);
			
			
			
			
			
			
			
			
			
			
			
			
			
			if (currentMissionObject.completed == false) {
				//console.log(` mission: ${currentMissionObject.completed}`);
				let when = new Date(currentMissionObject.when._seconds * 1000)
				console.log("  when " + when);
				let timeLeft = (when - Date.now());
				console.log("  time left " + timeLeft + "ms");
				
				if (!(timeLeft >= 40 * 24 * 60 * 60 * 1000)) { 
					
					let time = timeLeft > 0 ? timeLeft : 1; 
					
					console.log("  setting timer: " + parseInt(time / 1000) + "s");
									
					let timer = setTimeout(function() {
									missionCompleter(currentMissionObject);
								}, time);
					
					missionTimersArray.push(timer)
					
				} else {
					
					console.log("  mission too far into the future, timer not set");
				}
			
			}	
			
			//console.log(missionTimersArray)
		}
	}
}	



exports.missionTimers = missionTimers;