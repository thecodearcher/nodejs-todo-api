var env = process.env.NODE_ENV || "development";

var envConfig = config[env];
if(env=='development' || env==='test'){
    const config  = require('./config.json');
    Object.keys(envConfig).forEach((key)=>{
        process.env[key] = envConfig[key];
        console.log(key);
    });
}