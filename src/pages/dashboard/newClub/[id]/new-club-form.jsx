import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Fileinput from "@/components/ui/Fileinput";
import axios from "axios";

const NewClubForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.state?.mode || "add"; // add | view | edit
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    clubName: "",
    clubDescription: "",
    clubCategory: "",
    targetMajor: "",
    targetGender: "",
    targetYear: "",
    proposedActivities: "",
    clubLogo: null,
    socialLinks: "",
    presidentName: "",
    presidentId: "",
    vicePresidentName: "",
    vicePresidentId: "",
    justification: "",
    expectedMembers: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(isViewMode || isEditMode);

  // Fetch existing club data for view/edit
  useEffect(() => {
    const fetchClub = async () => {
      if (!(isViewMode || isEditMode) || !id || id === "add") {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/new-club/GetById/${id}`,
          { headers: { Authorization: `${token}` } }
        );
        const club = res.data.data || {};
        setFormData({
          clubName: club.clubName || "",
          clubDescription: club.clubDescription || "",
          clubCategory: club.clubCategory || "",
          targetMajor: club.targetMajor || "",
          targetGender: club.targetGender || "",
          targetYear: club.targetYear || "",
          proposedActivities: club.proposedActivities || "",
          socialLinks: club.socialLinks || "",
          presidentName: club.presidentName || "",
          presidentId: club.presidentId || "",
          vicePresidentName: club.vicePresidentName || "",
          vicePresidentId: club.vicePresidentId || "",
          justification: club.justification || "",
          expectedMembers: club.expectedMembers || "",
        });
      } catch (err) {
        console.error("Error fetching club:", err);
        setMessage("Error loading club data");
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id, isViewMode, isEditMode]);

  const handleChange = (e) => {
    if (isViewMode) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (isViewMode) return;
    setFormData((prev) => ({ ...prev, clubLogo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return;

    if (!formData.clubName.trim())
      return setMessage("Club Name is required");
    if (!formData.clubDescription.trim())
      return setMessage("Club Description is required");
    if (!formData.clubCategory.trim())
      return setMessage("Club Category is required");
    if (!formData.presidentName.trim() || !formData.presidentId.trim())
      return setMessage("President Name and ID are required");

    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key]);
      }

      if (isEditMode) {
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/new-club/update/${id}`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${token}`,
            },
          }
        );
        setMessage("Club updated successfully!");
      } else {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/Club/Create`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${token}`,
            },
          }
        );
        setMessage("Club created successfully! Pending admin approval.");
      }

      setTimeout(() => navigate("/new-clubs"), 900);
    } catch (err) {
      console.error("Error saving club:", err);
      setMessage("Error saving club");
    }
  };

  if (loading) return <p>Loading club data...</p>;

  return (
    <div>
      <Card
        title={
          isViewMode
            ? "View Club Proposal"
            : isEditMode
            ? "Edit Club Proposal"
            : "Create New Club"
        }
      >
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Club Name */}
            <div>
              <label className="block mb-1 text-sm font-medium">Club Name</label>
              <input
                name="clubName"
                value={formData.clubName}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${
                  isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                readOnly={isViewMode}
              />
            </div>

            {/* Club Description */}
            <div className="">
              <label className="block mb-1 text-sm font-medium">
                Club Description / Purpose
              </label>
              <textarea
                name="clubDescription"
                value={formData.clubDescription}
                onChange={handleChange}
                rows={1}
                className={`border p-2 w-full rounded ${
                  isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                readOnly={isViewMode}
              />
            </div>

            {/* Club Category */}
            <div>
              <label className="block mb-1 text-sm font-medium">Club Category</label>
              <select
                name="clubCategory"
                value={formData.clubCategory}
                onChange={handleChange}
                className={`border p-2 w-full rounded ${
                  isViewMode ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={isViewMode}
              >
                <option value="">Select Category</option>
                <option value="Academic">Academic</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Technical">Technical</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block mb-1 text-sm font-medium">Major / Department</label>
              <input
                name="targetMajor"
                value={formData.targetMajor}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                readOnly={isViewMode}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Gender</label>
              <select
                name="targetGender"
                value={formData.targetGender}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                disabled={isViewMode}
              >
                <option value="">Select</option>
                <option value="All">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Year Level</label>
              <input
                name="targetYear"
                value={formData.targetYear}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                readOnly={isViewMode}
              />
            </div>

            {/* Proposed Activities */}
            <div className="lg:col-span-3">
              <label className="block mb-1 text-sm font-medium">
                Proposed Activities
              </label>
              <textarea
                name="proposedActivities"
                value={formData.proposedActivities}
                onChange={handleChange}
                rows={2}
                className="border p-2 w-full rounded"
                readOnly={isViewMode}
              />
            </div>

            {/* Club Logo */}
            <div>
              <label className="block mb-1 text-sm font-medium">Club Logo / Image</label>
              <input
                type="file"
                name="clubLogo"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isViewMode}
                className="border p-2 w-full rounded"
              />
            </div>

            {/* Social Links */}
            <div className="">
              <label className="block mb-1 text-sm font-medium">
                Social Media Links (optional)
              </label>
              <input
                name="socialLinks"
                value={formData.socialLinks}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                readOnly={isViewMode}
              />
            </div>

            {/* Leadership */}
            <div>
              <label className="block mb-1 text-sm font-medium">President Name</label>
              <input
                name="presidentName"
                value={formData.presidentName}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                readOnly={isViewMode}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">President ID</label>
              <input
                name="presidentId"
                value={formData.presidentId}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                readOnly={isViewMode}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Vice President Name</label>
              <input
                name="vicePresidentName"
                value={formData.vicePresidentName}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                readOnly={isViewMode}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Vice President ID</label>
              <input
                name="vicePresidentId"
                value={formData.vicePresidentId}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                readOnly={isViewMode}
              />
            </div>

            {/* Justification */}
            <div className="lg:col-span-3">
              <label className="block mb-1 text-sm font-medium">
                Justification / Vision Statement
              </label>
              <textarea
                name="justification"
                value={formData.justification}
                onChange={handleChange}
                rows={2}
                className="border p-2 w-full rounded"
                readOnly={isViewMode}
              />
            </div>

            {/* Expected Members */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Expected Number of Members
              </label>
              <input
                name="expectedMembers"
                value={formData.expectedMembers}
                onChange={handleChange}
                type="number"
                className="border p-2 w-full rounded"
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
              onClick={() => navigate("/new-clubs")}
            />
            {!isViewMode && (
              <Button
                text={isEditMode ? "Update Club" : "Submit Proposal"}
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

export default NewClubForm;
