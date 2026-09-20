"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import {
  sendRegisterOtp,
  verifyRegisterOtp,
  createOrder,
  registerUser,
} from "@/services/auth";
import { apiRequest } from "@/lib/api";
import { executeRecaptcha } from "@/lib/recaptcha";

const STATES = [
  "Delhi",
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const BOARDS = [
  "Other",
  "AKTU - Dr. A.P.J. Abdul Kalam Technical University",
  "BSEH - Board of School Education Haryana",
  "CBSE - Central Board of Secondary Education",
  "CU - Chandigarh University",
  "DBSE - Delhi Board of School Education",
  "DTU - Delhi Technological University",
  "GGSIPU - Guru Gobind Singh Indraprastha University",
  "HBSE - Haryana Board of School Education",
  "ICSE - Indian Certificate of Secondary Education",
  "IGDTUW - Indira Gandhi Delhi Technical University for Women",
  "IITD - Indian Institute of Technology Delhi",
  "JAC Delhi - Joint Admission Committee Delhi",
  "JMI - Jamia Millia Islamia",
  "MAIT - Maharaja Agrasen Institute of Technology",
  "NIOS - National Institute of Open Schooling",
  "NSUT - Netaji Subhas University of Technology",
  "RBSE - Rajasthan Board of Secondary Education",
  "UPMSP - Uttar Pradesh Madhyamik Shiksha Parishad",
  "VIPS - Vivekananda Institute of Professional Studies",
];

type LoadingAction =
  | "step1"
  | "sendOtp"
  | "verifyOtp"
  | "resendOtp"
  | "payment"
  | null;

function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`w-full border-4 border-black p-3 rounded-xl font-bold bg-white flex justify-between items-center ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-50"
        }`}
      >
        <span className={value ? "text-black" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <span className="text-xs font-black">▼</span>
      </button>

      {open && !disabled && (
        <div className="absolute z-30 mt-2 w-full bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_black] overflow-hidden">
          <div className="max-h-56 overflow-y-auto">
            {options.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  onChange(item);
                  setOpen(false);
                }}
                className={`w-full flex justify-between items-center px-4 py-3 font-bold border-b border-black/10 hover:bg-yellow-100 ${
                  value === item ? "bg-yellow-200" : ""
                }`}
              >
                <span>{item}</span>
                {value === item && <span>✔</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchableStateDropdown({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const filtered = STATES.filter((state) =>
    state.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 mb-2">
        Select Your State or UT
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`w-full border-4 border-black p-3 rounded-xl font-bold text-left bg-white flex items-center justify-between gap-3 transition ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-50"
        }`}
      >
        <span className={value ? "text-black" : "text-gray-400"}>
          {value || "Search and select state"}
        </span>
        <span className="text-xs font-black">▼</span>
      </button>

      {open && !disabled && (
        <div className="absolute z-30 mt-2 w-full bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="p-3 border-b-4 border-black bg-[#fff9e6]">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search..."
              className="w-full border-4 border-black p-3 rounded-xl font-bold outline-none"
            />
          </div>

          <div className="max-h-56 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => {
                    onChange(state);
                    setQuery(state);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 font-bold border-b border-black/10 hover:bg-yellow-100"
                >
                  {state}
                </button>
              ))
            ) : (
              <div className="px-4 py-4 text-sm font-bold text-gray-500">
                No matching state found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [agreedToPolicies, setAgreedToPolicies] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [userExists, setUserExists] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [showCustomBoardInput, setShowCustomBoardInput] = useState(false);

  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const toUpper = (value: string) => value.toUpperCase();

  const [formData, setFormData] = useState({
    name: "",
    studentPhone: "",
    email: "",
    parentPhone: "",
    parentEmail: "",
    password: "",
    level: "",
    school: "",
    city: "",
    state: "",
    board: "",
    paymentStatus: "pending",
  });

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
  const grossAmountPaise = Math.round((baseAmount + baseAmount * GST_RATE) * 100); // original for reference

  const LEVEL_OPTIONS = [
    { label: "School Class 4-5", value: "4-5" },
    { label: "School Class 6-8", value: "6-8" },
    { label: "School Class 9-10", value: "9-10" },
    { label: "School Class 11-12", value: "11-12" },
    { label: "College Year 1-2", value: "1-2" },
    { label: "College Year 3-4", value: "3-4" },
  ];

  const money = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

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
          email: formData.email,
          amount: grossAmountPaise,
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
      setCouponError("");
    } catch (err: any) {
      setAppliedCoupon(null);
      setCouponError(err?.message || "Invalid coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  useEffect(() => {
    const code = couponCode.trim();

    if (!code) {
      setAppliedCoupon(null);
      setCouponError("");
      return;
    }

    const t = setTimeout(() => {
      void validateCouponCode(code);
    }, 500);

    return () => clearTimeout(t);
  }, [couponCode, formData.email]);

  useEffect(() => {
    if (step === 3 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }

    if (timer === 0) setCanResend(true);
  }, [step, timer]);

  const resetOtpTimer = () => {
    setTimer(60);
    setCanResend(false);
  };

  const validateStep1 = async () => {
    let newErrors: any = {};

    if (!/^\d{10}$/.test(formData.studentPhone))
      newErrors.studentPhone = "Invalid phone";

    if (!/^\d{10}$/.test(formData.parentPhone))
      newErrors.parentPhone = "Invalid phone";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail))
      newErrors.parentEmail = "Invalid email";

    if (formData.password.length < 6) newErrors.password = "Weak password";

    setErrors(newErrors);

    if (!newErrors.email) {
      try {
        await apiRequest(`/auth/check-user?email=${formData.email}`);
        setUserExists(false);
      } catch {
        setUserExists(true);
        newErrors.email = "User already exists";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePersonalNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loadingAction) return;

    setLoadingAction("step1");
    try {
      const valid = await validateStep1();
      if (!valid) return;
      setStep(2);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSchoolNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loadingAction) return;

    if (!agreedToPolicies) {
      alert("Please agree to the Terms & Conditions and Privacy Policy to continue.");
      return;
    }

    setLoadingAction("sendOtp");
    try {
      const token = await executeRecaptcha("register_step2");
      await sendRegisterOtp(formData.email, token);

      setStep(3);
      setOtp("");
      resetOtpTimer();
    } catch (err: any) {
      alert(err?.message || "Failed to send OTP");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleVerifyOtp = async () => {
    if (loadingAction) return;

    setLoadingAction("verifyOtp");
    try {
      const verifyToken = await executeRecaptcha("register_verify");
      await verifyRegisterOtp(formData.email, otp.trim(), verifyToken);

      const registerToken = await executeRecaptcha("register_final");
      await registerUser({
        ...formData,
        name: toUpper(formData.name),
        school: toUpper(formData.school),
        city: toUpper(formData.city),
        state: toUpper(formData.state),
        paymentStatus: "pending",
        recaptchaToken: registerToken,
      });

      setStep(4);
    } catch (err: any) {
      alert(err?.message || "OTP verification failed");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleResendOtp = async () => {
    if (loadingAction || !canResend) return;

    setLoadingAction("resendOtp");
    try {
      const token = await executeRecaptcha("resend_otp");
      await sendRegisterOtp(formData.email, token);

      setTimer(60);
      setCanResend(false);
    } catch (err: any) {
      alert(err?.message || "Try again");
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePayment = async () => {
    if (loadingAction) return;

    setLoadingAction("payment");
    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay failed");
        setLoadingAction(null);
        return;
      }

      const order = await createOrder({
        amount: payableAmountPaise,
        email: formData.email,
        couponCode: appliedCoupon?.code || null,
        couponId: appliedCoupon?._id || null,
        subtotalAmount: Math.round(discountedBase * 100),
        gstAmount: gstAmountPaise,
        discountAmount: discountAmountPaise,
        payableAmount: payableAmountPaise,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "AI Olympiad",
        description: "Registration Fee",
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
                email: formData.email,

                couponCode: appliedCoupon?.code || null,
                couponId: appliedCoupon?._id || null,
                discountAmount: discountAmountPaise,
                subtotalAmount: Math.round(discountedBase * 100),
                gstAmount: gstAmountPaise,
                payableAmount: payableAmountPaise,
              }),
            });

            setPaymentSuccess(true);
            setIsVerifyingPayment(false);
          } catch (err: any) {
            alert(err?.message || "Payment verification failed");
          } finally {
            setLoadingAction(null);
          }
        },
        modal: {
          ondismiss: () => {
            setLoadingAction(null);

            // fallback safety
            setTimeout(() => {
              if (!paymentSuccess) {
                window.location.reload(); // simple safe reset
              }
            }, 1500);
          },
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.studentPhone,
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

  const isBusy = loadingAction !== null;
  const progressPercent = paymentSuccess ? 100 : step * 25;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),linear-gradient(135deg,#fffdf5_0%,#f6fbff_100%)] px-4 py-6 sm:px-6 lg:px-8 font-sans text-black">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.45)_50%,transparent_100%)]" />

      <Link href="/">
        <button className="fixed top-4 left-4 z-50 flex items-center gap-2 rounded-full border-4 border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none md:top-8 md:left-8 md:text-sm">
          <ArrowLeft size={16} strokeWidth={3} />
          <span>Exit</span>
        </button>
      </Link>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="order-2 w-full rounded-[32px] border-[6px] border-black bg-white p-6 shadow-[14px_14px_0px_rgba(0,0,0,1)] sm:p-8 lg:order-1">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-yellow-300 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-black">
            AI Olympiad
          </div>
          <h1 className="mt-4 text-3xl font-black uppercase leading-tight tracking-tighter sm:text-4xl">
            Join the future of learning
          </h1>
          <p className="mt-3 text-sm font-semibold leading-7 text-black/70 sm:text-base">
            Register in a few guided steps and unlock structured AI learning, chapter tests, and exciting rewards.
          </p>
          <div className="mt-6 space-y-3 text-sm font-bold text-black">
            <div className="rounded-2xl border-2 border-black bg-[#fff9e6] p-3">4-step guided registration</div>
            <div className="rounded-2xl border-2 border-black bg-[#eff6ff] p-3">Mobile-friendly and effortless experience</div>
            <div className="rounded-2xl border-2 border-black bg-[#ecfeff] p-3">Trusted by schools, colleges, and learners</div>
          </div>
        </div>

        <div className="order-1 w-full rounded-[32px] border-[6px] border-black bg-white/95 p-5 shadow-[16px_16px_0px_rgba(0,0,0,1)] sm:p-8 lg:order-2">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter sm:text-3xl">
                Register Now
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-500">
                Step {step} of 4
              </p>
            </div>
            <div className="rounded-full border-2 border-black bg-blue-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-blue-700">
              Secure & fast
            </div>
          </div>

          <div className="mb-7">
            <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full border-4 border-black bg-white">
              <div
                className="h-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handlePersonalNext} className="space-y-5">
              <input
                placeholder="Student Full Name"
                className="w-full rounded-xl border-4 border-black p-3 font-bold disabled:cursor-not-allowed disabled:opacity-50"
                onChange={(e) => setFormData({ ...formData, name: toUpper(e.target.value) })}
                disabled={isBusy}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="relative">
                  <input
                    placeholder="Student Phone"
                    className={`w-full rounded-xl border-4 p-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.studentPhone ? "border-red-500 bg-red-50" : "border-black"
                    }`}
                    onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
                    disabled={isBusy}
                  />

                  {errors.studentPhone && (
                    <div className="absolute -top-10 left-0 rounded-lg bg-red-500 px-3 py-1 text-xs font-bold whitespace-nowrap text-white shadow-md">
                      {errors.studentPhone} Example: 9876543210
                      <div className="absolute top-full left-3 h-2 w-2 rotate-45 bg-red-500"></div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="email"
                    placeholder="Student Email"
                    className={`w-full rounded-xl border-4 p-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.email ? "border-red-500 bg-red-50" : "border-black"
                    }`}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isBusy}
                  />

                  {errors.email && (
                    <div className="absolute -top-10 left-0 rounded-lg bg-red-500 px-3 py-1 text-xs font-bold whitespace-nowrap text-white shadow-md">
                      {errors.email}
                      <div className="absolute top-full left-3 h-2 w-2 rotate-45 bg-red-500"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="relative">
                  <input
                    placeholder="Parent Phone"
                    className={`w-full rounded-xl border-4 p-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.parentPhone ? "border-red-500 bg-red-50" : "border-black"
                    }`}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    disabled={isBusy}
                  />

                  {errors.parentPhone && (
                    <div className="absolute -top-10 left-0 rounded-lg bg-red-500 px-3 py-1 text-xs font-bold whitespace-nowrap text-white shadow-md">
                      {errors.parentPhone} Example: 9876543210
                      <div className="absolute top-full left-3 h-2 w-2 rotate-45 bg-red-500"></div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="email"
                    placeholder="Parent Email"
                    className={`w-full rounded-xl border-4 p-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.parentEmail ? "border-red-500 bg-red-50" : "border-black"
                    }`}
                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                    disabled={isBusy}
                  />

                  {errors.parentEmail && (
                    <div className="absolute -top-10 left-0 rounded-lg bg-red-500 px-3 py-1 text-xs font-bold whitespace-nowrap text-white shadow-md">
                      {errors.parentEmail}
                      <div className="absolute top-full left-3 h-2 w-2 rotate-45 bg-red-500"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full rounded-xl border-4 border-black p-3 pr-12 font-bold disabled:cursor-not-allowed disabled:opacity-50"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isBusy}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-black opacity-70 hover:opacity-100"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.password && formData.password.length < 6 && (
                <p className="text-xs font-bold text-yellow-600">Weak password (min 6 chars recommended)</p>
              )}

              <button
                type="submit"
                disabled={loadingAction === "step1"}
                className="w-full rounded-2xl bg-yellow-400 py-4 font-black text-black transition duration-200 hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingAction === "step1" ? "Checking..." : "Continue"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSchoolNext} className="space-y-5">
              <CustomDropdown
                options={LEVEL_OPTIONS.map((item) => item.label)}
                value={LEVEL_OPTIONS.find((item) => item.value === formData.level)?.label || formData.level}
                onChange={(label) => {
                  const selected = LEVEL_OPTIONS.find((item) => item.label === label);
                  setFormData({ ...formData, level: selected?.value || label });
                }}
                placeholder="Select Your Class"
                disabled={isBusy}
              />

              <input
                placeholder="Your School or College Name"
                className="w-full rounded-xl border-4 border-black p-3 font-bold disabled:cursor-not-allowed disabled:opacity-50"
                onChange={(e) => setFormData({ ...formData, school: toUpper(e.target.value) })}
                disabled={isBusy}
              />

              <input
                placeholder="Your City"
                className="w-full rounded-xl border-4 border-black p-3 font-bold disabled:cursor-not-allowed disabled:opacity-50"
                onChange={(e) => setFormData({ ...formData, city: toUpper(e.target.value) })}
                disabled={isBusy}
              />

              <SearchableStateDropdown
                value={formData.state}
                onChange={(state) => setFormData({ ...formData, state: toUpper(state) })}
                disabled={isBusy}
              />

              <div className="space-y-3">
                <CustomDropdown
                  options={BOARDS}
                  value={formData.board}
                  onChange={(val) => {
                    if (val === "Other") {
                      setFormData({ ...formData, board: "" });
                      setShowCustomBoardInput(true);
                    } else {
                      setFormData({ ...formData, board: val });
                      setShowCustomBoardInput(false);
                    }
                  }}
                  placeholder="Select Your School Board or University"
                  disabled={isBusy}
                />

                {showCustomBoardInput && (
                  <input
                    placeholder="Enter School Board / College / University Name"
                    className="w-full rounded-xl border-4 border-black p-3 font-bold disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.board}
                    onChange={(e) => setFormData({ ...formData, board: toUpper(e.target.value) })}
                    disabled={isBusy}
                  />
                )}
              </div>

              <label className="flex items-start gap-3 text-sm font-bold leading-5">
                <input
                  type="checkbox"
                  checked={agreedToPolicies}
                  onChange={(e) => setAgreedToPolicies(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-black disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isBusy}
                />
                <span>
                  By clicking continue, you agree to the {" "}
                  <Link href="/terms" className="text-blue-600 underline hover:text-yellow-500" target="_blank">
                    Terms & Conditions
                  </Link>{" "}
                  and {" "}
                  <Link href="/privacy-policy" className="text-blue-600 underline hover:text-yellow-500" target="_blank">
                    Privacy Policy
                  </Link>{" "}
                  of the product.
                </span>
              </label>

              <button
                type="submit"
                disabled={!agreedToPolicies || loadingAction === "sendOtp"}
                className={`w-full rounded-2xl py-4 font-black transition duration-200 disabled:cursor-not-allowed ${
                  agreedToPolicies && loadingAction !== "sendOtp"
                    ? "bg-yellow-400 text-black hover:bg-blue-500 hover:text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                {loadingAction === "sendOtp" ? "Sending OTP..." : "Continue"}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <input
                placeholder="Enter OTP sent on Email"
                className="w-full rounded-xl border-4 border-black p-3 font-bold disabled:cursor-not-allowed disabled:opacity-50"
                onChange={(e) => setOtp(e.target.value)}
                disabled={loadingAction === "verifyOtp"}
              />

              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loadingAction === "resendOtp"}
                  className="text-sm font-bold text-blue-600 underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingAction === "resendOtp" ? "Resending..." : "Resend OTP"}
                </button>
              ) : (
                <p className="text-xs text-gray-500">Resend in {timer}s</p>
              )}

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loadingAction === "verifyOtp"}
                className="w-full rounded-2xl bg-black py-4 font-black text-white transition duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingAction === "verifyOtp" ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 text-left">
              <div className="space-y-4 rounded-3xl border-4 border-black bg-[#fff9e6] p-5 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black uppercase">Payment Summary</h3>

                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Registration Fee</span>
                  <span>{money(baseAmount)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm font-bold text-green-700">
                    <span>Discount</span>
                    <span>-{money(discountAmount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Taxable Amount</span>
                  <span>{money(discountedBase)}</span>
                </div>

                <div className="flex items-center justify-between text-sm font-bold">
                  <span>GST (18%)</span>
                  <span>{money(gstAmount)}</span>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
                    Coupon Code (optional)
                  </label>

                  <div className="flex flex-col gap-3 md:flex-row">
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="w-full rounded-xl border-4 border-black bg-white p-3 font-bold disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isBusy}
                    />

                    <button
                      type="button"
                      onClick={() => void validateCouponCode(couponCode)}
                      disabled={isBusy || couponLoading}
                      className="rounded-xl border-4 border-black bg-black px-5 py-3 font-black text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {couponLoading ? "Checking..." : "Apply"}
                    </button>
                  </div>

                  {couponError && <p className="text-xs font-bold text-red-600">{couponError}</p>}

                  {appliedCoupon && (
                    <div className="rounded-2xl border-2 border-green-600 bg-green-50 px-4 py-3 text-sm font-bold text-green-800">
                      Applied {appliedCoupon.code}. Discount saved: {money(discountAmount)}.
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t-4 border-black pt-4 text-2xl font-black">
                  <span>Payable Now</span>
                  <span>{money(payableAmount)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePayment}
                disabled={loadingAction === "payment" || isVerifyingPayment}
                className="w-full rounded-2xl bg-black py-4 font-black text-white transition duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingAction === "payment"
                  ? "Opening Payment..."
                  : isVerifyingPayment
                  ? "Processing..."
                  : `Pay ${money(payableAmount)} & Register`}
              </button>
            </div>
          )}

          <div className={`transition-opacity duration-300 ${step <= 2 ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <p className="mt-8 text-center text-sm font-bold">Already registered?</p>
            <p className="text-center text-sm font-bold">
              <Link href="/login" className="text-blue-600 underline transition duration-200 hover:text-yellow-500">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {paymentSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md border-[6px] border-black bg-white p-8 text-center shadow-[12px_12px_0px_black] animate-popIn">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-black bg-yellow-400">
              <span className="text-4xl font-black leading-none">✓</span>
            </div>

            <h2 className="mb-3 text-2xl font-black uppercase">Payment Successful</h2>

            <p className="mb-6 text-sm font-bold">
              Your account is ready. Please log in now with your email and password to continue.
            </p>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full rounded-2xl bg-black py-4 font-black text-white transition duration-200 hover:bg-blue-600"
            >
              Login Now
            </button>
          </div>
        </div>
      )}

      {isVerifyingPayment && !paymentSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-md border-[6px] border-black bg-white p-8 text-center shadow-[12px_12px_0px_black] animate-popIn">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-black">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
            </div>

            <h2 className="mb-3 text-xl font-black uppercase">Processing Payment...</h2>

            <p className="text-sm font-bold text-gray-600">
              Please wait while we verify your payment and activate your account.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes popIn {
          0% {
            transform: scale(0.85);
            opacity: 0;
          }
          70% {
            transform: scale(1.03);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-popIn {
          animation: popIn 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}

// Razorpay loader
function loadRazorpay() {
  return new Promise<boolean>((resolve) => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}