import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import axios from "axios";

const StudentFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.state?.mode || "add"; // add | view | edit
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    universityEmail: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    studentId: "",
    major: "",
    year: "",
    interests: [],
    gender: "",
    contactNumber: "",
  });

  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    if (isViewMode) return;
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // for multi-select interests
      let updatedInterests = [...formData.interests];
      if (checked) updatedInterests.push(value);
      else updatedInterests = updatedInterests.filter((i) => i !== value);
      setFormData((prev) => ({ ...prev, interests: updatedInterests }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return;

    // Validation
    if (!formData.universityEmail.endsWith("@student.ksu.edu.sa")) {
      return setMessage("Email must be @student.ksu.edu.sa");
    }
    if (formData.password !== formData.confirmPassword) {
      return setMessage("Passwords do not match");
    }

    try {
      const token = localStorage.getItem("token");
      if (isEditMode) {
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/students/${id}`,
          formData,
          { headers: { Authorization: `${token}` } }
        );
        setMessage("Student updated successfully!");
      } else {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/students`,
          formData,
          { headers: { Authorization: `${token}` } }
        );
        setMessage("Student registered successfully!");
      }

      setTimeout(() => navigate("/students-listing"), 1200);
    } catch (error) {
      console.error("Error saving student:", error);
      setMessage("Error saving student");
    }
  };

  return (
    <div>
      <Card
        title={
          isViewMode
            ? "View Student"
            : isEditMode
            ? "Edit Student"
            : "Add Student"
        }
      >
        <form onSubmit={handleSubmit} className="p-4">
          <div className="lg:grid-cols-3 grid gap-8 grid-cols-1">
          {/* Email */}
          <div>
            <label>University Email</label>
            <input
              type="email"
              name="universityEmail"
              value={formData.universityEmail}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              readOnly={isViewMode}
              placeholder="example@student.ksu.edu.sa"
            />
          </div>

          {/* Password */}
          {!isViewMode && (
            <>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div>
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="border p-2 w-full rounded"
                />
              </div>
            </>
          )}

          {/* Full Name */}
          <div>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              readOnly={isViewMode}
            />
          </div>

          {/* Student ID */}
          <div>
            <label>Student ID</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              readOnly={isViewMode}
            />
          </div>

          {/* Major */}
          <div>
            <label>Major / Department</label>
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              readOnly={isViewMode}
            />
          </div>

          {/* Year */}
          <div>
            <label>Year of Study</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              disabled={isViewMode}
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5">5th Year</option>
            </select>
          </div>

          {/* Interests (multi-select checkboxes) */}
          <div>
            <label>Interests</label>
            <div className="flex gap-3 flex-wrap">
              {["Sports", "Music", "Coding", "Art"].map((interest) => (
                <label key={interest} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="interests"
                    value={interest}
                    checked={formData.interests.includes(interest)}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label>Gender</label>
            <div className="flex gap-4">
              {["Male", "Female", "Other"].map((g) => (
                <label key={g}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />{" "}
                  {g}
                </label>
              ))}
            </div>
          </div>

          {/* Contact Number */}
          <div>
            <label>Contact Number (Optional)</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              readOnly={isViewMode}
            />
          </div>
          </div>
           {/* Buttons */}
          <div className="flex gap-4 justify-end pt-4">
            <Button
              text="Cancel"
              type="button"
              onClick={() => navigate("/students-listing")}
              className="btn-light"
            />
            {!isViewMode && (
              <Button
                text={isEditMode ? "Update Student" : "Register"}
                type="submit"
                className="btn-primary"
              />
            )}
          </div>
        </form>

        {message && <p className="mt-4 text-center">{message}</p>}
      </Card>
    </div>
  );
};

export default StudentFormPage;
