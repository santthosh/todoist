'use client';

import { useState, useEffect } from 'react';
import { DarkThemeToggle, Navbar as FlowbiteNavbar, Tooltip } from 'flowbite-react';
import { HiCloud } from 'react-icons/hi';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check the current theme when component mounts
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    // Add listener for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <FlowbiteNavbar fluid className="border-b border-gray-200 dark:border-gray-700 py-3">
      <FlowbiteNavbar.Brand href="/">
        <HiCloud className="mr-2 h-6 w-6 text-blue-500" />
        <div className="flex flex-col">
          <span className="whitespace-nowrap text-xl font-semibold dark:text-white">
            todoist.cloud
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline-block">
            Easy to manage tasks and reminders
          </span>
        </div>
      </FlowbiteNavbar.Brand>
      
      {/* Mobile toggle button */}
      <div className="flex md:hidden">
        <FlowbiteNavbar.Toggle />
      </div>
      
      {/* Navigation links and theme switcher in one row */}
      <div className="hidden md:flex items-center gap-2 ml-auto list-none">
        <FlowbiteNavbar.Link href="/" active className="md:px-2">
          Home
        </FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link href="https://github.com/santthosh/todoist" target="_blank" className="md:px-2">
          GitHub
        </FlowbiteNavbar.Link>
        
        <Tooltip content={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
          <div className="flex items-center">
            <DarkThemeToggle className="focus:ring-0 h-9 w-9" />
          </div>
        </Tooltip>
      </div>
      
      {/* Mobile menu - will be shown when toggle is clicked */}
      <FlowbiteNavbar.Collapse>
        <FlowbiteNavbar.Link href="/" className="md:hidden py-2">
          Home
        </FlowbiteNavbar.Link>
        
        <FlowbiteNavbar.Link href="https://github.com/santthosh/todoist" target="_blank" className="md:hidden py-2">
          GitHub
        </FlowbiteNavbar.Link>
        
        <div className="flex items-center md:hidden mt-2 py-2">
          <span className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </span>
          <DarkThemeToggle className="focus:ring-0 h-9 w-9" />
        </div>
      </FlowbiteNavbar.Collapse>
    </FlowbiteNavbar>
  );
} 