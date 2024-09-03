import React from "react";
import { CheckCircle2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormSuccessProps {
  message?: string;
}
export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) {
    return null;
  }
  return (
    <Alert variant="default" className="bg-emerald-500/15 text-green-700">
      <CheckCircle2 className="h-4 w-4 stroke-green-700" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
