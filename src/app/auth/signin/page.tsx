/* eslint-disable react/no-unescaped-entities */
"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { toast } from "sonner";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box}
html,body{height:100%;overflow:auto;margin:0;padding:0;background:#fff}
.root{
  height:100vh;width:100%;display:grid;grid-template-columns:minmax(450px, 1fr) 1.2fr;
  font-family:'Inter',sans-serif;
}

/* ── LEFT: FORM ── */
.left{
  background:#fff;padding:0 12%;
  display:flex;flex-direction:column;justify-content:center;
}
.left h1{font-size:32px;font-weight:600;color:#111;margin-bottom:8px;letter-spacing:-0.5px}
.left .sub{font-size:15px;color:#666;margin-bottom:32px}

.social-row{display:flex;gap:12px;margin-bottom:20px}
.social-btn{
  flex:1;display:flex;align-items:center;justify-content:center;gap:10px;
  padding:12px;border:1px solid #e5e7eb;border-radius:10px;
  background:#fff;font-family:inherit;font-size:14px;font-weight:500;color:#374151;
  cursor:pointer;transition:all .2s ease;
}
.social-btn:hover{background:#f9fafb;border-color:#d1d5db}

.or-row{display:flex;align-items:center;gap:12px;margin:24px 0;font-size:12px;font-weight:500;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px}
.or-line{flex:1;height:1px;background:#f3f4f6}

.field{margin-bottom:20px}
.field label{display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:8px}
.field-wrap{position:relative}
.field input{
  width:100%;padding:12px 14px;
  border:1px solid #e5e7eb;border-radius:10px;
  font-family:inherit;font-size:14px;color:#111;
  outline:none;transition:all .2s ease;background:#fff;
}
.field input:focus{border-color:#d9534f;box-shadow:0 0 0 4px rgba(217,83,79,.1)}
.field input::placeholder{color:#9ca3af}

.eye-btn{
  position:absolute;right:12px;top:50%;transform:translateY(-50%);
  background:none;border:none;cursor:pointer;color:#9ca3af;display:flex;align-items:center;padding:4px;
}
.eye-btn:hover{color:#4b5563}

.forgot{display:inline-block;font-size:13px;color:#d9534f;text-decoration:none;font-weight:500;margin-top:4px}
.forgot:hover{text-decoration:underline}

.btn-login{
  width:100%;padding:14px;background:#111827;border:none;border-radius:10px;
  color:#fff;font-size:15px;font-weight:500;
  cursor:pointer;transition:all .2s;margin-top:10px;margin-bottom:20px;
}
.btn-login:hover:not(:disabled){background:#374151;transform:translateY(-1px)}
.btn-login:disabled{opacity:.5;cursor:not-allowed}

.register{font-size:14px;color:#6b7280;text-align:center}
.register a{color:#d9534f;text-decoration:none;font-weight:600}

.err{background:#fef2f2;border:1px solid #fee2e2;border-radius:10px;padding:12px 16px;font-size:13px;color:#b91c1c;margin-bottom:20px}

/* ── RIGHT: SHOWCASE ── */
.right{
  background:#f9fafb;padding:40px;
  display:flex;flex-direction:column;justify-content:center;
  position:relative;overflow:hidden;
}
.right::before{
  content:'';position:absolute;top:0;left:0;right:0;bottom:0;
  background:radial-gradient(circle at 70% 30%, rgba(217,83,79,0.05) 0%, transparent 70%);
}

.cards-container{display:flex;flex-direction:column;gap:20px;z-index:1;width:100%;max-width:480px;margin:0 auto}
.card{
  background:#fff;border-radius:16px;padding:16px;
  box-shadow:0 4px 20px rgba(0,0,0,0.04);border:1px solid #f3f4f6;
  display:flex;gap:16px;align-items:center;transition:transform .3s ease;
}
.card:hover{transform:translateX(10px)}
.card-img-sq{width:100px;height:100px;border-radius:12px;overflow:hidden;flex-shrink:0}
.card-img-sq img{width:100%;height:100%;object-fit:cover}
.card-content{flex:1}
.card-tag{
  display:inline-block;padding:4px 8px;background:#fef2f2;color:#b91c1c;
  font-size:10px;font-weight:700;text-transform:uppercase;border-radius:6px;margin-bottom:8px;
}
.card-title-ui{font-size:14px;font-weight:600;color:#111;margin-bottom:4px}
.card-sub{font-size:12px;color:#6b7280;line-height:1.4}

@media(max-width:900px){.root{grid-template-columns:1fr}.right{display:none}}
`;

function SignInInner() {
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") ?? "/";
  const error = sp.get("error");
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("credentials");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(null);
    if (res?.error) toast.error("Invalid email or password");
    else if (res?.url) window.location.href = res.url;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="root">
        <div className="left">
          <div style={{ maxWidth: "400px", width: "100%", margin: "0 auto" }}>
            <h1>Welcome back</h1>
            <p className="sub">Enter your details to access your account.</p>

            <div className="social-row">
              <button
                className="social-btn"
                onClick={() => {
                  setLoading("google");
                  signIn("google", { callbackUrl });
                }}
                disabled={loading !== null}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.5 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.22-4.75 3.22-8.07z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.17v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.85 14.12c-.22-.66-.34-1.36-.34-2.12s.12-1.46.34-2.12V7.04H2.17C1.42 8.54 1 10.23 1 12s.42 3.46 1.17 4.96l3.68-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.17 7.04l3.68 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                  />
                </svg>
                Google
              </button>
            </div>

            <div className="or-row">
              <div className="or-line" />
              <span>or email</span>
              <div className="or-line" />
            </div>

            {error && (
              <div className="err">
                {error === "OAuthAccountNotLinked"
                  ? "This email is linked to another provider."
                  : "Sign-in failed. Please try again."}
              </div>
            )}

            <form onSubmit={submit}>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <label htmlFor="password">Password</label>
                  <Link href="/auth/forgot-password" className="forgot">
                    Forgot password?
                  </Link>
                </div>
                <div className="field-wrap">
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label="Toggle password"
                  >
                    {showPw ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading !== null}
                className="btn-login"
              >
                {loading === "credentials" ? "Signing in..." : "Login"}
              </button>
            </form>

            <p className="register">
              Don't have an account?{" "}
              <Link
                href={`/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              >
                Create one for free
              </Link>
            </p>
          </div>
        </div>

        <div className="right">
          <div className="cards-container">
            <div className="card">
              <div className="card-img-sq">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80"
                  alt="Style"
                />
              </div>
              <div className="card-content">
                <span className="card-tag">New Season</span>
                <div className="card-title-ui">Street-Style Range</div>
                <div className="card-sub">
                  The design is so nice I LOVE it. Beautifully customized.
                </div>
              </div>
            </div>

            <div className="card" style={{ marginLeft: "40px" }}>
              <div className="card-img-sq">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&q=80"
                  alt="Premium"
                />
              </div>
              <div className="card-content">
                <span
                  className="card-tag"
                  style={{ background: "#eff6ff", color: "#1d4ed8" }}
                >
                  Exclusive
                </span>
                <div className="card-title-ui">Premium Collection</div>
                <div className="card-sub">
                  Curated pieces with free express shipping over $80.
                </div>
              </div>
            </div>

            <div className="card">
              <div
                className="card-img-sq"
                style={{
                  background: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <div className="card-content">
                <div className="card-title-ui">Personalized Experience</div>
                <div className="card-sub">
                  800+ unlimited options when you sign in.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter",
            color: "#666",
          }}
        >
          Loading...
        </div>
      }
    >
      <SignInInner />
    </Suspense>
  );
}
