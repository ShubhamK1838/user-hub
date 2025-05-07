
"use client"; // This page needs client components for form handling

import type { Metadata } from 'next'; // Metadata can still be defined
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

// Define metadata for server rendering if needed, though the page content is client-side.
// export const metadata: Metadata = { title: 'Submit Feedback' }; 
// This won't work correctly with "use client" for the whole page for title.
// Title should be set in a parent layout or via client-side document.title manipulation if dynamic.

const feedbackFormSchema = z.object({
  feedbackType: z.string().min(1, "Please select a feedback type."),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  subject: z.string().min(5, "Subject must be at least 5 characters.").max(100),
  message: z.string().min(10, "Message must be at least 10 characters.").max(1000),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;


export default function FeedbackPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      feedbackType: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: FeedbackFormValues) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Feedback submitted:", values);
    toast({
      title: "Feedback Submitted!",
      description: "Thank you for your valuable feedback. We'll review it shortly.",
    });
    form.reset();
    setIsSubmitting(false);
  }
  
  // For dynamic title with "use client"
  if (typeof document !== 'undefined') {
    document.title = "Submit Feedback | User Hub";
  }


  return (
    <div className="space-y-6 max-w-2xl mx-auto">
       <Breadcrumbs
        segments={[
          { label: 'Help & Support', href: '#' },
          { label: 'Feedback' },
        ]}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <MessageSquare className="mr-3 h-7 w-7 text-primary" />
            Submit Feedback
          </CardTitle>
          <CardDescription>
            We value your input! Please share your thoughts, suggestions, or report any issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="feedbackType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="suggestion">Suggestion / Feature Request</SelectItem>
                        <SelectItem value="bug_report">Bug Report</SelectItem>
                        <SelectItem value="compliment">Compliment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Email (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide your email if you'd like a response.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief summary of your feedback" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide details here..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>
                      Please be as specific as possible.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Send className="mr-2 h-4 w-4" />
                )}
                Submit Feedback
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
