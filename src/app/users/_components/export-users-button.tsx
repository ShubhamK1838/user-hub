
"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ExportUsersButtonProps {
  users: User[];
}

export function ExportUsersButton({ users }: ExportUsersButtonProps) {
  const { toast } = useToast();

  const exportToCSV = () => {
    if (!users || users.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: "There is no user data to export.",
      });
      return;
    }

    const headers = [
      "ID", "First Name", "Last Name", "Email", "Roles", "Job Title",
      "Created Date", "Updated Date", "Last Login",
      "Account Non Expired", "Account Non Locked", "Credentials Non Expired", "Enabled"
    ];

    const csvRows = [
      headers.join(','),
      ...users.map(user => [
        user.id,
        `"${user.firstName}"`,
        `"${user.lastName}"`,
        user.email,
        `"${user.roles}"`,
        `"${user.jobTitle || ''}"`,
        user.createdDate,
        user.updatedDate,
        user.lastLoginDate || '',
        user.accountNonExpired,
        user.accountNonLocked,
        user.credentialsNonExpired,
        user.enabled
      ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "users_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "Export Successful",
        description: "User data has been exported to CSV.",
      });
    } else {
       toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Your browser does not support this feature.",
      });
    }
  };

  return (
    <Button variant="outline" onClick={exportToCSV}>
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  );
}
