"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";
import LogoutButton from "./logout-button";
import Link from "next/link";

import { IoMdExit } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";

const UserButton = () => {
  const user = useCurrentUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="">
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-radialgradient">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem>
          <IoSettingsSharp className="size-4 me-2" />
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IoMdExit className="size-4 me-2" />{" "}
          <LogoutButton>Logout</LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
