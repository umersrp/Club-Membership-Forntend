import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import axios from "axios";
import CustomSelect from "@/components/ui/Select";
import { toast } from "react-toastify";

const targetAudienceOptions = [
  { value: "Open to all", label: "Open to all" },
  { value: "Club members only", label: "Club members only" },
  { value: "Specific major", label: "Specific major" },
];


const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.state?.mode || "add";
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
    specificMajor: [],
    eventImage: null,
    registrationRequired: false,
    additionalRequirements: "",
    certificateOffered: false,
    volunteerHoursAwarded: "",
    members: [],
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(isViewMode || isEditMode);
  const [uploading, setUploading] = useState(false); // <-- new
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // <-- new

  // Fetch existing event (for view/edit)
  useEffect(() => {
    const fetchEvent = async () => {
      if (!(isViewMode || isEditMode) || !id || id === "add") {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/event/${id}`, {
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
          specificMajor: event.specificMajor || [],
          eventImage: event.eventImage || null,
          registrationRequired: event.registrationRequired || false,
          additionalRequirements: event.additionalRequirements || "",
          certificateOffered: event.certificateOffered || false,
          volunteerHoursAwarded: event.volunteerHoursAwarded || "",
          members: event.members || [],
        });
        setUploadedImageUrl(event.eventImage || "");
      } catch (err) {
        console.error("Error fetching event:", err);
        toast.error("Error loading event data");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, isViewMode, isEditMode]);

  // Handle input
  const handleInputChange = (e) => {
    if (isViewMode) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (isViewMode) return;
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, eventImage: file }));
    }
  };

  // Upload when eventImage changes
  useEffect(() => {
    const uploadImage = async () => {
      if (!formData.eventImage || typeof formData.eventImage === "string") return;
      setUploading(true);
      try {
        const token = localStorage.getItem("token");
        const uploadData = new FormData();
        uploadData.append("documentFile", formData.eventImage);

        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/upload/upload`,
          uploadData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${token}`,
            },
          }
        );

        const url = res.data.data;
        setUploadedImageUrl(url);
        setFormData((prev) => ({ ...prev, eventImage: url }));
        toast.success("Image uploaded successfully!");
      } catch (err) {
        console.error("Image upload failed:", err);
        toast.success("Image upload failed");
      } finally {
        setUploading(false);
      }
    };

    uploadImage();
  }, [formData.eventImage]);

  // Handle booleans
  const handleBooleanChange = (e) => {
    if (isViewMode) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value === "true" }));
  };

const handleRemoveMember = async (memberId) => {
  if (!id || !memberId) return;

  try {
    const token = localStorage.getItem("token");
    await axios.delete(
      `${process.env.REACT_APP_BASE_URL}/event/delete-membership/${memberId}/${id}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    // Update local state to remove the member
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m._id !== memberId),
    }));

    toast.success("Member removed successfully!");
  } catch (err) {
    console.error("Error removing member:", err);
    toast.error("Failed to remove member");
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return;

    if (!formData.eventTitle.trim())
      return toast.error("Event title is required");

    try {
      const token = localStorage.getItem("token");

      const payload = {
        eventTitle: formData.eventTitle,
        eventDescription: formData.eventDescription,
        eventCategory: formData.eventCategory,
        dateTime: formData.dateTime,
        location: formData.location,
        duration: formData.duration,
        capacityLimit: Number(formData.capacityLimit),
        registrationDeadline: formData.registrationDeadline,
        targetGender: formData.targetGender,
        targetAudience: formData.targetAudience,
        specificMajor:
          typeof formData.specificMajor === "string"
            ? formData.specificMajor.split(",").map((s) => s.trim()).filter(Boolean)
            : formData.specificMajor,
        eventImage: uploadedImageUrl || formData.eventImage,
        registrationRequired: formData.registrationRequired,
        additionalRequirements: formData.additionalRequirements,
        certificateOffered: formData.certificateOffered,
        volunteerHoursAwarded: Number(formData.volunteerHoursAwarded),
      };

      if (isEditMode) {
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/event/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        toast.success("Event updated successfully!");
      } else {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/event/create`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        toast.success("Event created successfully!");
      }

      setTimeout(() => navigate("/event-listing"), 900);
    } catch (err) {
      console.error("Error saving event:", err);
      toast.error("Error saving event");
    }
  };

  if (loading) return <p>Loading event data...</p>;

  return (
    <div>
      <Card
        title={isViewMode ? "View Event" : isEditMode ? "Edit Event" : "Create Event"}
      >
        <form
          onSubmit={handleSubmit}
          className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* ... other form inputs remain the same ... */}
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Event Title</label>
            <input
              type="text"
              name="eventTitle"
              value={formData.eventTitle}
              onChange={handleInputChange}
              className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              readOnly={isViewMode}
            />
          </div>

          {/* Event Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="eventDescription"
              value={formData.eventDescription}
              onChange={handleInputChange}
              rows={1}
              className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              readOnly={isViewMode}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="eventCategory"
              value={formData.eventCategory}
              onChange={handleInputChange}
              disabled={isViewMode}
              className="border p-2 w-full rounded"
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
              className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              readOnly={isViewMode}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              readOnly={isViewMode}
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              readOnly={isViewMode}
            />
          </div>

          {/* Capacity Limit */}
          <div>
            <label className="block text-sm font-medium mb-1">Capacity Limit</label>
            <input
              type="number"
              name="capacityLimit"
              value={formData.capacityLimit}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
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
              className="border p-2 w-full rounded"
              readOnly={isViewMode}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-1">Target Gender</label>
            <select
              name="targetGender"
              value={formData.targetGender}
              onChange={handleInputChange}
              disabled={isViewMode}
              className="border p-2 w-full rounded"
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
            <CustomSelect
              name="targetAudience"
              options={targetAudienceOptions}
              value={targetAudienceOptions.find(
                (opt) => opt.value === formData.targetAudience
              )}
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  targetAudience: selectedOption.value,
                })
              }
              isDisabled={isViewMode}
              className="w-full"
            />
          </div>

          {/* Specific Major */}
          <div>
            <label className="block text-sm font-medium mb-1">Specific Majors</label>
            <input
              type="text"
              name="specificMajor"
              value={
                Array.isArray(formData.specificMajor)
                  ? formData.specificMajor.join(", ")
                  : formData.specificMajor
              }
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              readOnly={isViewMode}
            />
          </div>
          {/* Event Image */}
          <div>
            <label className="block text-sm font-medium mb-1">Event Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isViewMode || uploading}
              className="border p-2 w-full rounded"
            />
            {uploading && <p className="text-blue-500 text-sm mt-1">Uploading...</p>}
            {uploadedImageUrl && (
              <img
                src={uploadedImageUrl}
                alt="Event"
                className="w-28 h-28 rounded mt-2 object-cover"
              />
            )}
          </div>


          {/* Registration Required */}
          <div>
            <label className="block text-sm font-medium mb-1">Registration Required</label>
            <select
              name="registrationRequired"
              value={formData.registrationRequired}
              onChange={handleBooleanChange}
              disabled={isViewMode}
              className="border p-2 w-full rounded"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
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
              className="border p-2 w-full rounded"
              readOnly={isViewMode}
            />
          </div>

          {/* Certificate Offered */}
          <div>
            <label className="block text-sm font-medium mb-1">Certificate Offered</label>
            <select
              name="certificateOffered"
              value={formData.certificateOffered}
              onChange={handleBooleanChange}
              disabled={isViewMode}
              className="border p-2 w-full rounded"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          {/* Volunteer Hours */}
          <div>
            <label className="block text-sm font-medium mb-1">Volunteer Hours Awarded</label>
            <input
              type="number"
              name="volunteerHoursAwarded"
              value={formData.volunteerHoursAwarded}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              readOnly={isViewMode}
            />
          </div>
        </form>
        {(isViewMode || isEditMode) && formData.members?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Club Members</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left border">#</th>
                    <th className="p-3 text-left border">Name</th>
                    <th className="p-3 text-left border">Student ID</th>
                    <th className="p-3 text-left border">Email</th>
                  </tr>
                </thead>

                <tbody>
                  {formData.members.map((m, index) => (
                    <tr key={m._id} className="odd:bg-white even:bg-gray-50">
                      <td className="p-3 border">{index + 1}</td>
                      <td className="p-3 border font-medium">{m.name}</td>
                      <td className="p-3 border">{m.studentId}</td>
                      <td className="p-3 border text-sm text-gray-700">{m.email}</td>
                      {!isViewMode && (
                        <td className="p-3 border">
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => handleRemoveMember(m._id)}
                          >
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}


        {/* Buttons */}
        <div className="flex justify-end gap-4 p-4">
          <Button
            text="Cancel"
            className="btn-light"
            type="button"
            onClick={() => navigate("/event-listing")}
          />
          {!isViewMode && (
            <Button
              text={isEditMode ? "Update Event" : "Create Event"}
              className="btn-primary"
              type="submit"
              onClick={handleSubmit}
              disabled={uploading}
            />
          )}
        </div>

        {message && <p className="text-center mt-4">{message}</p>}
      </Card>
    </div>
  );
};

export default EventForm;
