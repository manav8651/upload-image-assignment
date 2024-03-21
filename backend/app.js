const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
// const userRoutes = require("./routes/userRoutes");
// const imageRoutes = require("./routes/imageRoutes");

const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// let ref_token = loadRefreshToken();

// Helper function to load the refresh token from a file
function loadRefreshToken() {
  const tokenPath = path.resolve(__dirname, "tokens.json");
  try {
    if (fs.existsSync(tokenPath)) {
      const tokenData = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
      return tokenData.refresh_token;
    }
  } catch (error) {
    console.error("Error loading refresh token from file", error);
  }
  return null;
}

// Helper function to save the refresh token to a file
function saveRefreshToken(token) {
  const tokenPath = path.resolve(__dirname, "tokens.json");
  try {
    fs.writeFileSync(tokenPath, JSON.stringify(token));
  } catch (error) {
    console.error("Error saving refresh token to file", error);
  }
}

const YOUR_CLIENT_ID =process.env.CLIENT_ID;
const YOUR_CLIENT_SECRET = process.env.CLIENT_SECRET;
const YOUR_REDIRECT_URL = "http://localhost:5000/oauth2callback";

const oauth2Client = new google.auth.OAuth2(
  YOUR_CLIENT_ID,
  YOUR_CLIENT_SECRET,
  YOUR_REDIRECT_URL
);
// var ref_token;
const scopes = ["https://www.googleapis.com/auth/calendar"];

app.get("/auth", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });
  res.redirect(authUrl);
});

app.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    saveRefreshToken(tokens); // Save the tokens to a file
    oauth2Client.setCredentials(tokens);
    // ref_token = tokens.refresh_token;
    res.send("Authentication successful! You can close this window.");
  } catch (error) {
    console.error("Error during OAuth callback", error);
    res.status(500).send("Authentication failed.");
  }
});
// Set your OAuth2 credentials for the Google API client

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

// app.use("/api/users", userRoutes);
// app.use("/api/images", imageRoutes);
app.post("/create-event", async (req, res) => {
  const { date, time, timeZone, attendees } = req.body;
  const ref_token = loadRefreshToken();
  if (!ref_token) {
    // oauth2Client.setCredentials({ refresh_token: ref_token });
    return res.status(401).send({
      success: false,
      message: "Refresh token is missing. Please authenticate again.",
    });
  }

  oauth2Client.setCredentials({
    refresh_token: ref_token,
  });
  const startDateTime = new Date(`${date}T${time}`);
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60000); // For example, adds 60 minutes to start time

  const event = {
    summary: "Meeting with Candidate",
    location: "Online",
    description: "A chance to talk  about your application.",
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: timeZone,
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: timeZone,
    },
    attendees: attendees.map((email) => ({ email })),
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
    conferenceData: {
      createRequest: {
        requestId: uuidv4(), // A unique ID or string used to ensure idempotency of conference creation requests
        conferenceSolutionKey: {
          type: "hangoutsMeet", // Specifies the type of conference
        },
      },
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      sendNotifications: true,
      conferenceDataVersion: 1, // Indicates that you want to use the conferenceData field
    });
    res.send({ success: true, event: response.data });
  } catch (error) {
    console.error("Error creating calendar event", error);
    res.status(500).send({ success: false, message: "Failed to create event" });
  }
});

module.exports = app;
