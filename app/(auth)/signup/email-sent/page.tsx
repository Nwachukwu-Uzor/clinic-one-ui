import React from "react";
import { TextInput } from "@/components/shared";
import { Card, CardTitle } from "@/components/ui/card";
import { MdOutlineMailOutline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { BsSend } from "react-icons/bs";
import { SiMinutemailer } from "react-icons/si";

const EmailSent = () => {
  return (
    <article className="w-[90%] max-w-[500px]">
      <Card className="shadow-sm px-3 py-6">
        {/* <CardTitle className="text-lg text-center">Email Sent</CardTitle> */}
        <div className="h-12 w-12 mx-auto my-2 bg-purple-600 text-white rounded-full flex items-center justify-center">
          <SiMinutemailer className="text-xl lg:text-3xl" />
        </div>
        <p className="leading-7 my-2 text-xs md:text-sm font-light text-center">
          A confirmation link has been sent to your email address.
        </p>
      </Card>
    </article>
  );
};

export default EmailSent;
