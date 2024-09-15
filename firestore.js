const { resolve } = require('path');
const firestore = require(resolve('firebaseConfig')).fireStore;

exports.fireStoreGetDataById = async (collectionName, id) => {
    const collectionRef = await firestore.collection(collectionName);
    const doc = await collectionRef.doc(id).get();
    return doc.data()
}

exports.fireStoreSetData = async (collectionName, data) => {
    const collectionRef = await firestore.collection(collectionName);
    const doc = await collectionRef.add(data);
    return { id: doc.id, ...data };
}
exports.fireStoreSetDataWithId = async (collectionName, id, data) => {
    const collectionRef = await firestore.collection(collectionName);
    const doc = await collectionRef.doc(id).set(data);
    return { id: id, ...data };
}

exports.fireStoreUpdateDataWithId = async (collectionName, id, data) => {
    const collectionRef = await firestore.collection(collectionName);
    const doc = await collectionRef.doc(id).update(data);
    return { id: id, ...data };
}