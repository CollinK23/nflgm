import React from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import logo from "../constants/logo.svg";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Navbar = () => {
  return (
    <header className="w-full flex h-14 items-center gap-4 border-b  px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <div className="mt-auto">
            <Card>
              <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="min-w-[25px]">
              <img src={logo} className="w-[100%]"></img>
            </div>
            <span className="">GridironInsight</span>
          </Link>
        </div>
      </div>
      <div>
        <ul className="flex flex-row space-x-4">
          <li>
            <a className="cursor-pointer">Trade</a>
          </li>
          <li>
            <a className="cursor-pointer">Rosters</a>
          </li>
          <li>
            <a className="cursor-pointer">Compare</a>
          </li>
        </ul>
      </div>
      <ModeToggle></ModeToggle>
      <Button>Sync Leagues</Button>
    </header>
  );
};

export default Navbar;
