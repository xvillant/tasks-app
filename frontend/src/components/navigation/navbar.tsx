import { Link } from "react-router-dom";
import { CalendarCheck, Menu } from "lucide-react";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation/navigation";

export default function Navbar() {
  return (
    <header className="flex h-16 w-full items-center border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl flex justify-between w-full items-center px-4 md:px-6">
        <Link to="/" className="flex items-center">
          <CalendarCheck className="size-6" />
          <span className="sr-only">Tasks</span>
        </Link>
        <nav className="hidden lg:flex items-center space-x-6">
          <Navigation />
        </nav>
        <div className="ml-auto flex items-center space-x-4 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="size-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="grid gap-6 p-6">
                <Navigation />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
