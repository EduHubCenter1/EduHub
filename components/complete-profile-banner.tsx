import { getProfile } from "@/lib/actions/user.actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Link from "next/link";

export async function CompleteProfileBanner() {
  const profile = await getProfile();

  // If the user is not logged in, or if their profile is complete, don't show the banner.
  // We'll consider the profile incomplete if they don't have a username.
  if (!profile || profile.username) {
    return null;
  }

  return (
    <div className="container my-4">
        <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Welcome to EduHub!</AlertTitle>
            <AlertDescription>
                Your profile is incomplete. Please <Link href="/profile" className="font-bold underline">complete your profile</Link> to get the most out of the platform.
            </AlertDescription>
        </Alert>
    </div>
  );
}
