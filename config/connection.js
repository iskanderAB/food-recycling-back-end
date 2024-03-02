const mongoose = require('mongoose');

exports.initMongoDb = () =>
    new Promise((resolve, reject) => {
        try {
            mongoose.set('strictQuery', true);
            mongoose
                .connect('mongodb://localhost:27017', {
                    dbName: 'food-recycling-db',
                    autoCreate: true,
                    autoIndex: true,
                })
                .then(() => {
                    console.log('MongoDB Connected ✅');
                    resolve(mongoose.connection);
                })
                .catch((err) => console.log("error => ",err));
        } catch (error) {
            reject(error);
        }
    });