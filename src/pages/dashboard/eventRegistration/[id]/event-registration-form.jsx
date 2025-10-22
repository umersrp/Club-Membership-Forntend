import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import axios from "axios";

const EventRegistrationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.state?.mode || "add"; // add | view | edit
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    confirmationOfAttendance: "",
    eventQuestions: "",
    emergencyContact: "",
    specialRequirements: "",
  });

  const [loading, setLoading] = useState(isViewMode || isEditMode);
  const [message, setMessage] = useState("");

  // fetch registration data for view/edit
  useEffect(() => {
    const fetchRegistration = async () => {
      if (!(isViewMode || isEditMode) || !id || id === "add") {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/event-registrations/GetById/${id}`,
          { headers: { Authorization: `${token}` } }
        );
        const data = res.data.data || {};
        setFormData({
          confirmationOfAttendance: data.confirmationOfAttendance || "",
          eventQuestions: data.eventQuestions || "",
          emergencyContact: data.emergencyContact || "",
          specialRequirements: data.specialRequirements || "",
        });
      } catch (err) {
        console.error("Error fetching registration:", err);
        setMessage("Error loading registration data");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistration();
  }, [id, isViewMode, isEditMode]);

  const handleInputChange = (e) => {
    if (isViewMode) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return;

    // Basic validation
    if (!formData.confirmationOfAttendance)
      return setMessage("Please confirm your attendance");

    try {
      const token = localStorage.getItem("token");
      if (isEditMode) {
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/event-registrations/update/${id}`,
          formData,
          {
            headers: { "Content-Type": "application/json", Authorization: `${token}` },
          }
        );
        setMessage("Event registration updated successfully!");
      } else {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/event-registrations/create`,
          formData,
          {
            headers: { "Content-Type": "application/json", Authorization: `${token}` },
          }
        );
        setMessage("Event registration created successfully!");
      }

      setTimeout(() => navigate("/event-registrations"), 900);
    } catch (err) {
      console.error("Error saving event registration:", err);
      setMessage("Error saving registration");
    }
  };

  if (loading) return <p>Loading registration data...</p>;

  return (
    <div>
      <Card
        title={
          isViewMode
            ? "View Event Registration"
            : isEditMode
            ? "Edit Event Registration"
            : "Add Event Registration"
        }
      >
        <form onSubmit={handleSubmit} className="p-4">
          <div className="lg:grid-cols-3 grid gap-8 grid-cols-1">
            {/* Confirmation of Attendance */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirmation of Attendance
              </label>
              <select
                name="confirmationOfAttendance"
                value={formData.confirmationOfAttendance}
                onChange={handleInputChange}
                className={`border p-2 w-full rounded ${
                  isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={isViewMode}
              >
                <option value="">Select Option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Event-Specific Questions */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Event-Specific Questions 
              </label>
              <textarea
                name="eventQuestions"
                placeholder="e.g., dietary restrictions, t-shirt size etc"
                value={formData.eventQuestions}
                onChange={handleInputChange}
                rows={1}
                className={`border p-2 w-full rounded ${
                  isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                readOnly={isViewMode}
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-sm font-medium mb-1">Emergency Contact</label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                className={`border p-2 w-full rounded ${
                  isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                readOnly={isViewMode}
              />
            </div>

            {/* Special Requirements */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Special Requirements / Accommodations
              </label>
              <textarea
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleInputChange}
                rows={1}
                className={`border p-2 w-full rounded ${
                  isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
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
              onClick={() => navigate("/event-registrations")}
            />
            {!isViewMode && (
              <Button
                text={isEditMode ? "Update Registration" : "Add Registration"}
                className="btn-primary"
                type="submit"
              />
            )}
          </div>
        </form>

        {message && (
          <div className="mt-4">
            <p className="text-center">{message}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EventRegistrationForm;
