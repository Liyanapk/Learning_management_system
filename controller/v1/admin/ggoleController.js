import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const authClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_SECRET_ID,
    "http://localhost:5000/api/v1/google/oauth2callback"
);

const SCOPES = [
    "https://www.googleapis.com/auth/classroom.courses",
    "https://www.googleapis.com/auth/classroom.rosters",
    "https://www.googleapis.com/auth/classroom.coursework.students",
    "https://www.googleapis.com/auth/classroom.profile.emails",
    "https://www.googleapis.com/auth/userinfo.profile"
];

let accessToken = null;

export const googleAuth = (req, res) => {
    const authUrl = authClient.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    res.redirect(authUrl);
};


export const googleAuthCallback = async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await authClient.getToken(code);
        accessToken = tokens.access_token;
        authClient.setCredentials(tokens);
        res.redirect('/api/v1/google/courses'); // Redirect to courses list
    } catch (error) {
        console.error("OAuth Error:", error);
        res.status(500).send("Authentication failed.");
    }
};


export const getCourses = async (req, res) => {
    try {
        authClient.setCredentials({ access_token: accessToken });
        const classroom = google.classroom({ version: 'v1', auth: authClient });
        const response = await classroom.courses.list();
        res.status(200).json(response.data.courses || []);
    } catch (error) {
        console.error("Course Fetch Error:", error);
        res.status(500).json({ message: "Failed to fetch courses" });
    }
};
