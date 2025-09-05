import { Metadata } from "next";
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-black">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}