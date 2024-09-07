"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { toast } from "sonner";

const AdminPage = () => {
  const makeApiCall = async () => {
    try {
      const res = await fetch("/api/admin");
      if (res.ok) {
        toast.success("API Call Successful");
      } else {
        toast.error("API Call Failed");
      }
    } catch (error) {
      toast.error("API Call Failed");
    }
  };
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin</p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center rounded-lg border p-3 shadow-sm">
          <p>Make an API Call</p>
          <Button onClick={makeApiCall}>click me</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
