
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LifeBuoy, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export const metadata: Metadata = {
  title: 'Help Documentation',
};

const faqItems = [
  {
    value: "item-1",
    question: "How do I create a new user?",
    answer: "Navigate to the 'User Management' section from the sidebar, then click the 'Create User' button. Fill in the required details in the form and submit."
  },
  {
    value: "item-2",
    question: "How can I edit an existing user's information?",
    answer: "In the 'User Management' list, find the user you wish to edit. Click the three-dot menu icon on their row and select 'Edit User'. Modify the details and save."
  },
  {
    value: "item-3",
    question: "What do the different user statuses mean?",
    answer: "'Active' means the user can log in and use the application. 'Disabled' means their access is temporarily revoked. Account status can also be affected by 'Locked' or 'Expired' states."
  },
  {
    value: "item-4",
    question: "How do I reset my password?",
    answer: "Go to your 'My Profile' page, then navigate to the 'Security' tab. You will find an option to change your password there. If you've forgotten your password, use the 'Forgot Password' link on the login page (feature coming soon)."
  },
  {
    value: "item-5",
    question: "What is Role Management?",
    answer: "Role Management allows administrators to define different user roles (e.g., Admin, Editor, User) and assign specific permissions to these roles. This controls what users can see and do within the application."
  }
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
       <Breadcrumbs
        segments={[
          { label: 'Help & Support', href: '#' },
          { label: 'Help Documentation' },
        ]}
      />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
         <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
                <LifeBuoy className="mr-3 h-8 w-8 text-primary" />
                Help Documentation
            </h1>
            <p className="text-muted-foreground">
                Find answers to common questions and learn how to use User Hub.
            </p>
        </div>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Search Documentation (Coming Soon)</CardTitle>
           <div className="flex w-full max-w-md items-center space-x-2 pt-2">
            <Input type="search" placeholder="Search help articles..." className="flex-grow" disabled />
            <Button type="submit" disabled><Search className="mr-2 h-4 w-4" />Search</Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Quick answers to common queries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map(item => (
              <AccordionItem value={item.value} key={item.value}>
                <AccordionTrigger className="text-base text-left hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
            <CardTitle>Additional Support</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
            Can't find what you're looking for? 
            Visit our <a href="/contact-support" className="text-primary hover:underline">Contact Support</a> page to get in touch with our team.
            You can also provide feedback via the <a href="/feedback" className="text-primary hover:underline">Feedback Form</a>.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
