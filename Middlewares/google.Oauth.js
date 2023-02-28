const { UserModel } = require("../Models/User.Model");

require("dotenv").config()


passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.google_client_id,
        clientSecret: process.env.google_client_secret_value,
        callbackURL: "http://localhost:8090/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserModel.findOne({ email: profile.emails[0].value });
          if (!user) {
            const user = new UserModel({email:profile.emails[0].value})
            await user.save();
          }
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  