"use client";

import { SignInForm } from "@/features/auth/components/SigninForm";
import { Building2 } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Building2 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              AL GHANI POULTRY
            </h1>
          </div>
          <p className="text-muted-foreground">
            Broiler Sales Management System
          </p>
        </div>

        {/* Sign In Form */}
        <SignInForm />

        <div className="flex flex-col gap-4">
          {/* Toggle to Sign Up */}
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?
            </p>

            <Link
              href="/sign-up"
              className="relative bottom-[2px] text-primary hover:text-primary/80 underline"
            >
              Create account
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground">
            <p>© 2024 AL GHANI POULTRY SERVICES. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
