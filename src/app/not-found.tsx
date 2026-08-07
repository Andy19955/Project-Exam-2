import Link from "next/link";

export default function notFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-10">
      <h1 className="text-3xl font-bold text-center">404 - Page Not Found</h1>
      <p className="text-center">Could not find the page you were looking for.</p>
      <div className="text-center">
        <Link href="/" className="text-(--primary) hover:underline">
          Go back to the homepage
        </Link>
      </div>
    </div>
  );
}
