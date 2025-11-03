import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const ClubApplicationForm = ({ club, mode = "add", id, onClose }) => {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    motivation: "",
    skills: "",
    contribution: "",
    availability: "",
    previousExperience: "",
    customQuestions: "",
  });

  const [loading, setLoading] = useState(isViewMode || isEditMode);
  const [message, setMessage] = useState("");

  //  Fetch data if in view/edit mode
  useEffect(() => {
    const fetchApplication = async () => {
      if (!(isViewMode || isEditMode) || !id) {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/join-club-applications/GetById/${id}`,
          { headers: { Authorization: `${token}` } }
        );
        const app = res.data.data || {};
        setFormData({
          motivation: app.motivation || "",
          skills: app.skills || "",
          contribution: app.contribution || "",
          availability: app.availability || "",
          previousExperience: app.previousExperience || "",
          customQuestions: app.customQuestions || "",
        });
      } catch (err) {
        console.error("Error fetching application:", err);
        setMessage("Error loading application data");
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id, isViewMode, isEditMode]);

  const handleInputChange = (e) => {
    if (isViewMode) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  if (isViewMode) return;

  if (!formData.motivation.trim()) return setMessage("Motivation is required");
  if (!formData.contribution.trim()) return setMessage("Expected contribution is required");
  if (!formData.availability.trim()) return setMessage("Availability (hours/week) is required");

  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // ✅ assuming you save logged-in userId at login

    if (isEditMode) {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/join-club-applications/update/${id}`,
        formData,
        {
          headers: { "Content-Type": "application/json", Authorization: `${token}` },
        }
      );
      setMessage("Application updated successfully!");
    } else {
      // ✅ Include clubLeaderId and clubId when submitting
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Joining-requests/create`,
        {
          ...formData,
          clubId: club?._id,             // Club ID
          clubName: club?.clubName,      // Club Name
         clubLeaderId: club?.createdBy?._id || club?.createdBy, // ✅ Club Leader ID from /club/get-all-club
          userId: userId,                // ✅ Logged-in user’s ID
        },
        {
          headers: { "Content-Type": "application/json", Authorization: `${token}` },
        }
      );
      setMessage("Application submitted successfully!");
    }

    setTimeout(() => onClose(), 900);
  } catch (err) {
    console.error("Error saving application:", err);
    setMessage("Error saving application");
  }
};

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (isViewMode) return;

//   if (!formData.motivation.trim()) return setMessage("Motivation is required");
//   if (!formData.contribution.trim()) return setMessage("Expected contribution is required");
//   if (!formData.availability.trim()) return setMessage("Availability (hours/week) is required");

//   try {
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("userId");

//     if (isEditMode) {
//       await axios.put(
//         `${process.env.REACT_APP_BASE_URL}/join-club-applications/update/${id}`,
//         formData,
//         {
//           headers: { "Content-Type": "application/json", Authorization: `${token}` },
//         }
//       );
//       setMessage("Application updated successfully!");
//     } else {
//       // ✅ Create new joining request
//       const payload = {
//         ...formData,
//         clubId: club?._id,
//         clubName: club?.clubName,
//         clubLeaderId:
//           typeof club?.createdBy === "object"
//             ? club?.createdBy?._id
//             : club?.createdBy, // Handles both string or object cases
//         userId: userId,
//       };

//       console.log("📦 Sending payload:", payload); // Debug check before sending

//       await axios.post(
//         `${process.env.REACT_APP_BASE_URL}/Joining-requests/create`,
//         payload,
//         {
//           headers: { "Content-Type": "application/json", Authorization: `${token}` },
//         }
//       );
//       setMessage("Application submitted successfully!");
//     }

//     setTimeout(() => onClose(), 900);
//   } catch (err) {
//     console.error("Error saving application:", err);
//     setMessage("Error saving application");
//   }
// };



  if (loading) return <p className="text-center p-4">Loading application data...</p>;

  return (
    <Modal
      title={
        isViewMode
          ? "View Join Club Application"
          : isEditMode
          ? "Edit Join Club Application"
          : `Join ${club?.clubName || "Club"}`
      }
      activeModal
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="p-4">
        <div className="lg:grid-cols-2 grid gap-6 grid-cols-1">
          {/* Motivation */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Motivation / Why do you want to join? *
            </label>
            <textarea
              name="motivation"
              value={formData.motivation}
              onChange={handleInputChange}
              rows={2}
              className={`border p-2 w-full rounded ${
                isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              readOnly={isViewMode}
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Relevant Skills / Experience
            </label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              rows={1}
              className={`border p-2 w-full rounded ${
                isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              readOnly={isViewMode}
            />
          </div>

          {/* Contribution */}
          <div>
            <label className="block text-sm font-medium mb-1">Expected Contribution *</label>
            <textarea
              name="contribution"
              value={formData.contribution}
              onChange={handleInputChange}
              rows={1}
              className={`border p-2 w-full rounded ${
                isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              readOnly={isViewMode}
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Availability (hours per week) *
            </label>
            <input
              type="number"
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              className={`border p-2 w-full rounded ${
                isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              readOnly={isViewMode}
            />
          </div>

          {/* Previous Experience */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Previous Club Experience
            </label>
            <textarea
              name="previousExperience"
              value={formData.previousExperience}
              onChange={handleInputChange}
              rows={1}
              className={`border p-2 w-full rounded ${
                isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              readOnly={isViewMode}
            />
          </div>
        </div>

        {/*  Optional debug info */}
        <p className="text-xs text-gray-500 mt-3">
          Submitting for Club ID: <strong>{club?._id}</strong>
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <Button text="Cancel" className="btn-light" type="button" onClick={onClose} />
          {!isViewMode && (
            <Button
              text={isEditMode ? "Update Application" : "Submit Application"}
              className="btn-primary"
              type="submit"
            />
          )}
        </div>
      </form>

      {message && (
        <div className="mt-4">
          <p className="text-center text-sm text-gray-700">{message}</p>
        </div>
      )}
    </Modal>
  );
};

export default ClubApplicationForm;
