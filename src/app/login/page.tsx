import LoginForm from "@/app/login/LoginForm";

type LoginPageProps = {
  searchParams?: Promise<{
    registered?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const showRegistrationSuccess = resolvedSearchParams?.registered === "1";

  return (
    <div className="flex flex-col items-center justify-center px-6 mt-20">
      <div className="flex flex-col gap-8 bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-center font-bold text-xl">Login to your account</h1>
        {showRegistrationSuccess ? <div className="rounded-md bg-(--background-success) p-3 text-sm text-(--success)">Registration successful. You can log in now.</div> : null}
        <LoginForm />
      </div>
    </div>
  );
}
