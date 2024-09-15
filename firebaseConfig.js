const { resolve } = require('path');
const admin = require("firebase-admin");
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccountKey = require(resolve('firebaseServiceAccountKey.json'));

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)

});

const fireStore = getFirestore(firebaseAdmin);

module.exports = { fireStore: fireStore };