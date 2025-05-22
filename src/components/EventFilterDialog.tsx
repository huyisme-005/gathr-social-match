
/**
 * EventFilterDialog Component
 * 
 * This component provides a dialog for filtering events by categories, date, and distance.
 * It receives current filters from the parent component and applies new filters when the user
 * submits the form.
 */
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { eventCategories } from "../data/eventCategories";
import { toast } from "sonner";

interface EventFilterDialogProps {
  open: boolean;                                // Controls dialog visibility
  onOpenChange: (open: boolean) => void;        // Callback to change dialog visibility
  filters: {                                    // Current active filters
    categories: string[];                       // Selected event categories
    date: Date | null;                          // Selected date filter
    distance: number;                           // Selected distance radius in km
  };
  onApplyFilters: (filters: { categories: string[]; date: Date | null; distance: number }) => void; // Callback when filters are applied
}

const EventFilterDialog = ({ 
  open, 
  onOpenChange, 
  filters, 
  onApplyFilters 
}: EventFilterDialogProps) => {
  // Local state for filter values in the dialog
  const [categories, setCategories] = useState<string[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [distance, setDistance] = useState(10);
  const [filtersChanged, setFiltersChanged] = useState(false);
  
  /**
   * Initialize filter state with current filters when dialog opens
   */
  useEffect(() => {
    if (open) {
      // Initialize state with current filters
      setCategories(filters.categories);
      setDate(filters.date);
      setDistance(filters.distance);
      setFiltersChanged(false);
    }
  }, [filters, open]);
  
  /**
   * Toggle a category in the selection
   */
  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter((c) => c !== category));
    } else {
      setCategories([...categories, category]);
    }
    setFiltersChanged(true);
  };
  
  /**
   * Apply selected filters and close the dialog
   */
  const handleApply = () => {
    onApplyFilters({ categories, date, distance });
    toast.success("Filters applied successfully");
    onOpenChange(false);
  };
  
  /**
   * Clear all filters
   */
  const handleClear = () => {
    setCategories([]);
    setDate(null);
    setDistance(10);
    setFiltersChanged(true);
  };

  /**
   * Handle date selection and flag that filters have changed
   */
  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate);
    setFiltersChanged(true);
  };

  /**
   * Handle distance change and flag that filters have changed
   */
  const handleDistanceChange = (newDistance: number[]) => {
    setDistance(newDistance[0]);
    setFiltersChanged(true);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Events</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Category filter */}
          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2">
              {eventCategories.map((category) => (
                <Badge
                  key={category}
                  variant={categories.includes(category) ? "default" : "outline"}
                  className={categories.includes(category) 
                    ? "bg-gathr-coral hover:bg-gathr-coral/80 cursor-pointer"
                    : "cursor-pointer hover:bg-muted"}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Date filter */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Calendar
              mode="single"
              selected={date || undefined}
              onSelect={handleDateChange as any}
              className="border rounded-md"
              disabled={(date) => date < new Date()}
            />
          </div>
          
          {/* Distance filter */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Distance</Label>
              <span className="text-sm">{distance} km</span>
            </div>
            <Slider
              value={[distance]}
              min={1}
              max={50}
              step={1}
              onValueChange={handleDistanceChange}
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleClear}>
            Clear All
          </Button>
          <Button 
            className="bg-gathr-coral hover:bg-gathr-coral/90" 
            onClick={handleApply}
            disabled={!filtersChanged}
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventFilterDialog;
