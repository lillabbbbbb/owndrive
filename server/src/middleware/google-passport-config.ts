import passport from 'passport'
import { Strategy, Profile } from 'passport-google-oauth20'

//Not used yet since Google login is not set up
passport.use(new Strategy({
    clientID: (process.env.GOOGLE_CLIENT_ID as string)!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
}, (accessToken: string, refreshToken: string, profile: Profile, done) => {
    console.log("Access Token:", accessToken)
    console.log("Refresh Token:", refreshToken)
    console.log("Profile:", profile)
    return done(null, profile)
}))


export default passport