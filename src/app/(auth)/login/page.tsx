import Link from "next/link";
import { LoginForm } from "@/features/access/LoginForm";
import { LoginShowcase } from "@/features/access/LoginShowcase";
import { routes } from "@/shared/lib/routes";

export const metadata = { title: "Ingresar" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-wrap bg-ivory text-navy-900">
      <LoginShowcase />
      <main className="flex flex-[1_1_480px] items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          <h2 className="font-display text-[30px] leading-[normal] font-bold tracking-[-0.02em]">Ingresar</h2>
          <p className="mt-2.5 text-[15px] text-subtle">Usa el correo y la contraseña de tu cuenta.</p>
          <LoginForm />
          <div className="mt-8 border-t border-line-warm pt-6 text-[15px] text-subtle">
            ¿Tu empresa aún no tiene cuenta?{" "}
            <Link href={routes.register} className="font-semibold">
              Registrar mi empresa
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
