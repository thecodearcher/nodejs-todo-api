const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

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
    console.log("gott");
        let user = this;
        let access = 'auth';
        var token = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
        console.log(token);
        user.tokens.push({access,token});
        
        return user.save()
        .then(()=>{
            return token;
        });
        
};

var User = mongoose.model('users', Userschema);

module.exports ={User};