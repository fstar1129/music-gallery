import React from "react";
import { useDispatch } from "react-redux";
import { setLoginModalState } from "../../features/auth/authSlice";

const SignUpHeading = () => {
  const dispatch = useDispatch();
  return (
    <div className="sm:mx-auto">
      <h2 className="mt-6 text-center text-3xl leading-9 font-bold text-gray-900">
        Create an account
      </h2>
      <p className="mt-2 text-center text-sm leading-5 text-gray-600 max-w">
        Or&nbsp;
        <button
          href="#"
          className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150"
          onClick={() =>
            dispatch(
              setLoginModalState({
                loginModalShowing: true,
                activeAuthForm: "signIn"
              })
            )
          }
        >
          sign in to your account
        </button>
      </p>
    </div>
  );
};

export default SignUpHeading;