import React from "react";
import { CardWrapper } from "./card-wrapper";
import { BsExclamationCircle } from "react-icons/bs";

const ErrorCard = () => {
  return (
    <CardWrapper
    headerLabel=""
    backButtonHref="/auth/login"
    backButtonLabel="Go back to login"
    >
        <div>
            <BsExclamationCircle className="text-red-500 text-3xl mx-auto mb-5" />
            <p className="text-center text-red-600">An error occurred while trying to sign you in. Please try again later.</p>
        </div>
    </CardWrapper>
  );
};

export default ErrorCard;
