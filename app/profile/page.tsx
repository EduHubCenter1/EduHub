import { getProfile } from "@/lib/actions/user.actions";
import { EditProfileForm } from "@/components/edit-profile-form";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <div className="bg-card shadow-md rounded-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-center text-primary mb-6">Edit Your Profile</h1>
          <EditProfileForm profile={profile} />
        </div>
      </div>
    </div>
  );
}