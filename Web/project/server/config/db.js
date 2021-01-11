var admin = require('firebase-admin');

var serviceAccount = require("C:/nodejs_projects/ecoville/server/config/key.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.firestore();

/*async function quickstartListen(db) {
  // [START quickstart_listen]
  // [START firestore_setup_dataset_read]
  const snapshot = await db.collection('cars').get();
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
  // [END firestore_setup_dataset_read]
  // [END quickstart_listen]
}

quickstartListen(db);*/

//module.exports = db;

exports.admin = admin;
exports.db = db;