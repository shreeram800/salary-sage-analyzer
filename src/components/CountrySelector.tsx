
import { useState } from "react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { countries } from "@/utils/dataUtils";
import { CountryInfo } from "@/types";

interface CountrySelectorProps {
  selectedCountry: CountryInfo | null;
  onSelect: (country: CountryInfo) => void;
}

const CountrySelector = ({ selectedCountry, onSelect }: CountrySelectorProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-16 py-6 bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm hover:bg-white/90 transition-all duration-200"
          >
            {selectedCountry ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedCountry.flag}</span>
                <span>{selectedCountry.name}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({selectedCountry.currency.symbol} {selectedCountry.currency.code})
                </span>
              </div>
            ) : (
              <span className="text-gray-400">Select your country...</span>
            )}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 max-h-[300px] overflow-y-auto">
          <Command>
            <CommandInput placeholder="Search country..." className="h-9" />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {countries.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={country.name}
                    onSelect={() => {
                      onSelect(country);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 py-2"
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span>{country.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({country.currency.symbol} {country.currency.code})
                    </span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedCountry?.code === country.code
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CountrySelector;
