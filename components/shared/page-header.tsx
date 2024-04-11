import React from "react";

type Props = {
  title: string;
};

export const PageHeader: React.FC<Props> = ({ title }) => {
  return (
    <div className="bg-purple-100 h-[10vh] rounded-md flex items-center justify-center">
      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight text-purple-800 first:mt-0">
        {title}
      </h2>
    </div>
  );
};
