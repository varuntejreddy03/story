/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileDown, Calendar, Search, CreditCard, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';
import { PaymentTransaction } from '../types';
import { formatINR } from '../utils/currency';

interface PaymentsViewProps {
  transactions: PaymentTransaction[];
}

export default function PaymentsView({ transactions }: PaymentsViewProps) {
  const [successMsg, setSuccessMsg] = useState(false);
  const settledAmount = transactions
    .filter((txn) => txn.status === 'Settled')
    .reduce((sum, txn) => sum + txn.amount, 0);
  const pendingAmount = transactions
    .filter((txn) => txn.status === 'Pending')
    .reduce((sum, txn) => sum + txn.amount, 0);
  const settledCount = transactions.filter((txn) => txn.status === 'Settled').length;

  const handleDownloadStatement = () => {
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2500);
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-sans text-neutral-900 tracking-tight">Payments</h2>
          <p className="text-sm font-sans text-neutral-500 mt-1">Audit payment statuses, instant settlements, and transactional ledger items.</p>
        </div>
      </div>

      {/* Success banner toast if statements downloaded */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-neutral-900 border border-neutral-950 rounded-xl text-white text-xs font-mono flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-white shrink-0" />
              <span>Statement ledger exported successfully as STORY_Statement_May2026.csv!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Gateway Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-neutral-150 shadow-xs">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1.5">Settled Amount</p>
          <p className="text-2xl font-bold text-neutral-900">{formatINR(settledAmount)}</p>
          <p className="text-[11px] font-mono text-green-600 mt-1">Instant settlements 100%</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-150 shadow-xs">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1.5">Gateway Deposits</p>
          <p className="text-2xl font-bold text-neutral-900">{formatINR(pendingAmount)}</p>
          <p className="text-[11px] font-mono text-neutral-400 mt-1">Pending payout cycle</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-150 shadow-xs">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1.5">Primary Gateway</p>
          <p className="text-2xl font-bold text-neutral-900">Razorpay</p>
          <p className="text-[11px] font-mono text-neutral-500 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> Live & Active
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-150 shadow-xs">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1.5">Disputes & Refunds</p>
          <p className="text-2xl font-bold text-neutral-900">{formatINR(0)}</p>
          <p className="text-[11px] font-mono text-neutral-500 mt-1">Excellent account health</p>
        </div>
      </div>

      {/* Transaction History Area */}
      <div className="bg-white rounded-xl border border-neutral-200/60 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-150 flex justify-between items-center bg-neutral-50/15">
          <h3 className="text-sm font-semibold text-neutral-900">Transaction History logs</h3>
          <span className="text-xs font-mono text-neutral-400">{settledCount} Settlements</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 text-[10px] uppercase font-mono tracking-wider text-neutral-400 border-b border-neutral-150 font-semibold">
                <th className="p-4 whitespace-nowrap">Transaction ID</th>
                <th className="p-4 whitespace-nowrap">Order Reference</th>
                <th className="p-4 whitespace-nowrap">Payment Gateway ID</th>
                <th className="p-4 whitespace-nowrap">Transaction Value</th>
                <th className="p-4 whitespace-nowrap">Method Type</th>
                <th className="p-4 whitespace-nowrap">Settled State</th>
              </tr>
            </thead>
            <tbody className="text-xs font-mono text-neutral-700 divide-y divide-neutral-150">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-neutral-50/40 transition-colors">
                  <td className="p-4 font-bold text-neutral-900">{txn.id}</td>
                  <td className="p-4 text-neutral-500">{txn.orderId}</td>
                  <td className="p-4 text-[11px]">pay_M29Haj27gsh19s</td>
                  <td className="p-4 text-neutral-900 font-semibold text-sm">{formatINR(txn.amount)}</td>
                  <td className="p-4 text-[11px] uppercase tracking-wider">{txn.method}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border font-mono ${
                      txn.status === 'Settled' ? 'bg-neutral-900 text-white border-neutral-900' :
                      txn.status === 'Pending' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      'bg-red-50 text-red-800 border-red-200'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${
                        txn.status === 'Settled' ? 'bg-white' :
                        txn.status === 'Pending' ? 'bg-amber-600' : 'bg-red-650'
                      }`}></span>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
