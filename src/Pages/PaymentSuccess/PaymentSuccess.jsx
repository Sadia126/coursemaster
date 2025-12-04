import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get("session_id");
  const courseId = params.get("courseId");

  useEffect(() => {
    if (!sessionId || !courseId) {
      toast.error("Invalid payment redirect");
    } else {
      toast.success("Payment successful! Your course is now active.");
    }
  }, [sessionId, courseId]);

  return (
    <div className="flex items-center justify-center min-h-screen  px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md text-center">
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your course is now available in your
          dashboard.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer bg-linear-to-r from-[#638efb] via-[#4f76e5] to-[#1b59ba] text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
