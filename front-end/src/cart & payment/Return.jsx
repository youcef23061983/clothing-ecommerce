import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Return = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      // Verify payment was successful
      navigate("/order", { state: { sessionId } });
    } else {
      navigate("/cart");
    }
  }, [sessionId, navigate]);

  return <div>Processing your payment...</div>;
};

export default Return;
