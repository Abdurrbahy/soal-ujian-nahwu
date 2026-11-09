"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface ExamModeContextType {
  isExamActive: boolean;
  setIsExamActive: (active: boolean) => void;
}

const ExamModeContext = createContext<ExamModeContextType>({
  isExamActive: false,
  setIsExamActive: () => {},
});

export function ExamModeProvider({ children }: { children: React.ReactNode }) {
  const [isExamActive, setIsExamActive] = useState(false);
  const pathname = usePathname();

  // If user navigates away from /ujian, turn off isExamActive
  useEffect(() => {
    if (pathname !== "/ujian") {
      setIsExamActive(false);
    }
  }, [pathname]);

  return (
    <ExamModeContext.Provider value={{ isExamActive, setIsExamActive }}>
      {children}
    </ExamModeContext.Provider>
  );
}

export function useExamMode() {
  return useContext(ExamModeContext);
}
