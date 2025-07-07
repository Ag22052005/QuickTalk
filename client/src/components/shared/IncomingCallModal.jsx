import React from "react";
import { Button } from "@/components/ui/button"; // assuming shadcn UI

const IncomingCallModal = ({ callerName, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 w-96 text-center shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
          Incoming Video Call
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {callerName} is calling...
        </p>

        {/* Optional: add ringtone with <audio autoPlay loop> */}

        <div className="flex justify-around">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={onAccept}
          >
            Accept
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={onReject}
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
