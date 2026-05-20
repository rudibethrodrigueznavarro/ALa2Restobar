"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Credenciales incorrectas");
        setLoading(false);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al intentar iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-md relative overflow-hidden">
      {/* Decorative Atmospheric Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary-container/15 rounded-full blur-[100px]"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[28rem] bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-lg animate-pop-in">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-h1 text-[36px] text-on-surface uppercase tracking-tight">
            A LA <span className="text-primary text-glow">2</span>
          </h1>
          <h3 className="font-h3 text-h3 text-on-surface-variant uppercase tracking-widest text-[14px] mt-xs">
            PANEL DE CONTROL
          </h3>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-error/15 border border-error/30 text-error rounded-lg p-sm text-center font-body-md text-[14px] flex items-center justify-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          {/* Username */}
          <div className="flex flex-col gap-xs transition-all">
            <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
              Usuario
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant/50 select-none text-[20px]">
                person
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nombre de usuario"
                className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm pl-10 text-on-surface font-body-md placeholder:text-on-surface-variant/40 outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(255,83,91,0.25)] transition-all"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-xs transition-all">
            <label className="font-label-caps text-label-caps text-on-surface-variant px-1">
              Contraseña
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant/50 select-none text-[20px]">
                lock
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface/50 border border-white/10 rounded-lg p-sm pl-10 text-on-surface font-body-md placeholder:text-on-surface-variant/40 outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(255,83,91,0.25)] transition-all"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-sm bg-primary-container text-white font-h3 text-body-md py-md rounded-xl shadow-[0_0_15px_rgba(255,83,91,0.2)] hover:shadow-[0_0_25px_rgba(255,83,91,0.4)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <>
                <span>Ingresar</span>
                <span className="material-symbols-outlined">login</span>
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
