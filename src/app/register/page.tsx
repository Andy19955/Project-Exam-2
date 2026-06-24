import RegisterForm from "@/app/register/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center px-6 mt-20">
      <div className="flex flex-col gap-8 bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-center font-bold text-xl">Register for an account</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
