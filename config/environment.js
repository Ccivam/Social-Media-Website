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
    google_client_id:"716926697135-1p7g1tep9ube9hoig17e2nc3d8kj8rog.apps.googleusercontent.com",
    google_client_secret:"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",
    google_call_back_url:"http://localhost:8000/users/auth/google/callback" ,
    jwt_key:"codeial",
    morgan:{
        mode:'dev',
        options:{stream:accessLogStream}

    }
}

const production={
    name:'production',
    asset_path:process.env.CODEIAL_ASSET_PATH,
    session_cookie_key:process.env.session_cookie_key,
    db:process.env.codeial_db,
    google_client_id:process.env.google_client_id,
    google_client_secret:process.env.google_client_secret,
    google_call_back_url:process.env.google_call_back_url,
    jwt_key:process.env.jwt_key,
    morgan:{
        mode:'combined',
        options:{stream:accessLogStream}

    }
    
}



module.exports=development;

//eval(process.env.CODEIAL_ENVIRONMENT)==undefined ? 'development':eval(process.env.CODEIAL_ENVIRONMENT);