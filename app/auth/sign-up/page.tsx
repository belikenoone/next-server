"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Loader2 } from "lucide-react";
import { handleLoginAction } from "@/actions/action";
import Link from "next/link";

const Signup = () => {
  const [state, loginAction, isLoading] = useActionState(
    handleLoginAction,
    null,
  );
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-gray-500">Create your account to get started</p>
        </div>
        <form action={loginAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              className={`${state?.errors?.fullName && "border-red-500"}`}
              name="fullName"
              id="fullName"
              placeholder="John Doe"
              defaultValue={state?.values?.fullName as string}
            />
            {state?.errors?.fullName && (
              <p className="text-sm text-red-500">{state.errors.fullName[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              className={`${state?.errors?.email && "border-red-500"}`}
              id="email"
              type="email"
              name="email"
              placeholder="john@example.com"
              defaultValue={state?.values?.email as string}
            />
            {state?.errors?.email && (
              <p className="text-sm text-red-500">{state.errors.email[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              className={`${state?.errors?.password && "border-red-500"}`}
              name="password"
              id="password"
              type="password"
              defaultValue={state?.values?.password as string}
            />
            {state?.errors?.password && (
              <p className="text-sm text-red-500">{state.errors.password[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex">
              <div className="flex items-center justify-center rounded-l-md border border-r-0 bg-gray-50 px-3">
                <span className="text-xl">🇮🇳</span>
                <span className="ml-2 text-sm text-gray-500">+91</span>
              </div>
              <Input
                className={`${state?.errors?.phoneNumber && "border-red-500"} rounded-l-none`}
                defaultValue={state?.values?.phoneNumber as string}
                name="phoneNumber"
                id="phone"
                type="tel"
                placeholder="9876543210"
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit Indian phone number"
              />
            </div>
            {state?.errors?.phoneNumber && (
              <p className="text-sm text-red-500">
                {state.errors.phoneNumber[0]}
              </p>
            )}
          </div>

          {isLoading ? (
            <Button className="w-full">
              <Loader2 className="mr-3 h-4 w-4 animate-spin" />
              Signing Up..
            </Button>
          ) : (
            <Button className="w-full">Sign Up</Button>
          )}
        </form>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/auth/log-in"
            className="font-medium text-blue-600 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Signup;
