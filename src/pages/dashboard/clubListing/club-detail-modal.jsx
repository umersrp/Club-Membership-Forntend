import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

const ClubDetailModal = ({ club, onClose }) => {
    if (!club) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-white rounded-2xl shadow-xl w-[85%] max-w-5xl h-auto max-h-[80vh] overflow-y-auto flex flex-col md:flex-row"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {/* Left Section – Club Logo/Image */}
                    <div className="md:w-1/2 w-full flex items-center justify-center bg-gray-50 rounded-t-l-2xl md:rounded-l-2xl md:rounded-tr-none">
                        <motion.img
                            src={club.logo || club.image}
                            alt={club.name}
                            className="w-full h-80 md:h-full object-cover  shadow-md"
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    {/* Right Section – Club Info */}
                    <div className="md:w-1/2 w-full p-6 flex flex-col justify-between">
                        {/* Club Header */}
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                {club.name}
                            </h2>
                            <p className="text-sm text-gray-500 mb-4">
                                {club.category} • {club.major}
                            </p>

                            {/* Description */}
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                {club.description}
                            </p>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                                <p>
                                    <strong>Interest:</strong> {club.interest || "—"}
                                </p>
                                <p>
                                    <strong>Target Gender:</strong> {club.gender || "All"}
                                </p>
                                <p>
                                    <strong>Year Level:</strong> {club.yearLevel || "All Levels"}
                                </p>
                                <p>
                                    <strong>Expected Members:</strong>{" "}
                                    {club.expectedMembers || "N/A"}
                                </p>
                                <p>
                                    <strong>President:</strong> {club.president || "N/A"}
                                </p>
                                {club.vicePresident && (
                                    <p>
                                        <strong>Vice President:</strong> {club.vicePresident}
                                    </p>
                                )}
                            </div>

                            {/* Vision / Justification */}
                            {club.vision && (
                                <div className="mt-6">
                                    <h3 className="font-semibold text-gray-800 mb-1">
                                        Vision / Justification
                                    </h3>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {club.vision}
                                    </p>
                                </div>
                            )}

                            {/* Social Links */}
                            {club.socialLinks && (
                                <div className="mt-4">
                                    <h3 className="font-semibold text-gray-800 mb-1">
                                        Social Media Links
                                    </h3>
                                    <div className="flex flex-wrap gap-2 text-blue-600 text-sm">
                                        {club.socialLinks.map((link, idx) => (
                                            <a
                                                key={idx}
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline"
                                            >
                                                {link}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-end mt-8">
                            <Button
                                text="Close"
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                                onClick={onClose}
                            />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ClubDetailModal;
