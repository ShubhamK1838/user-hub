
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Contact, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { submitContactSupportApi } from '@/lib/api-client';


const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters.").max(100),
  inquiryType: z.string().min(1, "Please select an inquiry type."),
  message: z.string().min(20, "Message must be at least 20 characters.").max(2000),
  attachment: z.custom<FileList>((val) => val instanceof FileList, "Attachment is required").optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;


export default function ContactSupportPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
  useEffect(() => { 
    document.title = "Contact Support | User Hub";
  }, []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      inquiryType: "",
      message: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ variant: "destructive", title: "File Too Large", description: "Attachment cannot exceed 5MB." });
        event.target.value = ""; 
        setFileName(null);
        form.setValue("attachment", undefined);
        return;
      }
      setFileName(file.name);
      form.setValue("attachment", files);
    } else {
      setFileName(null);
      form.setValue("attachment", undefined);
    }
  };

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("subject", values.subject);
    formData.append("inquiryType", values.inquiryType);
    formData.append("message", values.message);
    if (values.attachment && values.attachment[0]) {
      formData.append("attachment", values.attachment[0]);
    }

    try {
      const response = await submitContactSupportApi(formData);
      toast({
        title: "Support Request Sent!",
        description: response.message || "Thank you for contacting us. Our support team will get back to you soon.",
      });
      form.reset();
      setFileName(null); 
      const fileInput = document.getElementById('attachment-input') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "Could not submit your support request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Breadcrumbs
        segments={[
          { label: 'Help & Support', href: '#' },
          { label: 'Contact Support' },
        ]}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Contact className="mr-3 h-7 w-7 text-primary" />
            Contact Support
          </CardTitle>
          <CardDescription>
            Need help or have a question? Fill out the form below, and we'll get back to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                        <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Email</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <FormField
                control={form.control}
                name="inquiryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inquiry Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason for contact..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technical_issue">Technical Issue</SelectItem>
                        <SelectItem value="billing_question">Billing Question</SelectItem>
                        <SelectItem value="feature_request">Feature Request</SelectItem>
                        <SelectItem value="general_inquiry">General Inquiry</SelectItem>
                        <SelectItem value="account_access">Account Access Problem</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Input placeholder="Brief summary of your inquiry" {...field} />
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
                    <FormLabel>Detailed Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe your issue or question in detail..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attachment"
                render={() => ( 
                  <FormItem>
                    <FormLabel>Attachment (Optional)</FormLabel>
                    <FormControl>
                       <Input id="attachment-input" type="file" onChange={handleFileChange} className="file:text-primary file:font-semibold hover:file:bg-primary/10" />
                    </FormControl>
                    {fileName && <FormDescription>Selected file: {fileName}</FormDescription>}
                     <FormDescription>Max file size: 5MB. Allowed types: PNG, JPG, PDF, TXT.</FormDescription>
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
                Send Message
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
