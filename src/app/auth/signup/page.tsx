/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box}
html,body{height:100%;overflow:auto;margin:0;padding:0;background:#fff}
.root{height:100vh;width:100%;display:grid;grid-template-columns:minmax(450px, 1fr) 1.2fr;font-family:'Inter',sans-serif;}
.left{background:#fff;padding:0 12%;display:flex;flex-direction:column;justify-content:center;}
.left h1{font-size:32px;font-weight:600;color:#111;margin-bottom:8px;letter-spacing:-0.5px}
.left .sub{font-size:15px;color:#666;margin-bottom:32px}

.field{margin-bottom:20px}
.field label{display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:8px}
.field-wrap{position:relative}
.field input{width:100%;padding:12px 14px;border:1px solid #e5e7eb;border-radius:10px;font-family:inherit;font-size:14px;color:#111;outline:none;transition:all .2s ease;background:#fff;}
.field input:focus{border-color:#d9534f;box-shadow:0 0 0 4px rgba(217,83,79,.1)}
.field input::placeholder{color:#9ca3af}

.eye-btn{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#9ca3af;display:flex;align-items:center;padding:4px}
.eye-btn:hover{color:#4b5563}

.str-container{margin-top:10px}
.str-bar{height:4px;background:#f3f4f6;border-radius:10px;overflow:hidden;}
.str-fill{height:100%;transition:width .4s cubic-bezier(0.4, 0, 0.2, 1), background .3s}
.str-label{font-size:12px;font-weight:500;margin-top:6px;display:block}

.btn-login{width:100%;padding:14px;background:#111827;border:none;border-radius:10px;color:#fff;font-size:15px;font-weight:500;cursor:pointer;transition:all .2s;margin-top:10px;margin-bottom:20px;}
.btn-login:hover:not(:disabled){background:#374151;transform:translateY(-1px)}
.btn-login:active{transform:translateY(0)}
.btn-login:disabled{opacity:.5;cursor:not-allowed}

.register{font-size:14px;color:#6b7280;text-align:center}
.register a{color:#d9534f;text-decoration:none;font-weight:600}
.terms{font-size:12px;color:#9ca3af;text-align:center;margin-top:24px;line-height:1.6;max-width:320px;margin-left:auto;margin-right:auto}

.right{background:#f9fafb;padding:40px;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden}
.right::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(circle at 70% 30%, rgba(217,83,79,0.05) 0%, transparent 70%)}

.cards-container{display:flex;flex-direction:column;gap:20px;z-index:1}
.card{background:#fff;border-radius:16px;padding:16px;box-shadow:0 4px 20px rgba(0,0,0,0.04);border:1px solid #f3f4f6;display:flex;gap:16px;align-items:center;transition:transform .3s ease}
.card:hover{transform:translateX(10px)}
.card-img-sq{width:100px;height:100px;border-radius:12px;overflow:hidden;flex-shrink:0}
.card-img-sq img{width:100%;height:100%;object-fit:cover}
.card-content{flex:1}
.card-tag{display:inline-block;padding:4px 8px;background:#fef2f2;color:#b91c1c;font-size:10px;font-weight:700;text-transform:uppercase;border-radius:6px;margin-bottom:8px}
.card-title-ui{font-size:14px;font-weight:600;color:#111;margin-bottom:4px}
.card-sub{font-size:12px;color:#6b7280;line-height:1.4}

@media(max-width:900px){.root{grid-template-columns:1fr}.right{display:none}}
`;

function pwStrength(pw: string) {
  if (!pw) return { pct: 0, color: "transparent", label: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { pct: 25, color: "#ef4444", label: "Weak" };
  if (s <= 2) return { pct: 50, color: "#f97316", label: "Fair" };
  if (s <= 3) return { pct: 75, color: "#eab308", label: "Good" };
  return { pct: 100, color: "#22c55e", label: "Strong" };
}

function SignUpInner() {
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") ?? "/";
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const str = pwStrength(password);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        toast.error("Account created. Please sign in.");
        window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      } else if (res?.url) {
        toast.success("Welcome!");
        window.location.href = res.url;
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Sign-up failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="root">
        <div className="left">
          <div style={{ maxWidth: "400px", width: "100%", margin: "0 auto" }}>
            <h1>Create account</h1>
            <p className="sub">Join thousands of shoppers worldwide.</p>

            <form onSubmit={submit}>
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  required
                  autoComplete="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
                <label htmlFor="password">Password</label>
                <div className="field-wrap">
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
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
                {password && (
                  <div className="str-container">
                    <div className="str-bar">
                      <div
                        className="str-fill"
                        style={{ width: `${str.pct}%`, background: str.color }}
                      />
                    </div>
                    <span className="str-label" style={{ color: str.color }}>
                      {str.label} security
                    </span>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="btn-login">
                {loading ? "Creating account..." : "Get Started"}
              </button>
            </form>

            <p className="register">
              Already have an account?{" "}
              <Link
                href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              >
                Sign in
              </Link>
            </p>
            <p className="terms">
              By joining, you agree to our <a href="/terms">Terms of Service</a>{" "}
              and <a href="/privacy">Privacy Policy</a>.
            </p>
          </div>
        </div>

        <div className="right">
          <div className="cards-container" style={{ maxWidth: "480px" }}>
            <div className="card">
              <div className="card-img-sq">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80"
                  alt="Style"
                />
              </div>
              <div className="card-content">
                <span className="card-tag">Trending Now</span>
                <div className="card-title-ui">Street-Style Range</div>
                <div className="card-sub">
                  Hand-picked collection for the modern enthusiast.
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
                <div className="card-title-ui">Premium Membership</div>
                <div className="card-sub">
                  Get early access and free express shipping.
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
                <div className="card-title-ui">Personalized for you</div>
                <div className="card-sub">
                  AI-driven recommendations based on your unique taste.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SignUpPage() {
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
      <SignUpInner />
    </Suspense>
  );
}
