
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
  }, [backgroundColor]);

  // Initialize with black background on component mount
  useEffect(() => {
    setBackgroundColor("#000000");
  }, []);

  const colorOptions = [
    { name: "Black", value: "#000000" },
    { name: "Dark Gray", value: "#121212" },
    { name: "Navy", value: "#0a192f" },
    { name: "Dark Purple", value: "#13111c" }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="p-2">
          <p className="text-xs font-medium mb-2">Background Color</p>
          <div className="grid grid-cols-4 gap-1">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                className={`w-6 h-6 rounded-full border ${
                  backgroundColor === color.value ? "ring-2 ring-gathr-coral" : "border-muted"
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => setBackgroundColor(color.value)}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
