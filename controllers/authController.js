import {Users} from '../models/userSchema.js';
import { getToken } from '../utils/passport.js';

export async function googleLogin (req, res , next) {
    const input = req.body.token;
    const googleUser = await getGoogleUser({ code: input.code });

    const user = await Users.findOne({ email: String(googleUser.id) });
    const token = getToken({
        email: googleUser.email,
        username: googleUser.username
    });

    console.log(googleUser);
    if (user != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            success: true,
            token: 'Bearer ' + token,
            message: 'You are successfully logged in!',
            user: user
        });
    } else {
        try {
            const createNewUser = await Users.create(req.body);
            if (createNewUser != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(users);
            } 
        } catch (err) {
            res.statusCode = 400;
            res.send(err);
        }
    }
    return user;
  }

async function getGoogleUser({ code }) {
    const { tokens } = await oauth2Client.getToken(code);

    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
        .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
        {
            headers: {
            Authorization: `Bearer ${tokens.id_token}`,
            },
        },
        )
        .then(res => res.data)
        .catch(error => {
            throw new Error(error.message);
        });

    return googleUser;
}
  