import React from 'react';
import { 
  X, 
  Printer, 
  CheckCircle, 
  ShieldCheck, 
  Award, 
  Calendar,
  Building2,
  FileText
} from 'lucide-react';
import type { PaymentRecord } from '../types.ts';

interface ReceiptModalProps {
  payment: PaymentRecord | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ payment, onClose }) => {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(payment.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const basePrice = Math.round((payment.amountINR / 1.18) * 100) / 100;
  const gstAmount = Math.round((payment.amountINR - basePrice) * 100) / 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-sm">
            <FileText className="h-4 w-4 text-blue-600" />
            <span>Tax Invoice & Payment Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200" id="payment-receipt-content">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  TOP <span className="text-blue-600 dark:text-sky-400">RANKER</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  CBT Test Series
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Joint Entrance Examination Prep Portal · Practice Smart. Rank Higher.</p>
              <p className="text-[11px] text-slate-400">GSTIN: 07AAECJ1234F1Z8</p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Paid via Razorpay</span>
              </span>
              <p className="font-mono text-xs text-slate-500 mt-1 font-semibold">{payment.receiptNumber}</p>
            </div>
          </div>

          {/* Student & Transaction Meta */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Billed To Candidate</p>
              <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{payment.userName}</p>
              <p className="text-slate-500">{payment.userEmail}</p>
            </div>

            <div className="text-right">
              <p className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Payment Details</p>
              <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300 mt-0.5">Order: {payment.orderId}</p>
              <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300">Payment: {payment.paymentId}</p>
              <p className="text-[11px] text-slate-400">{formattedDate}</p>
            </div>
          </div>

          {/* Plan Breakdown Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Item Description</th>
                  <th className="py-2.5 px-4 font-bold text-center">Duration</th>
                  <th className="py-2.5 px-4 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 dark:text-white">{payment.planName}</p>
                    <p className="text-[11px] text-slate-500">Unlocks all 30 full-length mock papers with verified derivations.</p>
                  </td>
                  <td className="py-3 px-4 text-center font-medium">Standard Validity</td>
                  <td className="py-3 px-4 text-right font-mono font-bold">₹{basePrice.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Calculation */}
          <div className="space-y-1.5 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span className="font-mono">₹{basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Integrated GST (18%):</span>
              <span className="font-mono">₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
              <span>Total Paid (INR):</span>
              <span className="font-mono text-base text-blue-600">₹{payment.amountINR}.00</span>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
              <span>Verified 256-Bit SSL Encrypted Transaction</span>
            </div>
            <span className="font-mono">Status: SUCCESS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
