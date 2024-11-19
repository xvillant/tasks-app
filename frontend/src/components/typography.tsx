import clsx from "clsx";
import { ReactNode } from "react";

export const H1 = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <h1 className={clsx("text-5xl md:text-6xl font-bold", className)}>
      {children}
    </h1>
  );
};

export const H2 = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <h2 className={clsx("text-lg md:text-xl font-bold", className)}>
      {children}
    </h2>
  );
};

export const H3 = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <h3 className={clsx("text-md md:text-lg font-bold", className)}>
      {children}
    </h3>
  );
};

export const H4 = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <h4 className={clsx("text-sm md:text-md font-bold", className)}>
      {children}
    </h4>
  );
};

export const P = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return <p className={clsx("text-sm md:text-md", className)}>{children}</p>;
};

export const SPAN = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <span className={clsx("text-xs md:text-sm", className)}>{children}</span>
  );
};
