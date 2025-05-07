
"use client";

import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { AppLogoText } from '@/components/icons/logo';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';

// export const metadata: Metadata = { title: 'Login' };
// This won't work correctly with "use client" for the whole page for title.
// Title should be set in a parent layout or via client-side document.title manipulation if dynamic.


const loginFormSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().default(false).optional(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { // For dynamic title with "use client"
    document.title = "Login | User Hub";
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    // Simulate API call
    console.log("Login attempt:", values);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Dummy login logic - replace with actual authentication
    if (values.email === "admin@example.com" && values.password === "password") {
      toast({
        title: "Login Successful!",
        description: "Welcome back!",
      });
      router.push('/dashboard'); // Redirect to dashboard on successful login
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-app-content-background p-4">
      <div className="mb-8">
        <AppLogoText />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
          <CardDescription>Sign in to your User Hub account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
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
                    <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link href="/forgot-password" // Placeholder link
                            className="text-sm font-medium text-primary hover:underline"
                            tabIndex={-1} // Make it focusable after password field if desired
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Remember me
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <KeyRound className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                Sign In
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Sign up (Coming Soon)
            </Link>
          </div>
        </CardContent>
      </Card>
       <p className="mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} User Hub. All rights reserved. <br/>
        <Link href="/terms-privacy" className="hover:underline">Terms of Service</Link> &bull; <Link href="/terms-privacy#privacy" className="hover:underline">Privacy Policy</Link>
      </p>
    </div>
  );
}
