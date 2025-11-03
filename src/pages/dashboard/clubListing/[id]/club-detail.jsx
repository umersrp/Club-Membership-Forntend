import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import axios from "axios";

const ClubDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/club/${id}`, {
          headers: { Authorization: `${token}` },
        });
        setClub(res.data.data);
      } catch (err) {
        console.error("Error fetching club:", err);
        setMessage("Error loading club details");
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

  if (loading) return <p>Loading club details...</p>;
  if (!club) return <p className="text-red-500">{message || "Club not found"}</p>;

  return (
    <div className="p-6">
      <Card title="View Club Details">
        {/* Club Info Section */}
        <div className="grid lg:grid-cols-3 gap-6 p-4">
          <InfoField label="Club Name" value={club.clubName} />
          <InfoField label="Club Description" value={club.clubDescription} />
          <InfoField label="Club Category" value={club.clubCategory} />
          <InfoField label="Target Major" value={club.targetMajor?.join(", ")} />
          <InfoField label="Target Gender" value={club.targetGender} />
          <InfoField label="Target Year" value={club.targetYear?.join(", ")} />
          <InfoField label="Proposed Activities" value={club.proposedActivities?.join(", ")} />
          <InfoField label="Social Links" value={club.socialLinks?.join(", ")} />
          <InfoField label="Expected Members" value={club.expectedMembers} />
          <InfoField label="Justification / Vision" value={club.justification} />
          <InfoField label="President Name" value={club.presidentName} />
          <InfoField label="Vice President Name" value={club.vicePresidentName} />
        </div>

        {/* Club Logo */}
        {club.clubLogo && (
          <div className="p-4">
            <label className="block mb-2 text-sm font-medium">Club Logo</label>
            <img
              src={club.clubLogo}
              alt="Club Logo"
              className="w-40 h-40 object-cover rounded border"
            />
          </div>
        )}

        {/* Created / Updated Info */}
        <div className="p-4 text-sm text-gray-600 border-t mt-4">
          <p>
            <strong>Created By:</strong> {club.createdBy?.name} ({club.createdBy?.email})
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(club.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Last Updated:</strong>{" "}
            {new Date(club.updatedAt).toLocaleString()}
          </p>
        </div>

        {/* Members Section */}
        <div className="p-4 mt-6">
          <h3 className="text-lg font-semibold mb-2">Club Members</h3>
          {club.members && club.members.length > 0 ? (
            <table className="w-full border-collapse border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Student ID</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Type</th>
                </tr>
              </thead>
              <tbody>
                {club.members.map((m) => (
                  <tr key={m._id} className="border-t">
                    <td className="border p-2">{m.name}</td>
                    <td className="border p-2">{m.studentId}</td>
                    <td className="border p-2">{m.email}</td>
                    <td className="border p-2 capitalize">{m.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No members added yet.</p>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end p-4 border-t mt-6">
          <Button
            text="Back to List"
            className="btn-light"
            onClick={() => navigate("/new-club-listing")}
          />
        </div>
      </Card>
    </div>
  );
};

// Reusable read-only display field
const InfoField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <div className="border rounded p-2 bg-gray-50 text-gray-800 min-h-[40px]">
      {value || "—"}
    </div>
  </div>
);

export default ClubDetail;
