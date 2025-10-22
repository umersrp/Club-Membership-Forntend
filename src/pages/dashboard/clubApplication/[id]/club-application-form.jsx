import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import axios from "axios";

const ClubApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.state?.mode || "add"; // add | view | edit
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

  // fetch application (for view/edit)
  useEffect(() => {
    const fetchApplication = async () => {
      if (!(isViewMode || isEditMode) || !id || id === "add") {
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

    // Basic validation
    if (!formData.motivation.trim()) return setMessage("Motivation is required");
    if (!formData.contribution.trim()) return setMessage("Expected contribution is required");
    if (!formData.availability.trim()) return setMessage("Availability (hours/week) is required");

    try {
      const token = localStorage.getItem("token");
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
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/join-club-applications/create`,
          formData,
          {
            headers: { "Content-Type": "application/json", Authorization: `${token}` },
          }
        );
        setMessage("Application submitted successfully!");
      }

      setTimeout(() => navigate("/join-club-applications"), 900);
    } catch (err) {
      console.error("Error saving application:", err);
      setMessage("Error saving application");
    }
  };

  if (loading) return <p>Loading application data...</p>;

  return (
    <div>
      <Card
        title={
          isViewMode
            ? "View Join Club Application"
            : isEditMode
            ? "Edit Join Club Application"
            : "Join Club Application"
        }
      >
        <form onSubmit={handleSubmit} className="p-4">
          <div className="lg:grid-cols-2 grid gap-8 grid-cols-1">
            {/* Motivation */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Motivation / Why do you want to join?</label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                rows={2}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode}
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium mb-1">Relevant Skills / Experience (optional)</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                rows={1}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode}
              />
            </div>

            {/* Contribution */}
            <div>
              <label className="block text-sm font-medium mb-1">Expected Contribution</label>
              <textarea
                name="contribution"
                value={formData.contribution}
                onChange={handleInputChange}
                rows={1}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode}
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium mb-1">Availability (hours per week)</label>
              <input
                type="number"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode}
              />
            </div>

            {/* Previous Club Experience */}
            <div>
              <label className="block text-sm font-medium mb-1">Previous Club Experience (optional)</label>
              <textarea
                name="previousExperience"
                value={formData.previousExperience}
                onChange={handleInputChange}
                rows={1}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode}
              />
            </div>

            {/* Custom Questions */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Any additional custom questions set by the club</label>
              <textarea
                name="customQuestions"
                value={formData.customQuestions}
                onChange={handleInputChange}
                rows={2}
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
              onClick={() => navigate("/join-club-applications")}
            />
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
            <p className="text-center">{message}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ClubApplicationForm;
