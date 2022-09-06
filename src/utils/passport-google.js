const GoogleAuth = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { generate } = require("yourid");
const User = require("../database/models/User");

passport.use(
    new GoogleAuth(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ["profile", "email"],
        },

        async function (accessToken, refreshToken, profile, done) {
            const newUser = {
                uid: generate({
                    length: 11,
                    keyspace:
                        "012345678901234567890123456789012345678901234567890123456789",
                }),
                name: profile.displayName,
                username:
                    profile.name.givenName +
                    "-" +
                    generate({
                        length: 7,
                        keyspace:
                            "012345678901234567890123456789012345678901234567890123456789",
                    }),
                email: profile.emails[0].value,
                provider: profile.provider,
                avatar: profile.photos[0].value,
            };

            try {
                let user = await User.findOne({ uid: profile.id });
                if (user) {
                    done(null, user);
                } else {
                    user = await User.create(newUser);
                    done(null, user);
                }
            } catch (err) {
                console.error(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});
