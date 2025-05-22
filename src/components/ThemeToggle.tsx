
import { Moon, Sun, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  
  // Set background color when it changes
  useEffect(() => {
    document.documentElement.style.setProperty('--background-color', backgroundColor);
    document.body.style.backgroundColor = backgroundColor;
    
    // Update text color based on background brightness
    const isLight = getContrastYIQ(backgroundColor);
    if (isLight) {
      document.documentElement.style.setProperty('--foreground', '0 0% 0%');
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    } else {
      document.documentElement.style.setProperty('--foreground', '0 0% 100%');
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    }
  }, [backgroundColor]);

  // Initialize with black background on component mount
  useEffect(() => {
    // Check for saved preference
    const savedColor = localStorage.getItem('gathr-background-color');
    if (savedColor) {
      setBackgroundColor(savedColor);
    } else {
      setBackgroundColor("#000000");
    }
  }, []);
  
  // Function to calculate brightness and determine if text should be dark or light
  const getContrastYIQ = (hexcolor: string) => {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0,2),16);
    const g = parseInt(hexcolor.substr(2,2),16);
    const b = parseInt(hexcolor.substr(4,2),16);
    const yiq = ((r*299)+(g*587)+(b*114))/1000;
    return yiq >= 128;
  };

  const colorOptions = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Dark Gray", value: "#121212" },
    { name: "Navy", value: "#0a192f" },
    { name: "Dark Purple", value: "#13111c" }
  ];
  
  const handleColorChange = (color: string) => {
    setBackgroundColor(color);
    localStorage.setItem('gathr-background-color', color);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          <span>Background color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="p-2">
          <p className="text-xs font-medium mb-2">Background Color</p>
          <div className="grid grid-cols-5 gap-1">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                className={`w-6 h-6 rounded-full border ${
                  backgroundColor === color.value ? "ring-2 ring-gathr-coral" : "border-muted"
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorChange(color.value)}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
