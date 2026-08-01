import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm rounded-2xl border border-melony-gold/15 bg-melony-black-soft p-8">
        <p className="font-display mb-6 text-center text-xl text-melony-cream">
          House of Melony — Admin
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
