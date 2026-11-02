import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Check, 
  ShieldCheck, 
  Zap, 
  Award, 
  Lock, 
  Unlock, 
  CreditCard, 
  QrCode, 
  ArrowRight,
  AlertCircle,
  Clock,
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';
import { storage } from '../services/storage.ts';
import type { MembershipPlan, PaymentRecord } from '../types.ts';
import { ReceiptModal } from '../components/ReceiptModal.tsx';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PricingPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
  selectedPlanId?: string;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate, selectedPlanId }) => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [activePlanId, setActivePlanId] = useState<string>(selectedPlanId || 'plan_crash_60d');
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'CREATING_ORDER' | 'PROCESSING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastPayment, setLastPayment] = useState<PaymentRecord | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [sandboxModalOpen, setSandboxModalOpen] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<any>(null);

  const user = storage.getAuthUser();
  const isLoggedIn = storage.isLoggedIn();
  const isPremium = storage.isPremiumMember();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoadingPlans(true);
      const res = await fetch('/api/plans');
      if (res.ok) {
        const data = await res.json();
        if (data.plans) {
          setPlans(data.plans);
        }
      }
    } catch (e) {
      console.error('Failed to fetch membership plans:', e);
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleSelectPlan = (plan: MembershipPlan) => {
    setActivePlanId(plan.id);
  };

  const handleStartCheckout = async (plan: MembershipPlan) => {
    setErrorMessage(null);

    // If not logged in, redirect to login page with return parameter
    if (!isLoggedIn) {
      onNavigate('auth', { 
        redirect: 'pricing', 
        planId: plan.id, 
        message: 'Please create an account or sign in to purchase your membership pass.' 
      });
      return;
    }

    if (plan.priceINR === 0) {
      // Free plan activation
      setPaymentStatus('PROCESSING');
      try {
        const token = storage.getAuthToken();
        const res = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ planId: plan.id })
        });
        const data = await res.json();
        if (data.success) {
          await storage.syncSession();
          setPaymentStatus('SUCCESS');
        } else {
          setErrorMessage(data.error || 'Could not activate free tier.');
          setPaymentStatus('FAILED');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Network error.');
        setPaymentStatus('FAILED');
      }
      return;
    }

    // Paid Plan Checkout via Razorpay
    setPaymentStatus('CREATING_ORDER');

    try {
      const token = storage.getAuthToken();
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ planId: plan.id })
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        setErrorMessage(orderData.error || 'Failed to initiate payment.');
        setPaymentStatus('FAILED');
        return;
      }

      setPendingOrderData(orderData);

      // Check if official Razorpay checkout script is loaded
      if (typeof window.Razorpay !== 'undefined' && !orderData.isTestSandbox) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'JEE PYQ 30 Test Series',
          description: `Unlock ${orderData.plan.name} (${orderData.plan.durationDays} Days)`,
          order_id: orderData.orderId,
          prefill: orderData.prefill || {
            name: user.name,
            email: user.email
          },
          theme: {
            color: '#2563eb'
          },
          handler: async (response: any) => {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan.id,
              paymentMethod: 'Razorpay Checkout'
            });
          },
          modal: {
            ondismiss: () => {
              setPaymentStatus('IDLE');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (resp: any) => {
          setPaymentStatus('FAILED');
          setErrorMessage(resp.error?.description || 'Payment was declined or cancelled.');
        });
        rzp.open();
      } else {
        // Fallback to Sandbox Checkout Modal (Supported Test Mode)
        setSandboxModalOpen(true);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Payment initiation failed.');
      setPaymentStatus('FAILED');
    }
  };

  const verifyPayment = async (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    planId: string;
    paymentMethod?: string;
  }) => {
    setPaymentStatus('PROCESSING');
    try {
      const token = storage.getAuthToken();
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        if (data.user) {
          storage.setAuthUser(data.user);
        }
        if (data.paymentRecord) {
          setLastPayment(data.paymentRecord);
          storage.saveLocalPayment(data.paymentRecord);
        }

        // Fire celebration confetti
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch {}

        setPaymentStatus('SUCCESS');
        setSandboxModalOpen(false);
      } else {
        setErrorMessage(data.error || 'Payment signature verification failed.');
        setPaymentStatus('FAILED');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error during verification.');
      setPaymentStatus('FAILED');
    }
  };

  const handleSimulateSandboxPayment = async (method: string) => {
    if (!pendingOrderData) return;

    const fakePaymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const signature = `sig_test_${pendingOrderData.orderId}_${fakePaymentId}`;

    await verifyPayment({
      razorpay_order_id: pendingOrderData.orderId,
      razorpay_payment_id: fakePaymentId,
      razorpay_signature: signature,
      planId: pendingOrderData.plan.id,
      paymentMethod: method
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>Transparent Indian Rupee (INR) Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Unlock All 30 Full-Length PYQ Tests
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Gain unrestricted access to authentic JEE Main test papers, 2,250 verified questions, step-by-step mathematical derivations, and in-depth performance analytics.
        </p>

        {isPremium && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>You currently have an ACTIVE Premium Membership! All 30 tests are unlocked.</span>
          </div>
        )}
      </div>

      {/* Payment Success State Banner */}
      {paymentStatus === 'SUCCESS' && (
        <div className="rounded-3xl border-2 border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/40 p-6 sm:p-8 text-center space-y-4 shadow-xl">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-600/30">
            <Check className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Membership Activated Successfully!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
            Your payment has been verified and recorded. You now have full access to all 30 full-length papers, question bank solutions, and personalized mistake analytics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('tests')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all"
            >
              <Unlock className="h-4 w-4" />
              <span>Start Test Series Now</span>
            </button>

            {lastPayment && (
              <button
                onClick={() => setShowReceiptModal(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>View Tax Receipt</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-3 rounded-xl border border-slate-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              <span>Go to Dashboard</span>
            </button>
          </div>
        </div>
      )}

      {/* Error state */}
      {paymentStatus === 'FAILED' && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40 text-xs text-red-800 dark:text-red-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            <span>{errorMessage || 'Payment could not be completed. Please try again.'}</span>
          </div>
          <button
            onClick={() => setPaymentStatus('IDLE')}
            className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const isSelected = activePlanId === plan.id;
          const isFree = plan.priceINR === 0;

          return (
            <div
              key={plan.id}
              onClick={() => handleSelectPlan(plan)}
              className={`relative rounded-3xl p-6 sm:p-8 transition-all flex flex-col justify-between cursor-pointer ${
                plan.isPopular
                  ? 'border-2 border-blue-600 bg-white dark:bg-slate-900 shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/10'
                  : 'border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:border-slate-400'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[32px]">
                    {plan.tagline}
                  </p>
                </div>

                {/* Price block */}
                <div className="mt-5 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                      ₹{plan.priceINR}
                    </span>
                    {plan.originalPriceINR > plan.priceINR && (
                      <span className="text-sm font-semibold text-slate-400 line-through">
                        ₹{plan.originalPriceINR}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">
                    {isFree ? 'Permanent Access' : `Valid for ${plan.durationDays} Days · Official Razorpay Checkout`}
                  </p>
                </div>

                {/* Features list */}
                <div className="mt-6 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    What's Included:
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartCheckout(plan);
                  }}
                  disabled={paymentStatus === 'PROCESSING' || paymentStatus === 'CREATING_ORDER'}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] ${
                    plan.isPopular
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
                      : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                  }`}
                >
                  {isFree ? (
                    <>
                      <span>{isLoggedIn ? 'Active Diagnostic Plan' : 'Start Free Tests (01 & 02)'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      <span>{isLoggedIn ? `Unlock for ₹${plan.priceINR}` : 'Log In & Purchase Pass'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Payment Methods Bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Official Razorpay Payment Gateway Integration
              </h4>
              <p className="text-xs text-slate-500">
                100% Secure, RBI-compliant 256-bit SSL encrypted online payment processing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Instant Access</span>
            <span>·</span>
            <span>Official GST Invoice</span>
            <span>·</span>
            <span>No Recurring Charges</span>
          </div>
        </div>

        {/* Accepted Payment Modes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <QrCode className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">UPI Instant</p>
              <p className="text-[10px] text-slate-400">Google Pay, PhonePe, Paytm</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Cards</p>
              <p className="text-[10px] text-slate-400">Visa, Mastercard, RuPay</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <Award className="h-5 w-5 text-purple-600" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Net Banking</p>
              <p className="text-[10px] text-slate-400">All 50+ Indian Banks</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Wallets & EMI</p>
              <p className="text-[10px] text-slate-400">Credit Card EMI, Mobikwik</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sandbox Test Mode Checkout Modal */}
      {sandboxModalOpen && pendingOrderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Razorpay Test Sandbox
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Complete Payment (Test Mode)
                </h3>
              </div>
              <button
                onClick={() => setSandboxModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs space-y-1">
              <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                <span>{pendingOrderData.plan.name}</span>
                <span className="font-mono text-blue-600 text-sm">₹{pendingOrderData.amountINR}.00</span>
              </div>
              <p className="text-slate-500">Order ID: <code className="font-mono">{pendingOrderData.orderId}</code></p>
              <p className="text-[11px] text-slate-500">Candidate: {user.name} ({user.email})</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Select Test Payment Method:
              </p>

              <button
                onClick={() => handleSimulateSandboxPayment('UPI (Google Pay / PhonePe)')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 dark:border-slate-700 text-left transition-colors text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <QrCode className="h-4 w-4 text-emerald-600" />
                  <span>UPI Quick Pay (Simulated Instant Approval)</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-bold">Fastest</span>
              </button>

              <button
                onClick={() => handleSimulateSandboxPayment('Debit / Credit Card (RuPay/Visa)')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 dark:border-slate-700 text-left transition-colors text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span>Debit / Credit Card (Simulated Approval)</span>
                </div>
                <span className="text-[11px] text-slate-400">Card</span>
              </button>

              <button
                onClick={() => handleSimulateSandboxPayment('Net Banking (SBI / HDFC / ICICI)')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 dark:border-slate-700 text-left transition-colors text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span>Net Banking (Simulated Approval)</span>
                </div>
                <span className="text-[11px] text-slate-400">NetBanking</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>Razorpay Test mode orders verify cryptographic HMAC SHA-256 signatures before activating membership.</span>
            </div>
          </div>
        </div>
      )}

      {/* Tax Receipt Modal */}
      <ReceiptModal
        payment={lastPayment}
        onClose={() => setShowReceiptModal(false)}
      />
    </div>
  );
};
