import React from "react";

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600"
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarInitials = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className="font-medium text-gray-600 dark:text-gray-300"
    {...props}
  />
));
AvatarInitials.displayName = "AvatarInitials";

const generateTextInitials = (text: string) => {
  const parts = text
    .replace(/@.*$/, "")
    .toUpperCase()
    .split(/[^A-Z0-9]/g)
    .filter((p) => p.trim() !== "");

  const initials =
    parts.length > 1
      ? parts[0].slice(0, 1) + parts[1].slice(0, 1)
      : parts.length === 1
        ? parts[0][0]
        : "-";

  return initials;
};

export { Avatar, AvatarInitials, generateTextInitials };
