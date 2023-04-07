import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { boldSmall, pillButton } from "../utils/styles";
export default function SignupToApply() {
  const navigate = useNavigate;
  return (
    <div>
      <div className="h-100 pb-5">
        <div className="text-center mt-5 mb-4">
          <p style={boldSmall}>
            Login to your account to apply to this property
          </p>
        </div>

        <div className="text-center pt-1 pb-3 mb-5">
          <Button
            variant="outline-primary"
            style={pillButton}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
        <div className="flex-grow-1 d-flex flex-column justify-content-start mt-5">
          <div className="text-center mt-5">
            <p style={boldSmall} className="mb-1 mt-5">
              Don't have an account?
            </p>
            <Button
              variant="outline-primary"
              // onClick={() => navigate("/signuproles")}
              onClick={() => navigate("/signup")}
              style={pillButton}
              className="mb-4"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
