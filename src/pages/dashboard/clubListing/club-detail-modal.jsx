import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import fallbackLogo from "@/assets/images/all-img/widget-bg-5.png";

const ClubDetailModal = ({ club, onClose }) => {
  if (!club) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-xl w-[85%] max-w-4xl h-auto max-h-[85vh] overflow-y-auto p-6 relative"
        >
          {/* ✅ Club Logo at Top-Left */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={club.clubLogo || fallbackLogo}
              alt={club.clubName}
              className="w-12 h-12 object-cover rounded-full border border-gray-300 shadow-sm"
              onError={(e) => (e.target.src = fallbackLogo)}
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{club.clubName}</h2>
              <p className="text-sm text-gray-500">{club.clubCategory || "N/A"}</p>
            </div>
          </div>

          {/* ✅ Description */}
          <p className="text-gray-700 mb-6 leading-relaxed">
            {club.clubDescription || "No description available."}
          </p>

          {/* ✅ Club Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
            <p>
              <strong>Target Gender:</strong> {club.targetGender || "All"}
            </p>
            <p>
              <strong>Expected Members:</strong> {club.expectedMembers || "N/A"}
            </p>
            <p>
              <strong>President:</strong> {club.presidentName || "N/A"}
            </p>
            <p>
              <strong>Vice President:</strong> {club.vicePresidentName || "N/A"}
            </p>
          </div>

          {/* ✅ Vision / Justification */}
          {club.justification && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-1">
                Vision / Justification
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {club.justification}
              </p>
            </div>
          )}

          {/* ✅ Social Links */}
          {club.socialLinks && club.socialLinks.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 mb-1">Social Media Links</h3>
              <div className="flex flex-wrap gap-2 text-blue-600 text-sm">
                {club.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline break-all"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Members List */}
          {club.members && club.members.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-2">Members List</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-3 py-2 border">Name</th>
                      <th className="px-3 py-2 border">Student ID</th>
                      <th className="px-3 py-2 border">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {club.members.map((member) => (
                      <tr key={member._id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 border">{member.name}</td>
                        <td className="px-3 py-2 border">{member.studentId}</td>
                        <td className="px-3 py-2 border">{member.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ✅ Close Button */}
          <div className="flex justify-end mt-8">
            <Button
              text="Close"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              onClick={onClose}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ClubDetailModal;
