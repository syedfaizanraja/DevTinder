const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const {subDays, endOfDay, startOfDay} = require("date-fns");

cron.schedule("* * * * * ", async () =>{
    // Send a mail to users everyday at 8:00 AM who got requests from previous day.

    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    try{
        const pendingRequests =  await ConnectionRequestModel.find({
            status : "interested",
            createdAt : {
                $gte : yesterdayStart,
                $lt : yesterdayEnd
            }
        }).populate("fromUserId", "toUserId");

        const listOfEmails = [...new set (pendingRequests.map(req => req.toUserId.emailId))];

        for(const email in listOfEmails){
            // Send an email to user
        }
    }
    catch(err){
        console.log("Error : " + err.message);
    }
});
