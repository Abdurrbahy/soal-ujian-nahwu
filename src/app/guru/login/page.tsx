"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("guru@miyar.sch.id");
  const [pin, setPin] = useState("nahwu2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/teacher/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pin }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Autentikasi gagal.");
      }

      toast.success("Berhasil masuk ke Portal Guru Mi‘yar!");
      router.push("/guru/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "PIN atau email tidak valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Portal Guru Mi‘yar
        </h1>
        <p className="text-xs text-muted-foreground">
          Akses terbatas untuk pendidik dan tim penguji nahwu terdaftar.
        </p>
      </div>

      <Card className="border-border shadow-md">
        <form onSubmit={handleLogin}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-semibold">Autentikasi Guru</CardTitle>
            <CardDescription className="text-xs">
              Masukkan email pengajar terdaftar dan PIN keamanan ujian.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="py-2.5 text-xs">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium">
                Email Pengajar Terdaftar
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9 text-sm"
                  placeholder="nama@miyar.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin" className="text-xs font-medium">
                PIN Akses / Kata Sandi Guru
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  id="pin"
                  type="password"
                  className="pl-9 text-sm font-mono"
                  placeholder="••••••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Demo / Allowlist Notice */}
            <div className="p-3 rounded-lg bg-muted/40 border border-border/80 text-xs text-muted-foreground space-y-1">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-800" />
                Kredensial Default Guru (Demo / Pengujian):
              </div>
              <p>Email: <span className="font-mono text-foreground">guru@miyar.sch.id</span></p>
              <p>PIN Akses: <span className="font-mono text-foreground">nahwu2026</span></p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold"
            >
              {loading ? "Memverifikasi..." : "Masuk ke Dashboard Guru"}
            </Button>

            <Link href="/" className="text-xs text-center text-muted-foreground hover:underline flex items-center justify-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Kembali ke Halaman Utama
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
