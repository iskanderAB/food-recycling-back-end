const fetch = require("node-fetch");
const { User } = require("../models/user");


exports.pushNotifcation = async (senderToken = '', post= null) => {

        const ids = (await User.find({}).select('FCMToken')).map(obj => obj.FCMToken).filter(v => v != senderToken);

        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
            'Authorization': 'key=AAAAM1EjFPY:APA91bHvXJt0RhZHD8cuStzjFZ94RorVUxrpqENzVe0GgS9FR10GU7nnwiAHXQFdaETBJu7mUh3p6V8oZtkY_6fJpchLYePzivzGCpLVQXbOLs9u8vfXglRDDSalh5N_F0UvXp9ziBp4',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            notification: {
                title: post.title,
                sound : "default",
                high_priority: "high",
                show_in_foreground: true,
                icon: 'logo',
                body: `New food alert! "${post.title}" is here! \n ${post.description} \n price ${post.price} TND`,
            },
            android:{
                priority:"high"
            },
            // data : post,
            registration_ids: ids ,
        }),
    }).then(res => {
        console.log("notfication success")
    }).catch(e => console.log("error => ", e));

    return response
}