import { H2 } from "@/components/typography";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="grid place-items-center flex-1">
      <div className="flex flex-col gap-2 text-center">
        <H2 className="text-xl uppercase">Page not found</H2>
        <p>
          Return to{" "}
          <Link to="/" className="underline font-bold underline-offset-4">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
