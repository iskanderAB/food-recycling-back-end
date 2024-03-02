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




app.use(express.json());
app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.post("/notifications", async (req, res)=> {
// try {
//     const response = await fetch('https://fcm.googleapis.com/fcm/send', {
//         method: 'POST',
//         headers: {
//             'Authorization': 'key=AAAAyg5U0Gs:APA91bGRwiJJ6ROKuC42-4G7hGDtuBbuhLBMfHcm8_FyT8vTWj7F-8cKnWXzDJiRkMzszt3LKaLR7o33AyVGeZjc_SY8Ymypio01eI81py7mdGX_tteVa5sVBJ-LSRAuRfrGHufytJG-',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             notification: {
//                 title: "isaknder"
//             },
//             registration_ids: ['dL7RFtHtSfGlHbXyBrGDjp:APA91bE3n93uL1wd_aGMihjjHIGw8mP0jBDeCeza38rDbwxUeV9vh8JPy3GrvdHpPa5V0Q86OKoD1s6Bd6ZtGbAiGMgMYtAwtNspdSd5GoWXy7hORTJH8XIboe4ELViKS76naakWCpEE'],
//         }),
//     });

//     if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     // Handle successful response here
//     // For example, you can parse the response JSON if it is returned
//     const result = await response.json();
//     console.log(result);
// } catch (error) {
//     // Handle errors here
//     console.error('Error during fetch:', error);
// }
//     res.send({message: "hello"})
// })
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
    await Post.create({
        title: req.body.title,
        description: req.body.description,
        image: fileName,
        price: req.body.price
    })
    return res.status(201).json({
            message: "success"
    });
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