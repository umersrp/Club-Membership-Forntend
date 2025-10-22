import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Fileinput from "@/components/ui/Fileinput";
import axios from "axios";

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.state?.mode || "add"; // add | view | edit
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    eventTitle: "",
    eventDescription: "",
    eventCategory: "",
    dateTime: "",
    location: "",
    duration: "",
    capacityLimit: "",
    registrationDeadline: "",
    targetGender: "",
    targetAudience: "",
    eventImage: null,
    registrationRequired: "",
    additionalRequirements: "",
    certificateOffered: "",
    volunteerHours: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(isViewMode || isEditMode);

  // Fetch event data for edit/view
  useEffect(() => {
    const fetchEvent = async () => {
      if (!(isViewMode || isEditMode) || !id || id === "add") {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/events/GetById/${id}`, {
          headers: { Authorization: `${token}` },
        });
        const event = res.data.data || {};
        setFormData({
          eventTitle: event.eventTitle || "",
          eventDescription: event.eventDescription || "",
          eventCategory: event.eventCategory || "",
          dateTime: event.dateTime ? event.dateTime.split("T")[0] : "",
          location: event.location || "",
          duration: event.duration || "",
          capacityLimit: event.capacityLimit || "",
          registrationDeadline: event.registrationDeadline
            ? event.registrationDeadline.split("T")[0]
            : "",
          targetGender: event.targetGender || "",
          targetAudience: event.targetAudience || "",
          eventImage: null,
          registrationRequired: event.registrationRequired || "",
          additionalRequirements: event.additionalRequirements || "",
          certificateOffered: event.certificateOffered || "",
          volunteerHours: event.volunteerHours || "",
        });
      } catch (err) {
        console.error("Error fetching event:", err);
        setMessage("Error loading event data");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, isViewMode, isEditMode]);

  const handleInputChange = (e) => {
    if (isViewMode) return;
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };
    const handleFileChange = (e) => {
    if (isViewMode) return;
    setFormData((prev) => ({ ...prev, clubLogo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return;

    // Basic validation
    if (!formData.eventTitle.trim()) return setMessage("Event title is required");
    if (!formData.eventCategory) return setMessage("Event category is required");
    if (!formData.dateTime) return setMessage("Event date/time is required");

    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      for (const key in formData) form.append(key, formData[key]);

      if (isEditMode) {
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/events/update/${id}`,
          form,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setMessage("Event updated successfully!");
      } else {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/events/create`, form, {
          headers: { Authorization: `${token}` },
        });
        setMessage("Event created successfully!");
      }

      setTimeout(() => navigate("/events"), 900);
    } catch (err) {
      console.error("Error saving event:", err);
      setMessage("Error saving event");
    }
  };

  if (loading) return <p>Loading event data...</p>;

  return (
    <div>
      <Card
        title={
          isViewMode ? "View Event" : isEditMode ? "Edit Event" : "Create Event"
        }
      >
        <form onSubmit={handleSubmit} className="p-4">
          <div className="lg:grid-cols-3 grid gap-8 grid-cols-1">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Event Title</label>
              <input
                type="text"
                name="eventTitle"
                value={formData.eventTitle}
                onChange={handleInputChange}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode}
              />
            </div>

            {/* Description */}
            <div className="">
              <label className="block text-sm font-medium mb-1">Event Description</label>
              <textarea
                name="eventDescription"
                value={formData.eventDescription}
                onChange={handleInputChange}
                rows={1}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Event Category</label>
              <select
                name="eventCategory"
                value={formData.eventCategory}
                onChange={handleInputChange}
                disabled={isViewMode}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
              >
                <option value="">Select Category</option>
                <option value="Workshop">Workshop</option>
                <option value="Competition">Competition</option>
                <option value="Social">Social</option>
                <option value="Training">Training</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium mb-1">Date & Time</label>
              <input
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleInputChange}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-1">Location / Venue</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode}
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-1">Duration (hours)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode}
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium mb-1">Capacity Limit</label>
              <input
                type="number"
                name="capacityLimit"
                value={formData.capacityLimit}
                onChange={handleInputChange}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode}
              />
            </div>

            {/* Registration Deadline */}
            <div>
              <label className="block text-sm font-medium mb-1">Registration Deadline</label>
              <input
                type="date"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleInputChange}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode}
              />
            </div>

            {/* Target Gender */}
            <div>
              <label className="block text-sm font-medium mb-1">Target Gender</label>
              <select
                name="targetGender"
                value={formData.targetGender}
                onChange={handleInputChange}
                disabled={isViewMode}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
              >
                <option value="">Select</option>
                <option value="All">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium mb-1">Target Audience</label>
              <input
                type="text"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode}
              />
            </div>

            {/* Event Image */}
            <div>
              <label className="block mb-1 text-sm font-medium">Event Image / Poster</label>
              <input
                type="file"
                name="eventImage"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isViewMode}
                className="border p-2 w-full rounded"
              />
            </div>

            {/* Registration Required */}
            <div>
              <label className="block text-sm font-medium mb-1">Registration Required?</label>
              <select
                name="registrationRequired"
                value={formData.registrationRequired}
                onChange={handleInputChange}
                disabled={isViewMode}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Additional Requirements */}
            <div>
              <label className="block text-sm font-medium mb-1">Additional Requirements</label>
              <textarea
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={handleInputChange}
                rows={1}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode}
              />
            </div>

            {/* Certificate Offered */}
            <div>
              <label className="block text-sm font-medium mb-1">Certificate Offered?</label>
              <select
                name="certificateOffered"
                value={formData.certificateOffered}
                onChange={handleInputChange}
                disabled={isViewMode}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Volunteer Hours */}
            <div>
              <label className="block text-sm font-medium mb-1">Volunteer Hours Awarded</label>
              <input
                type="number"
                name="volunteerHours"
                value={formData.volunteerHours}
                onChange={handleInputChange}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              text="Cancel"
              className="btn-light"
              type="button"
              onClick={() => navigate("/events")}
            />
            {!isViewMode && (
              <Button
                text={isEditMode ? "Update Event" : "Create Event"}
                className="btn-primary"
                type="submit"
              />
            )}
          </div>
        </form>

        {message && <p className="text-center mt-4">{message}</p>}
      </Card>
    </div>
  );
};

export default EventForm;
