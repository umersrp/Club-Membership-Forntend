// import React, { useState } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import axios from "axios";
// import { toast } from "react-toastify";

// const EventSurveyForm = ({ event, onClose }) => {
//   const [feedback, setFeedback] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (feedback.trim().length < 5) {
//       toast.error("Please write at least 5 characters.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const payload = {
//         eventId: event?._id,
//         feedback: feedback,
//       };

//       await axios.post(
//         `${process.env.REACT_APP_BASE_URL}/Event-requests/submit-survey`,
//         payload,
//         {
//           headers: {
//             Authorization: `${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast.success("Feedback submitted successfully!");
//       onClose();
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to submit feedback");
//     }
//   };

//   return (
//     <div>
//       <Card title={event ? `Event Survey - ${event.eventTitle}` : "Event Survey"}>
//         <form onSubmit={handleSubmit} className="space-y-5">

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Write your feedback about the event
//             </label>
//             <textarea
//               className="border w-full p-1 rounded"
//               rows={4}
//               placeholder="Write down your feedback about the event..."
//               value={feedback}
//               onChange={(e) => setFeedback(e.target.value)}
//               required
//             />
//           </div>

//           <div className="flex justify-end gap-3 pt-1">
//             <Button text="Cancel" className="btn-light" type="button" onClick={onClose} />
//             <Button text="Submit" className="btn-primary" type="submit" />
//           </div>

//         </form>
//       </Card>
//     </div>
//   );
// };

// export default EventSurveyForm;
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import axios from "axios";
import { toast } from "react-toastify";

const EventSurveyForm = ({ surveyRequest, onClose }) => {
  const [feedback, setFeedback] = useState("");

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (feedback.trim().length < 5) {
  //     toast.error("Please write at least 5 characters.");
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("token");
  //     const userId = localStorage.getItem("userId"); // ✅ logged-in userId stored in localStorage

  //     if (!userId) {
  //       toast.error("User ID not found. Please login again.");
  //       return;
  //     }

  //     // ✅ Prepare correct payload
  //     const payload = {
  //       eventId: surveyRequest?._id,  // event ID from list
  //       userId: userId,               // logged-in user
  //       answers: feedback             // survey text
  //     };

  //     console.log("📤 Sending Payload:", payload);

  //     await axios.post(
  //       `${process.env.REACT_APP_BASE_URL}/Event-requests/submit-survey`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     toast.success("Survey submitted successfully (+5 points awarded)!");
  //     onClose();
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(
  //       error.response?.data?.message || "Failed to submit survey"
  //     );
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (feedback.trim().length < 5) {
    toast.error("Please write at least 5 characters.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const loggedInUser = JSON.parse(localStorage.getItem("user")); // or however you store user info

    const payload = {
      eventId: surveyRequest?._id,  // ← Your event _id from events list
      userId: loggedInUser?._id,    // ← Logged-in user ID
      answere: feedback             // ← EXACT name expected by backend
    };

    await axios.post(
      `${process.env.REACT_APP_BASE_URL}/Event-requests/submit-survey`,
      payload,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Survey submitted successfully (+5 points awarded)!");
    onClose();

  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Failed to submit survey");
  }
};

  return (
    <div>
      <Card title={`Event Survey - ${surveyRequest?.eventTitle || "Event"}`}>
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-1">
              Write your feedback about the event
            </label>
            <textarea
              className="border w-full p-2 rounded"
              rows={4}
              placeholder="Write your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              text="Cancel"
              className="btn-light"
              type="button"
              onClick={onClose}
            />
            <Button text="Submit" className="btn-primary" type="submit" />
          </div>

        </form>
      </Card>
    </div>
  );
};

export default EventSurveyForm;
