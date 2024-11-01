import React from "react";

export default function MainTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto mb-8 max-w-screen-sm text-center lg:mb-16">
      <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-4xl">
        {children}
      </h2>
    </div>
  );
}