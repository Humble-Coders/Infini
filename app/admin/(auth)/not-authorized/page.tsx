import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotAuthorizedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <h1 className="text-xl font-semibold text-foreground">Not authorized</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Your account doesn&apos;t have access to this section of the admin panel. If you think this
        is wrong, ask a Super Admin to check your role.
      </p>
      <Button asChild>
        <Link href="/admin">Back to admin home</Link>
      </Button>
    </main>
  );
}
