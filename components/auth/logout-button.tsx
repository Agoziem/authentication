"use client";
import { signOut } from "next-auth/react";

interface LogoutButtonProps {
    children: React.ReactNode;
}

import React from 'react'

const LogoutButton = ({children}:LogoutButtonProps) => {
const onClick = () => {
    signOut();
}
  return (
    <span onClick={onClick} className="cursor-pointer">
        {children}
    </span>
  )
}

export default LogoutButton