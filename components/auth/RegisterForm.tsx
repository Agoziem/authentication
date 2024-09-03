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
import { RegisterSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { register } from "@/actions/register";
import { MdRotateLeft } from "react-icons/md";

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  // Form Hook
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  // Handle Submit
  const handleSubmit = (data: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      register(data)
        .then((data) => {
          if ("error" in data) {
            setError(data.error);
            setSuccess("");
          } else {
            setError("");
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
      headerLabel={"Create an account"}
      backButtonHref={"/auth/login"}
      backButtonLabel={"Already have an account?"}
      showSocial={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      id="username"
                      placeholder="Gideon"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      id="email"
                      type="email"
                      placeholder="gideonwatch@gmail.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
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
                      placeholder="********"
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
                  submitting...{" "}
                </>
              ) : (
                "Create an account"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
