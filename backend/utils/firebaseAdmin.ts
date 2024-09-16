import admin from 'firebase-admin';
const serviceAccount = require("./team-nebula-43946-firebase-adminsdk-tt032-6cf1f8c2c0.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export default admin