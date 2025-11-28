import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import axios from "axios";
import { toast } from "react-toastify";

const EventRegistrationForm = ({ event, onClose }) => {
  const [formData, setFormData] = useState({
    confirmationOfAttendance: "",
    eventQuestions: {
      dietaryRestrictions: "",
      tshirtSize: "",
      other: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    specialRequirements: "",
  });

  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev };
      if (name.startsWith("eventQuestions.")) {
        const field = name.split(".")[1];
        updated.eventQuestions = { ...prev.eventQuestions, [field]: value };
      } else if (name.startsWith("emergencyContact.")) {
        const field = name.split(".")[1];
        updated.emergencyContact = { ...prev.emergencyContact, [field]: value };
      } else {
        updated[name] = value;
      }
      return updated;
    });
  };

  //  Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?._id) {
      toast.error("User not found. Please log in again.");
      return;
    }

    if (!event?._id) {
      toast.error("Event ID missing. Please try again.");
      return;
    }

    const payload = {
      eventId: event._id, //  Real event ID
      eventName: event.eventTitle,
      clubLeaderId:
        typeof event.createdBy === "object" ? event.createdBy._id : event.createdBy,
      userId: user._id,
      confirmationOfAttendance:
        formData.confirmationOfAttendance.toLowerCase() === "yes",
      eventQuestions: formData.eventQuestions,
      emergencyContact: formData.emergencyContact,
      specialRequirements: formData.specialRequirements,
    };

    console.log("📦 Sending payload:", payload);

    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Event-requests/create`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      toast.success("Registration successful!");
      toast.success("You have successfully registered for this event!");
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit registration"
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card title={event ? `Join ${event.eventTitle}` : "Join Event"}>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Attendance
              </label>
              <select
                name="confirmationOfAttendance"
                value={formData.confirmationOfAttendance}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Why You Want to Joint?
              </label>
              <input
                type="text"
                name="eventQuestions.dietaryRestrictions"
                value={formData.eventQuestions.dietaryRestrictions}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Major</label>
              <input
                type="text"
                name="eventQuestions.tshirtSize"
                value={formData.eventQuestions.tshirtSize}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Other Notes</label>
              <input
                type="text"
                name="eventQuestions.other"
                value={formData.eventQuestions.other}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Emergency Contact Name
              </label>
              <input
                type="text"
                name="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Relationship</label>
              <input
                type="text"
                name="emergencyContact.relationship"
                value={formData.emergencyContact.relationship}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Emergency Contact Phone
              </label>
              <input
                type="text"
                name="emergencyContact.phone"
                value={formData.emergencyContact.phone}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Special Requirements / Accommodations
              </label>
              <textarea
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <Button text="Cancel" className="btn-light" type="button" onClick={onClose} />
            <Button text="Submit Registration" className="btn-primary" type="submit" />
          </div>
        </form>

        {message && (
          <p className="text-center text-green-600 font-semibold mt-4">{message}</p>
        )}
      </Card>
    </div>
  );
};

export default EventRegistrationForm;
