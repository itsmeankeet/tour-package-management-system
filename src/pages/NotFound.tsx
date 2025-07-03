import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import animationData from "@/assets/lottie/404.json"; // path to your animation

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-300 p-6 text-center">
      <div className="w-80 h-80 mb-4">
        <Lottie animationData={animationData} loop autoplay />
      </div>

      <h1 className="text-5xl font-extrabold text-gray-800 mb-2">404</h1>
      <p className="text-lg text-gray-600 mb-6">
        Whoops! Page doesn’t exist.
      </p>

      <Button
        onClick={() => navigate("/")}
        className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3 rounded-lg shadow-md transition duration-300"
      >
        Home
      </Button>

      <p className="mt-6 text-sm text-gray-500 italic">
        Even the internet gets lost sometimes...
      </p>
    </div>
  );
};

export default NotFound;
