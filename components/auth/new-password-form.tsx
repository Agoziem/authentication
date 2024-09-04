"use client";
import React, { useState, useTransition } from "react";
import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormMessage,
  FormLabel,
  FormItem,
  FormField,
  FormControl,
} from "../ui/form";
import { NewPasswordSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { reset } from "@/actions/new-password";
import { MdRotateLeft } from "react-icons/md";
import { useSearchParams } from "next/navigation";

export const NewPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Form Hook
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  // Handle Submit
  const handleSubmit = (data: z.infer<typeof NewPasswordSchema>) => {
    startTransition(() => {
      reset(data, token)
        .then((data) => {
          if (data) {
            setError(data.error);
            setSuccess(data.success);
          }
        })
        .finally(() => {
          form.reset();
          setTimeout(() => {
            setError("");
            setSuccess("");
          }, 5000);
        });
    });
  };

  return (
    <CardWrapper
      headerLabel={"enter your New Password?"}
      backButtonHref={"/auth/login"}
      backButtonLabel={"Back to Login"}
      showSocial={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      id="password"
                      type="password"
                      placeholder="******"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit" className="w-full">
              {isPending ? (
                <>
                  <MdRotateLeft className="animate-spin size-6 me-4" />{" "}
                    Reseting Password...{" "}
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
