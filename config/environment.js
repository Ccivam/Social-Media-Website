const fs=require('fs');
const rfs=require('rotating-file-stream');
const path=require('path');
const logDirectory=path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory)||fs.mkdirSync(logDirectory);

const accessLogStream= rfs.createStream('access.log',{
       interval:'1d',
       path:logDirectory

});
const development={
    name:'development',
    asset_path:'./assets',
    session_cookie_key:'blahsomething',
    db:'codeial_production',
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.GOOGLE_CALLBACK_URL,
    jwt_key:"switter",
    morgan:{
        mode:'dev',
        options:{stream:accessLogStream}

    }
}

const production={
    name:'production',
    asset_path:process.env.CODEIAL_ASSET_PATH,
    session_cookie_key:process.env.SESSION_COOKIE_KEY,
    db:process.env.codeial_db,
    google_client_id:process.env.GOOGLE_CLIENT_ID,
    google_client_secret:process.env.GOOGLE_CLIENT_SECRET,
    google_call_back_url:process.env.GOOGLE_CALLBACK_URL,
    jwt_key:process.env.jwt_key || 'switter',
    morgan:{
        mode:'combined',
        options:{stream:accessLogStream}

    }
    
}



module.exports=development;
//eval(process.env.CODEIAL_ENVIRONMENT)==undefined ? 'development':eval(process.env.CODEIAL_ENVIRONMENT);
