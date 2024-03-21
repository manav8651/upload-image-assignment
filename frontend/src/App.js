import React, { useState } from "react";
import axios from "axios";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Signup from "./components/Signup.jsx";
// import Login from "./components/Login.jsx";
// import ImageUpload from "./components/ImageUpload.jsx";

function App() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [timeZone, setTimeZone] = useState("America/Los_Angeles");
  const [attendees, setAttendees] = useState("");

  const authenticate = () => {
    window.location.href = "http://localhost:5000/auth";
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const attendeeEmails = attendees.split(",").map((email) => email.trim());
    try {
      const response = await axios.post("http://localhost:5000/create-event", {
        date,
        time,
        timeZone,
        attendees: attendeeEmails,
      });
      if (response.data.success) {
        alert(`Event created! Link: ${response.data.link}`);
      } else {
        alert("Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event", error);
      alert(
        `Error sending event data : ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };
  return (
    // <BrowserRouter>
    //   <div>
    //     <Routes>
    //       <Route path="/" exact element={<Signup/>} />
    //       <Route path="/login" element={<Login/>} />
    //       <Route path="/image-upload" element={<ImageUpload/>} />
    //     </Routes>
    //   </div>
    // </BrowserRouter>
    <div>
      <h1>Schedule an Event</h1>
      {/* <h1>Schedule an Event</h1> */}
      <button onClick={authenticate}>Authenticate with Google</button>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <input
          type="text"
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
          placeholder="Attendee emails, separated by commas"
          required
        />
        <button type="submit">Schedule Event</button>
      </form>
    </div>
  );
}

export default App;
