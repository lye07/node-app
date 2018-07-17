const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose')
const keys = require('../config/keys');

const User = mongoose.model('user');
// ********** this file is about passport configuration (helper modules and business logic) ***********//


// ==> user click google login, 
// ==> it will go check if it is an existingUser in passport.use(). Then it will need to give user123 agent a token that says the user is user123 
// ==> Call serializeUser with the user to generate the identifying piece of info. 
// ==> set cookie with our cookie session key ===> request db data with cookie // ==> take cookie session key and pass it into "deserializeUser" to turn it into a user 
// ==> then db recognize cookie then return requested data of the user

// serializeUser is to take our user model and put indentifying information into a session
passport.serializeUser((user, done) => {
    done(null, user.id);
})

// then pull it out in the future to recognise the returning user

// deserializeUser is to take the previouse store session info and mongoose find it in the data base then turn it in to a user object 

passport.deserializeUser((id, done) => {
    // the "user" we are passing in is from the user return from GoogleStrategy
    User.findById(id).then(user => {
        done(null, user);
    })
})

passport.use(new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
        //findOne returns a promise. Find if the user exist in db or else create a new user. 
        User.findOne({
                googleId: profile.id
            })
            .then((existingUser) => {
                if (existingUser) {
                    done(null, existingUser)
                } else {
                    //creates a new model instance
                    new User({
                            googleId: profile.id
                        }).save()
                        .then(user => done(null, user))
                }
            })
    }
));