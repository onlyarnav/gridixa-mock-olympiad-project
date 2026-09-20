"use client";

import React, { useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import {
  loginUser,
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
  createOrder,
} from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { executeRecaptcha } from "@/lib/recaptcha";

type LoadingAction = "login" | "sendOtp" | "verifyOtp" | "resetPassword" | null;

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // loading state for all async auth actions
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);

  // Forgot password states
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const REGISTRATION_FEE = 199;
  const GST_RATE = 0.18;

  type AppliedCoupon = {
    _id: string;
    code: string;
    type: "percentage" | "amount";
    value: number;
  };

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  const baseAmount = REGISTRATION_FEE;

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;

    const raw =
      appliedCoupon.type === "percentage"
        ? (baseAmount * appliedCoupon.value) / 100
        : appliedCoupon.value;

    return Math.min(raw, baseAmount);
  }, [appliedCoupon, baseAmount]);

  const discountedBase = useMemo(
    () => Math.max(0, baseAmount - discountAmount),
    [baseAmount, discountAmount]
  );

  const gstAmount = useMemo(
    () => discountedBase * GST_RATE,
    [discountedBase]
  );

  const payableAmount = useMemo(
    () => discountedBase + gstAmount,
    [discountedBase, gstAmount]
  );

  const payableAmountPaise = Math.round(payableAmount * 100);
  const gstAmountPaise = Math.round(gstAmount * 100);
  const discountAmountPaise = Math.round(discountAmount * 100);

  const validateCouponCode = async (code: string) => {
    const normalized = code.trim().toUpperCase();

    if (!normalized) {
      setAppliedCoupon(null);
      setCouponError("");
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      const res = await apiRequest("/discount/validate", {
        method: "POST",
        body: JSON.stringify({
          code: normalized,
          email,
          amount: baseAmount * 100,
        }),
      });

      const coupon = res?.coupon || res?.data || res;

      if (!coupon || coupon.valid === false) {
        throw new Error(coupon?.message || "Coupon is not valid");
      }

      setAppliedCoupon({
        _id: coupon._id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      });
    } catch (err: any) {
      setAppliedCoupon(null);
      setCouponError(err?.message || "Invalid coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  // Handle query params for auto logout
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const router = useRouter();
  const { login, user, loading } = useAuth();

  const showError = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loadingAction) return;

    setLoadingAction("login");
    try {
      const token = await executeRecaptcha("login");

      const data = await loginUser({
        email,
        password,
        recaptchaToken: token,
      });

      login(data.token, data.user);

      if (data.user.paymentStatus === "pending") {
        setShowPaymentModal(true);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      showError(err.message || "Access Denied");
    } finally {
      setLoadingAction(null);
    }
  };

  // FORGOT PASSWORD: SEND OTP
  const handleSendOtp = async () => {
    if (loadingAction) return;

    setLoadingAction("sendOtp");
    try {
      const token = await executeRecaptcha("forgot_password_send");
      await sendResetOtp(email, token);
      setStep("otp");
    } catch (err: any) {
      showError(err.message || "Failed to send OTP");
    } finally {
      setLoadingAction(null);
    }
  };

  // FORGOT PASSWORD: VERIFY OTP
  const handleVerifyOtp = async () => {
    if (loadingAction) return;

    setLoadingAction("verifyOtp");
    try {
      const token = await executeRecaptcha("forgot_password_verify");
      await verifyResetOtp(email, otp.trim(), token);
      setStep("reset");
    } catch (err: any) {
      showError(err.message || "Invalid OTP");
    } finally {
      setLoadingAction(null);
    }
  };

  // FORGOT PASSWORD: RESET PASSWORD
  const handleResetPassword = async () => {
    if (loadingAction) return;

    setLoadingAction("resetPassword");
    try {
      const token = await executeRecaptcha("forgot_password_reset");

      await resetPassword(email, otp, newPassword, token);

      alert("Password updated!");
      setShowModal(false);
      setStep("email");
      setOtp("");
      setNewPassword("");
    } catch (err: any) {
      showError(err.message || "Reset failed");
    } finally {
      setLoadingAction(null);
    }
  };

  // PAYMENT HANDLER
  const handlePayment = async () => {
    if (isVerifyingPayment) return;

    setLoadingAction("login");
    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay failed");
        setLoadingAction(null);
        return;
      }

      const order = await createOrder({
        email,
        couponCode: appliedCoupon?.code || null,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "AI Olympiad",
        description: "Complete Registration",
        order_id: order.id,
        handler: async function (response: any) {
          setIsVerifyingPayment(true);

          try {
            await apiRequest("/payment/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email,

                couponCode: appliedCoupon?.code || null,
                couponId: appliedCoupon?._id || null,
                discountAmount: discountAmountPaise,
                subtotalAmount: Math.round(discountedBase * 100),
                gstAmount: gstAmountPaise,
                payableAmount: payableAmountPaise,
              }),
            });

            setShowPaymentModal(false);
            router.push("/dashboard");
          } catch (err: any) {
            alert(err?.message || "Payment verification failed");
          } finally {
            setIsVerifyingPayment(false);
            setLoadingAction(null);
          }
        },
        modal: {
          ondismiss: () => {
            setLoadingAction(null);
          },
        },
        prefill: {
          email,
        },
        theme: { color: "#000000" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err?.message || "Payment failed");
      setLoadingAction(null);
    }
  };

    React.useEffect(() => {
    if (loading) return;

    if (user) {
      if (user.paymentStatus === "completed") {
        router.replace("/dashboard");
      } else {
        setShowPaymentModal(true);
      }
    }
  }, [user, loading, router]);

  React.useEffect(() => {
    if (!reason) return;

    if (reason === "unauthorized") {
      setToastMessage("Session Ended. Please login.");
    } else if (reason === "session_expired") {
      setToastMessage("Session expired due to inactivity.");
    }

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 4000);

    window.history.replaceState({}, "", "/login");
  }, [reason]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9e6]">
        <div className="font-black text-black text-xl uppercase">
          Loading...
        </div>
      </div>
    );
  }

  if (user && user.paymentStatus === "completed") {
    return null;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_35%),linear-gradient(135deg,#fffdf5_0%,#f6fbff_100%)] px-4 py-6 sm:px-6 lg:px-8 font-mono text-black">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)]" />

      <Link href="/">
        <button className="fixed top-4 left-4 z-50 flex items-center gap-2 rounded-full border-4 border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none md:top-8 md:left-8 md:text-sm">
          <ArrowLeft size={16} strokeWidth={3} />
          <span>Exit Protocol</span>
        </button>
      </Link>

      <div className="relative w-full max-w-6xl rounded-[32px] border-[6px] border-black bg-white/95 p-4 shadow-[16px_16px_0px_rgba(0,0,0,1)] sm:p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="order-2 rounded-[24px] border-[4px] border-black bg-[#fff9e6] p-6 sm:p-8 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-yellow-300 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-black">
              Welcome back
            </div>
            <h1 className="mt-4 text-3xl font-black uppercase leading-tight tracking-tighter sm:text-4xl">
              Continue your AI journey
            </h1>
            <p className="mt-3 text-sm font-semibold leading-7 text-black/70 sm:text-base">
              Sign in to access your lessons, practice tests, progress insights, and upcoming Olympiad updates.
            </p>
            <div className="mt-6 space-y-3 text-sm font-bold text-black">
              <div className="rounded-2xl border-2 border-black bg-white p-3">Secure login protected by recaptcha</div>
              <div className="rounded-2xl border-2 border-black bg-blue-50 p-3">Fast access to dashboards and rewards</div>
              <div className="rounded-2xl border-2 border-black bg-pink-50 p-3">Support for password recovery anytime</div>
            </div>
          </div>

          <div className="order-1 rounded-[24px] border-[4px] border-black bg-white p-4 sm:p-6 lg:order-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter sm:text-3xl">
              Access Portal
            </h2>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.28em] text-gray-500">
              Initiate Authentication Protocol
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-5">
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full border-4 border-black p-4 font-bold"
                onChange={(e) => setEmail(e.target.value)}
                disabled={loadingAction === "login"}
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full border-4 border-black p-4 pr-12 font-bold"
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loadingAction === "login"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black opacity-70 hover:opacity-100"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="-mt-2 text-right">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="text-xs font-black underline text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loadingAction === "login"}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loadingAction === "login"}
                className="w-full bg-yellow-400 py-5 font-black uppercase text-black shadow-[6px_6px_0px_black] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-blue-500 hover:text-white hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingAction === "login" ? "Waking System..." : "ACCESS DASHBOARD"}
              </button>
            </form>

            <div className="mt-8 border-t-4 border-dashed border-black pt-6 text-center">
              <p className="text-sm font-bold">
                New Account? {" "}
                <Link href="/register" className="font-black text-blue-600 underline decoration-4 underline-offset-4">
                  REGISTER HERE
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md border-[6px] border-black bg-white p-6 text-left shadow-[10px_10px_0px_black]">
            <h2 className="mb-4 text-center text-xl font-black uppercase">
              Complete Registration
            </h2>

            <p className="mb-6 text-center text-xs font-bold">
              Your account is created but payment is pending.
            </p>

            <div className="mb-5 space-y-3 rounded-2xl border-4 border-black bg-[#fff9e6] p-4">
              <h3 className="text-sm font-black uppercase">Payment Summary</h3>

              <div className="flex items-center justify-between text-sm font-bold">
                <span>Registration Fee</span>
                <span>{`₹${baseAmount.toFixed(2)}`}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-sm font-bold text-green-700">
                  <span>Discount</span>
                  <span>-{`₹${discountAmount.toFixed(2)}`}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm font-bold">
                <span>Taxable Amount</span>
                <span>{`₹${discountedBase.toFixed(2)}`}</span>
              </div>

              <div className="flex items-center justify-between text-sm font-bold">
                <span>GST (18%)</span>
                <span>{`₹${gstAmount.toFixed(2)}`}</span>
              </div>

              <div className="flex items-center justify-between border-t-2 border-dashed border-black pt-3 text-lg font-black">
                <span>Total Payable</span>
                <span>{`₹${payableAmount.toFixed(2)}`}</span>
              </div>
            </div>

            <div className="mb-5 space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
                Coupon Code (optional)
              </label>

              <div className="flex gap-3">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="w-full border-4 border-black bg-white p-3 font-bold"
                  disabled={loadingAction === "login" || couponLoading || isVerifyingPayment}
                />

                <button
                  type="button"
                  onClick={() => void validateCouponCode(couponCode)}
                  disabled={couponLoading || loadingAction === "login" || isVerifyingPayment}
                  className="border-4 border-black bg-black px-4 py-3 font-black text-white disabled:opacity-50"
                >
                  {couponLoading ? "Checking..." : "Apply"}
                </button>
              </div>

              {couponError && (
                <p className="text-xs font-bold text-red-600">{couponError}</p>
              )}

              {appliedCoupon && (
                <div className="rounded-xl border-2 border-green-600 bg-green-50 px-4 py-3 text-sm font-bold text-green-800">
                  Applied {appliedCoupon.code}. Discount saved: ₹{discountAmount.toFixed(2)}.
                </div>
              )}
            </div>

            {isVerifyingPayment ? (
              <div className="mb-4 rounded-xl border-4 border-black bg-black px-4 py-4 text-center font-black text-white">
                Processing payment... please wait.
              </div>
            ) : null}

            <button
              onClick={handlePayment}
              disabled={isVerifyingPayment}
              className="w-full bg-black py-4 font-black text-white transition duration-200 hover:bg-blue-600 disabled:opacity-50"
            >
              {isVerifyingPayment ? "Processing..." : `Pay ₹${payableAmount.toFixed(2)} Now`}
            </button>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="mt-4 w-full text-xs font-black underline"
              disabled={isVerifyingPayment}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md border-[6px] border-black bg-white p-6 shadow-[10px_10px_0px_black]">
            {step === "email" && (
              <>
                <h2 className="mb-4 text-xl font-black uppercase">Recover Access</h2>

                <input
                  className="mb-4 w-full border-4 border-black p-4 font-bold"
                  value={email}
                  placeholder="Enter Your Email"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loadingAction === "sendOtp"}
                />

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loadingAction === "sendOtp"}
                  className="w-full bg-black py-4 font-black text-white transition duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingAction === "sendOtp" ? "Sending..." : "Send OTP"}
                </button>
              </>
            )}

            {step === "otp" && (
              <>
                <input
                  className="mb-4 w-full border-4 border-black p-4"
                  placeholder="Enter OTP sent on Email"
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loadingAction === "verifyOtp"}
                />

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loadingAction === "verifyOtp"}
                  className="w-full bg-black py-4 font-black text-white transition duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingAction === "verifyOtp" ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}

            {step === "reset" && (
              <>
                <input
                  type="password"
                  className="mb-4 w-full border-4 border-black p-4"
                  placeholder="Enter New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loadingAction === "resetPassword"}
                />

                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={loadingAction === "resetPassword"}
                  className="w-full bg-black py-4 font-black text-white transition duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingAction === "resetPassword" ? "Changing..." : "Change Password"}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                if (loadingAction) return;
                setShowModal(false);
                setStep("email");
                setOtp("");
                setNewPassword("");
              }}
              disabled={!!loadingAction}
              className="mt-4 w-full text-xs font-black underline transition duration-200 hover:text-black/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-6 right-6 z-[999]">
          <div className="border-4 border-black bg-black px-6 py-3 text-xs font-bold uppercase text-white shadow-[6px_6px_0px_blue] animate-slideUp">
            {toastMessage}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

// Razorpay loader
function loadRazorpay() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    document.body.appendChild(script);
  });
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-black">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}