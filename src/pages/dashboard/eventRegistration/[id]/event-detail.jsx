import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import axios from "axios";

const EventDetailPage = () => {
  const { id } = useParams(); // get event id from URL
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/event/${id}`,
          { headers: { Authorization: `${token}` } }
        );
        setEventData(Array.isArray(res.data.data) ? res.data.data[0] : res.data.data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setMessage("Error loading event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p className="text-center p-4">Loading event details...</p>;
  if (!eventData) return <p className="text-red-500 p-4">{message || "Event not found"}</p>;

  const InfoField = ({ label, value }) => (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <div className="border rounded p-2 bg-gray-50 text-gray-800 min-h-[40px]">
        {value || "—"}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <Card title="Event Details">
        <div className="grid lg:grid-cols-3 gap-6 p-4">
          <InfoField label="Event Title" value={eventData.eventTitle} />
          <InfoField label="Description" value={eventData.eventDescription} />
          <InfoField label="Category" value={eventData.eventCategory} />
          <InfoField label="Date & Time" value={new Date(eventData.dateTime).toLocaleString()} />
          <InfoField label="Location" value={eventData.location} />
          <InfoField label="Duration" value={eventData.duration} />
          <InfoField label="Capacity Limit" value={eventData.capacityLimit} />
          <InfoField label="Registration Deadline" value={new Date(eventData.registrationDeadline).toLocaleDateString()} />
          <InfoField label="Target Gender" value={eventData.targetGender} />
          <InfoField label="Target Audience" value={eventData.targetAudience} />
          <InfoField label="Specific Majors" value={eventData.specificMajor?.join(", ")} />
          <InfoField label="Registration Required" value={eventData.registrationRequired ? "Yes" : "No"} />
          <InfoField label="Additional Requirements" value={eventData.additionalRequirements} />
          <InfoField label="Certificate Offered" value={eventData.certificateOffered ? "Yes" : "No"} />
          <InfoField label="Volunteer Hours" value={eventData.volunteerHoursAwarded} />
        </div>

        {eventData.eventImage && (
          <div className="p-4">
            <label className="block mb-2 text-sm font-medium">Event Image</label>
            <img src={eventData.eventImage} alt="Event" className="w-40 h-40 object-cover rounded border" />
          </div>
        )}

        {eventData.members?.length > 0 && (
          <div className="p-4 mt-6">
            <h3 className="text-lg font-semibold mb-3">Event Members</h3>
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
                  {eventData.members.map((m, idx) => (
                    <tr key={m._id} className="odd:bg-white even:bg-gray-50">
                      <td className="p-3 border">{idx + 1}</td>
                      <td className="p-3 border font-medium">{m.name}</td>
                      <td className="p-3 border">{m.studentId}</td>
                      <td className="p-3 border text-sm text-gray-700">{m.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end p-4 border-t mt-6">
          <Button text="Back to Event List" onClick={() => navigate("/event-registration-listing")} className="btn-light" />
        </div>
      </Card>
    </div>
  );
};

export default EventDetailPage;
