
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms & Privacy',
};

export default function TermsPrivacyPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        segments={[
          { label: 'Help & Support', href: '#' },
          { label: 'Terms & Privacy' },
        ]}
      />
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <FileText className="mr-3 h-8 w-8 text-primary" />
            Terms of Service & Privacy Policy
        </h1>
        <p className="text-muted-foreground">
            Please review our terms and policies carefully.
        </p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center"><FileText className="mr-2 h-6 w-6"/>Terms of Service</CardTitle>
          <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-72 w-full rounded-md border p-4">
            <h3 className="font-semibold text-lg mb-2">1. Acceptance of Terms</h3>
            <p className="text-sm text-muted-foreground mb-4">
              By accessing and using User Hub (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. 
              In addition, when using this Service's particular services, you shall be subject to any posted guidelines or rules applicable to such services. 
              Any participation in this Service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this Service.
            </p>
            <h3 className="font-semibold text-lg mb-2">2. Description of Service</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our Service provides user management capabilities. This description is subject to change and modification by us without notice.
            </p>
            <h3 className="font-semibold text-lg mb-2">3. User Conduct</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You are responsible for all activity that occurs under your account. You agree not to use the service for any illegal or unauthorized purpose.
            </p>
            <h3 className="font-semibold text-lg mb-2">4. Termination</h3>
             <p className="text-sm text-muted-foreground mb-4">
              We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach the Terms.
            </p>
             <p className="text-sm text-muted-foreground">
              [...More placeholder content for Terms of Service...]
            </p>
          </ScrollArea>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-6 w-6"/>Privacy Policy</CardTitle>
          <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-72 w-full rounded-md border p-4">
            <h3 className="font-semibold text-lg mb-2">1. Information We Collect</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We collect information you provide directly to us, such as when you create an account (e.g., name, email address, password). 
              We also collect information automatically when you use the Service (e.g., IP address, browser type, log data).
            </p>
            <h3 className="font-semibold text-lg mb-2">2. How We Use Information</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We use the information we collect to provide, maintain, and improve our Service, to develop new services, and to protect User Hub and our users. 
              We also use information to offer you tailored content.
            </p>
            <h3 className="font-semibold text-lg mb-2">3. Information Sharing</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We do not share personal information with companies, organizations, or individuals outside of User Hub except in the following cases: with your consent, for external processing by trusted affiliates, or for legal reasons.
            </p>
            <h3 className="font-semibold text-lg mb-2">4. Data Security</h3>
             <p className="text-sm text-muted-foreground mb-4">
              We work hard to protect User Hub and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.
            </p>
             <p className="text-sm text-muted-foreground">
              [...More placeholder content for Privacy Policy...]
            </p>
          </ScrollArea>
        </CardContent>
      </Card>
       <p className="text-center text-sm text-muted-foreground pt-4">
        The content provided here is for placeholder purposes only. Consult with a legal professional for actual Terms of Service and Privacy Policy documents.
      </p>
    </div>
  );
}
