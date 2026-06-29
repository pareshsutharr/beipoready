import NotFound1 from "@/components/ui/8bit-not-found1";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-background">
      <NotFound1
        className="min-h-screen"
        cta="Return to Home"
        description="The page you are looking for is not available. Head back to the Be IPO Ready homepage."
        href="/"
        imageSrc="https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=256&q=80"
        title="Page not found"
      />
    </main>
  );
}
