import React from "react";
import { TextInput } from "@/components/shared";
import { Card, CardTitle } from "@/components/ui/card";
import { MdOutlineMailOutline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { BsSend } from "react-icons/bs";

const Signup = () => {
  return (
    <article className="w-[90%] max-w-[500px]">
      <Card className="shadow-md px-3 py-6">
        <CardTitle className="text-lg">Sign Up</CardTitle>
        <p className="leading-7 my-2 text-xs md:text-sm font-light">
          Please enter your email address to sign up
        </p>
        <form className="mt-4 flex flex-col gap-2">
          <TextInput
            leftIcon={<MdOutlineMailOutline className="text-purple-700" />}
            placeholder="Email"
          />
          <Button className="w-full">
            <BsSend className="text-white inline-block mr-1" /> Send Link
          </Button>
        </form>
      </Card>
    </article>
  );
};

export default Signup;
