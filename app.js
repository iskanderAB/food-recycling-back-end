const express = require("express");
const cors = require('cors');
const app = express();
const fetch = require('node-fetch');
const uuid =  require('uuid');
const {Post} =  require('./models/post');
const fileUpload = require('express-fileupload');
const router = express.Router();
const routerUsers = require('./routes/usersRouter')
const routerAlerts = require('./routes/alertRoutes')
const connection = require('./config/connection');
const { pushNotifcation } = require("./services/pushNotification");
const { Types } = require("mongoose");




app.use(express.json());
app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use(routerUsers.router);
app.use(routerAlerts.router);

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.post('/post-data',async (req, res)=> { 
    // Check if files were uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    console.log("header => ",req.get('user-data'))
    const user = req.headers.user;
        // Access the uploaded file
    const file = req.files.image;
    
    console.log(" data =>  ",req.body);
    const fileName = uuid.v4()+file.name; 
    // Move the file to the desired location
    file.mv(__dirname + '/uploads/' + fileName, err => {
        if (err) {
            return res.status(500).send(err);
        }
    });
    const data= JSON.parse(req.get('user-data'));

    const post = await Post.create({
        title: req.body.title,
        description: req.body.description,
        image: fileName,
        price: req.body.price,
        user: new Types.ObjectId(data._id)
    })
    // sender token => FCMToken
    await pushNotifcation(data._id, post)
    return res.status(201).json({
            message: "success"
    });
})  


app.get('/getAllPosts', async (req, res) => {
    const posts = await Post.find().populate('user',['username']);
    res.status(200).json(posts);
});


app.post('/test-notification',async (req, res)=> { 
    return res.send(await pushNotifcation())
})



router.get('/*', (req, res) => {
    res.status(404).json('endPoint not found !');
});

(async () => {
    try {
        await connection.initMongoDb();
        app.listen(4000, () => {
            console.log(`Server started on : ${4000} ✅`);
        });
    } catch (error) {
        throw new Error(error);
    }
})();