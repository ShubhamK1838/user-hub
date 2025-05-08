
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createUser, updateUser } from "@/lib/users"; // These will use API client
import type { User } from "@/lib/types";
import { ALL_ROLES } from "@/lib/types";
import { suggestUserRolesApi } from "@/lib/api-client"; // Use API client for AI suggestions
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const userFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters.").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters.").max(50),
  email: z.string().email("Invalid email address."),
  password: z.string().optional(),
  jobTitle: z.string().optional(),
  roles: z.array(z.string()).min(1, "At least one role must be selected."),
  accountNonExpired: z.boolean().default(true),
  accountNonLocked: z.boolean().default(true),
  credentialsNonExpired: z.boolean().default(true),
  enabled: z.boolean().default(true),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  existingUser?: User;
}

export function UserForm({ existingUser }: UserFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggestingRoles, setIsSuggestingRoles] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: existingUser
      ? {
          ...existingUser,
          roles: existingUser.roles.split(',').map(r => r.trim()).filter(Boolean),
          password: '', 
        }
      : {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          jobTitle: "",
          roles: ["ROLE_USER"],
          accountNonExpired: true,
          accountNonLocked: true,
          credentialsNonExpired: true,
          enabled: true,
        },
  });

  const handleSuggestRoles = async () => {
    const jobTitle = form.getValues("jobTitle");
    if (!jobTitle) {
      toast({
        variant: "destructive",
        title: "Job Title Required",
        description: "Please enter a job title to suggest roles.",
      });
      return;
    }
    setIsSuggestingRoles(true);
    try {
      const result = await suggestUserRolesApi({ jobTitle });
      if (result.suggestedRoles && result.suggestedRoles.length > 0) {
        // const validSuggestedRoles = result.suggestedRoles.filter(role => ALL_ROLES.includes(role)); // Option: filter only known roles
        const validSuggestedRoles = result.suggestedRoles; // Allow any string from AI for now
        const currentRoles = form.getValues("roles");
        const newRoles = Array.from(new Set([...currentRoles, ...validSuggestedRoles]));
        form.setValue("roles", newRoles, { shouldValidate: true });
        toast({
          title: "Roles Suggested",
          description: `AI suggested: ${validSuggestedRoles.join(', ')}. Added to current selection.`,
        });
      } else {
        toast({
          title: "No Roles Suggested",
          description: "AI could not suggest roles for this job title.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Suggestion Failed",
        description: error.message || "Could not get role suggestions from AI.",
      });
    } finally {
      setIsSuggestingRoles(false);
    }
  };


  async function onSubmit(values: UserFormValues) {
    setIsSubmitting(true);
    const userDataForApi = {
      ...values,
      roles: values.roles.join(','), 
    };

    try {
      if (existingUser) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...updateData } = userDataForApi; 
        const dataToSend = values.password && values.password.length > 0 ? userDataForApi : updateData;
        
        const updatedUser = await updateUser(existingUser.id, dataToSend);
        if (updatedUser) {
          toast({ title: "Success", description: "User updated successfully." });
          router.push(`/users/${updatedUser.id}`);
          router.refresh();
        } else {
          toast({ variant: "destructive", title: "Error", description: "Failed to update user. The user might not exist or an API error occurred." });
        }
      } else {
        if (!userDataForApi.password || userDataForApi.password.length < 8) {
            form.setError("password", { type: "manual", message: "Password is required and must be at least 8 characters for new users." });
            setIsSubmitting(false);
            return;
        }
        const newUser = await createUser(userDataForApi);
        toast({ title: "Success", description: "User created successfully." });
        router.push(`/users/${newUser.id}`);
        router.refresh();
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "An unexpected error occurred." });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder={existingUser ? "Leave blank to keep current password" : "Enter password"} {...field} />
              </FormControl>
              <FormDescription>
                {existingUser ? "Leave blank if you don't want to change the password. Must be at least 8 characters if changing." : "Must be at least 8 characters."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Software Engineer" {...field} />
              </FormControl>
              <FormDescription>Used for AI role suggestions.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="roles"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Roles</FormLabel>
                <FormDescription>
                  Select one or more roles for the user.
                </FormDescription>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleSuggestRoles} 
                disabled={isSuggestingRoles || !form.watch("jobTitle")}
                className="mb-2"
              >
                {isSuggestingRoles ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Suggest Roles (AI)
              </Button>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {ALL_ROLES.map((role) => (
                  <FormField
                    key={role}
                    control={form.control}
                    name="roles"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={role}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(role)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), role])
                                  : field.onChange(
                                      (field.value || []).filter(
                                        (value) => value !== role
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {role.replace("ROLE_", "").replace("_", " ")}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator />
        <h3 className="text-lg font-medium">Account Status Settings (Admin Only)</h3>
        <div className="space-y-4">
            <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <FormLabel className="text-base">Enabled</FormLabel>
                    <FormDescription>
                    Allow this user to log in and use the application.
                    </FormDescription>
                </div>
                <FormControl>
                    <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                </FormItem>
            )}
            />
           <FormField
            control={form.control}
            name="accountNonLocked"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <FormLabel className="text-base">Account Unlocked</FormLabel>
                    <FormDescription>
                    If toggled off, the account is locked.
                    </FormDescription>
                </div>
                <FormControl>
                    <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="accountNonExpired"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <FormLabel className="text-base">Account Not Expired</FormLabel>
                    <FormDescription>
                    If toggled off, the account has expired.
                    </FormDescription>
                </div>
                <FormControl>
                    <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="credentialsNonExpired"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <FormLabel className="text-base">Credentials Not Expired</FormLabel>
                    <FormDescription>
                    If toggled off, the user's credentials (e.g. password) have expired.
                    </FormDescription>
                </div>
                <FormControl>
                    <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                </FormItem>
            )}
            />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {existingUser ? "Update User" : "Create User"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
