import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const EventRegistrationModal = ({ mode = "add", registrationData = {}, onClose }) => {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    confirmationOfAttendance: "",
    eventQuestions: "",
    emergencyContact: "",
    specialRequirements: "",
  });
  const [message, setMessage] = useState("");

  // ✅ Prefill data for edit/view mode
  useEffect(() => {
    if (registrationData) {
      setFormData({
        confirmationOfAttendance: registrationData.confirmationOfAttendance || "",
        eventQuestions: registrationData.eventQuestions || "",
        emergencyContact: registrationData.emergencyContact || "",
        specialRequirements: registrationData.specialRequirements || "",
      });
    }
  }, [registrationData]);

  const handleInputChange = (e) => {
    if (isViewMode) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isViewMode) return;

    if (!formData.confirmationOfAttendance)
      return setMessage("Please confirm your attendance");

    // Mock API simulation
    setTimeout(() => {
      if (isEditMode) {
        setMessage("✅ Event registration updated successfully!");
      } else {
        setMessage("✅ Event registration created successfully!");
      }
    }, 800);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        onClick={onClose}
      >
        {/* Animated Modal */}
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

                {/* Event Questions */}
                <div className="col-span-2">
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
                  <label className="block text-sm font-medium mb-1">
                    Emergency Contact
                  </label>
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
                <div className="col-span-2">
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
                  onClick={onClose}
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
                <p className="text-center text-green-600 font-semibold">{message}</p>
              </div>
            )}
          </Card>
      </div>
    </>
  );
};

export default EventRegistrationModal;
