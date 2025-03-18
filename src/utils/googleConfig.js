const google = require("googleapis");

const GOOGLE_CLIENT_ID = "76478372265-2qh2ggb205uum7huabfqptrfg2fpf1hk.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

exports.oauth2Client = new google.Auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'postmessage'
);