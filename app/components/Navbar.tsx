"use client";

import React, { useState } from "react";
import { House, Search, Bell, User, ChevronUp } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  currentIndex: number;
}

const NAV_ITEMS = [
  { icon: House, href: "/", index: 0 },
  { icon: Search, href: "/search", index: 1 },
  { icon: Bell, href: "/", index: 2 },
  { icon: User, href: "/user", index: 3 },
];

const Navbar = ({ currentIndex }: NavbarProps) => {
  const activeColor = "#E9C46A";
  const defaultColor = "white";
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className="w-full flex justify-center fixed bottom-4">
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="rounded-full bg-primary font-poppins w-[93%] text-white flex justify-around shadow-xl py-4"
          >
            {NAV_ITEMS.map(({ icon: Icon, href, index }) => (
              <Link href={href} key={index}>
                <span className="flex flex-col items-center">
                  <Icon
                    className="text-[30px]"
                    color={currentIndex === index ? activeColor : defaultColor}
                  />
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={toggleCollapse}
        animate={{ rotate: isCollapsed ? 0 : 180 }}
        transition={{ duration: 0.3 }}
        className="absolute -top-6 transform -translate-x-1/2 bg-primary rounded-full p-2 flex items-center justify-center shadow-md"
      >
        <ChevronUp color="white" />
      </motion.button>
    </nav>
  );
};

export default Navbar;
