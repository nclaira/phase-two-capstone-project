// Container component - Responsive grid container for page content
import { ReactNode } from "react";

// Define the props type for the Container component
interface ContainerProps {
  children: ReactNode; // ReactNode means it can accept any React content
  className?: string; // Optional className for custom styling
}

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`container mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
}

