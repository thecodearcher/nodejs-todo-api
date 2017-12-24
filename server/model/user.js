const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');

var Userschema  = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `Value {VALUE} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
}, {usePushEach: true});

Userschema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject,['_id','email']);
};

Userschema.methods.generateAuthToken = function(){
        let user = this;
        let access = 'auth';
        var token = jwt.sign({_id:user._id.toHexString(),access},process.env.JWT_SECRET).toString();
       
        user.tokens.push({access,token});
        
        return user.save()
        .then(()=>{
            return token;
        });
        
};

Userschema.methods.removeToken = function(token){
    var user = this;
  return user.update({
        $pull:{
            tokens:{token}
        }
    });
};

Userschema.pre('save',function(next){
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }

});

Userschema.statics.findByCredentials = function (email,password){
    return User.findOne({email})
    .then(user=>{
        if(!user){
            Promise.reject();
        }

        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(err,res)=>{
                if(res){
                    resolve(user);
                }else {
                    reject();
                }
            });
        });
    });
    
};

Userschema.statics.findByToken = function (token) {
        var user = this;
        var decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return Promise.reject(e);
        }

        return user.findOne({
            '_id': decoded._id,
            'tokens.token':token,
            'tokens.access': 'auth'
        });
};
var User = mongoose.model('users', Userschema);

module.exports ={User};