
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateLanguagePreferenceApi } from "@/lib/api-client"; // Import API client
import { Loader2 } from "lucide-react";

export function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    // TODO: In a real app, load the saved language preference from API
    // e.g., const userPrefs = await getUserPreferencesApi(); setSelectedLanguage(userPrefs.language);
  }, []);

  const handleLanguageChange = async (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    setIsSaving(true);
    try {
      const response = await updateLanguagePreferenceApi({ language: newLanguage });
      toast({
        title: "Language Updated",
        description: response.message || `Language preference set to ${newLanguage}.`,
      });
      // If app needs to re-render for language change, router.refresh() or similar might be needed.
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not update language preference.",
      });
      // Revert selection on error if desired, or keep UI optimistic
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) {
    return <div className="w-[180px] h-10 bg-muted rounded-md animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedLanguage} onValueChange={handleLanguageChange} disabled={isSaving}>
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
      {isSaving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
    </div>
  );
}
