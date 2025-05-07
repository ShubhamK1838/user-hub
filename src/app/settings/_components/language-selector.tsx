
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Here you would typically load the saved language preference
    // For now, default to 'en'
  }, []);

  if (!mounted) {
    return <div className="w-[180px] h-10 bg-muted rounded-md animate-pulse" />;
  }

  return (
    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
      <SelectTrigger className="w-[180px]" id="language-selector">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es" disabled>Español (Coming Soon)</SelectItem>
        <SelectItem value="fr" disabled>Français (Coming Soon)</SelectItem>
        <SelectItem value="de" disabled>Deutsch (Coming Soon)</SelectItem>
      </SelectContent>
    </Select>
  );
}
