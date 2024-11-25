import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CircleUser, Home, Menu } from "lucide-react";

import logo from "../../constants/logo.svg";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import TeamSelect from "../TeamSelect";
import TeamOverview from "../Cards/TeamOverview";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Roster, TradeCompare } from "..";
import PlayerCompare from "../playerCompare/PlayerCompare";
import { useSelector, useDispatch } from "react-redux";
import {
  addLeague,
  updateSwid,
  updateUserId,
} from "../../features/user/userSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Breadcrumbs } from "../Breadcrumb";
import { handlePathChange } from "./helpers";

const sections = ["Dashboard", "Roster", "Trade", "Compare"];

export default function Dashboard() {
  const { page, id, teamId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.user.userId);
  const swid = useSelector((state) => state.user.swid);

  const [tempUserId, setTempUserId] = useState(userId);
  const [tempSwid, setTempSwid] = useState(swid);

  const fetchData = async () => {
    if (userId == "") {
      dispatch(updateUserId(userId));
      dispatch(addLeague([]));
    } else {
      try {
        const response = await fetch(`http://127.0.0.1:8000/leagues/${userId}`);
        const data = await response.json();
        dispatch(updateUserId(userId));
        dispatch(addLeague(data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="min-w-[25px]">
                <img src={logo} className="w-[100%]"></img>
              </div>
              <span>GridironInsight</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {sections.map((s) => {
                return (
                  <div
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary cursor-pointer"
                    onClick={() =>
                      navigate(handlePathChange(s.toLowerCase(), location))
                    }
                  >
                    <Home className="h-4 w-4" />
                    {s}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                {sections.map((s) => {
                  return (
                    <div
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary cursor-pointer"
                      onClick={() => handleChange(s.toLowerCase())}
                    >
                      <Home className="h-4 w-4" />
                      {s}
                    </div>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex flex-row items-center space-x-4">
            <TeamSelect />
            <Breadcrumbs />
          </div>
          <ModeToggle></ModeToggle>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <span>Sync Accounts</span>
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Sync Accounts</DialogTitle>
                <DialogDescription>
                  Enter your ESPN ID to sync your ESPN Fantasy leagues. Enter
                  your SWID to Access private ESPN leagues.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    ESPN ID
                  </Label>
                  <Input
                    id="espnid"
                    value={tempUserId}
                    className="col-span-3"
                    onChange={(e) => setTempUserId(e.target.value)}
                  />
                  <Label htmlFor="name" className="text-right">
                    SWID
                  </Label>
                  <Input
                    id="swid"
                    value={tempSwid}
                    className="col-span-3"
                    onChange={(e) => setTempSwid(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="submit"
                    onClick={() => {
                      dispatch(updateUserId(tempUserId));
                      dispatch(updateSwid(tempSwid));
                    }}
                  >
                    Save changes
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="overflow-y-hidden">
            {!page && (
              <TeamOverview
                id={id}
                teamId={teamId}
                footerContent={<Button>View Roster</Button>}
                showStandings={true}
                showTopPerformers={true}
              />
            )}
            {page === "roster" && <Roster id={id} team={teamId} />}
            {page === "trade" && (
              <div>
                <Card>
                  <CardHeader>
                    <TradeCompare />
                  </CardHeader>
                  <div className="flex flex-row px-4">
                    <Roster
                      id={id}
                      team={teamId}
                      compare={true}
                      teamSelected={0}
                    />
                    <Roster
                      id={id}
                      team={teamId}
                      compare={true}
                      teamSelected={1}
                    />
                  </div>
                </Card>
              </div>
            )}
            {page === "compare" && <PlayerCompare />}
          </div>
        </main>
      </div>
    </div>
  );
}
