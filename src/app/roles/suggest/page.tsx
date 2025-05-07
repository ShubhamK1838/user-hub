
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { suggestUserRoles } from "@/ai/flows/suggest-user-roles";
import { BrainCircuit, Loader2, Sparkles } from "lucide-react";
import { ALL_ROLES } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Separator } from "@/components/ui/separator";

const suggestRolesSchema = z.object({
  jobTitle: z.string().min(3, "Job title must be at least 3 characters.").max(100),
});

type SuggestRolesFormValues = z.infer<typeof suggestRolesSchema>;

export default function SuggestRolesPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedRoles, setSuggestedRoles] = useState<string[]>([]);

  const form = useForm<SuggestRolesFormValues>({
    resolver: zodResolver(suggestRolesSchema),
    defaultValues: {
      jobTitle: "",
    },
  });

  async function onSubmit(values: SuggestRolesFormValues) {
    setIsLoading(true);
    setSuggestedRoles([]);
    try {
      const result = await suggestUserRoles({ jobTitle: values.jobTitle });
      if (result.suggestedRoles && result.suggestedRoles.length > 0) {
        // Filter suggestions to include only known roles for safety or allow new ones
        const validSuggestions = result.suggestedRoles; // For now, allow any string from AI
        setSuggestedRoles(validSuggestions);
        toast({
          title: "Roles Suggested",
          description: `AI has suggested roles for "${values.jobTitle}".`,
        });
      } else {
        setSuggestedRoles([]);
        toast({
          title: "No Suggestions",
          description: `AI could not find suitable role suggestions for "${values.jobTitle}".`,
        });
      }
    } catch (error) {
      console.error("Error suggesting roles:", error);
      toast({
        variant: "destructive",
        title: "Suggestion Failed",
        description: "An error occurred while trying to get role suggestions.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Breadcrumbs
        segments={[
          { label: "Role Management", href: "/roles" },
          { label: "AI Role Suggestion" },
        ]}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <BrainCircuit className="mr-3 h-7 w-7 text-primary" />
            AI Role Suggestion
          </CardTitle>
          <CardDescription>
            Enter a job title, and our AI will suggest potential user roles.
            These suggestions can help you define new roles or assign existing ones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Marketing Manager, Lead Developer" {...field} />
                    </FormControl>
                    <FormDescription>
                      Be specific for better suggestions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Suggest Roles
              </Button>
            </form>
          </Form>

          {suggestedRoles.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-3">Suggested Roles for "{form.getValues("jobTitle")}"</h3>
              <div className="flex flex-wrap gap-2">
                {suggestedRoles.map((role, index) => (
                  <Badge key={index} variant={ALL_ROLES.includes(role) ? "default" : "secondary"} className="text-sm px-3 py-1">
                    {role.replace("ROLE_","").replace("_"," ")}
                    {!ALL_ROLES.includes(role) && <span className="ml-1.5 text-xs opacity-70">(New)</span>}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Review these suggestions. Existing roles are highlighted. New suggestions can be added via Role Management.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

