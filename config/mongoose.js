const mongoose=require('mongoose');
const env=require('./environment');
mongoose.connect(`mongodb://127.0.0.1/${env.db}`);//connectiong mongoose to the database named contacts_lists_db
const db=mongoose.connection;//acquired the connection to check if it is successful
db.on('error',console.error.bind(console,'error connecting to db'));
db.once('open',function(){//this function will be called once connection is established
    console.log('Succesfully connected to the database');
});
