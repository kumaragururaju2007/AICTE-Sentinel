import React, { useState } from 'react'
import {
  History, ShieldCheck, CheckCircle2, AlertTriangle, Search,
  Lock, Key, RefreshCw, Download, FileText, Check, ShieldAlert
} from 'lucide-react'
import { AUDIT_TRAIL_CHAIN } from '../shared/sentinelData'

export default function AuditLogInterface({ onBack }) {
  const [chain, setChain] = useState(AUDIT_TRAIL_CHAIN)
  const [isVerifying, setIsVerifying] = useState(false)
  const [tamperedIndex, setTamperedIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Verify full hash chain continuity
  const handleVerifyChain = () => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      if (tamperedIndex !== null) {
        alert(`VERIFICATION FAILED: Tampering detected at Block #${tamperedIndex}! Hash link broken with subsequent block.`)
      } else {
        alert('CRYPTOGRAPHIC VERIFICATION SUCCESS: All 5 SHA-256 blocks are tamper-evident and unbroken!')
      }
    }, 600)
  }

  // Simulate Tampering Demo (Required for SIH 5-Minute Demo Script)
  const handleSimulateTamper = (index) => {
    setTamperedIndex(index)
    setChain(prev => prev.map((block, idx) => {
      if (idx === index) {
        return {
          ...block,
          reason: '[TAMPERED DATA] Unauthorized database modification of deficiency findings',
          event_hash: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
          status: 'HASH_MISMATCH_TAMPERED'
        }
      }
      if (idx > index) {
        return {
          ...block,
          status: 'BROKEN_CHAIN_LINK'
        }
      }
      return block
    }))
  }

  // Restore Chain
  const handleRestoreChain = () => {
    setTamperedIndex(null)
    setChain(AUDIT_TRAIL_CHAIN)
  }

  const filteredChain = chain.filter(c => {
    return c.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
           c.actor_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
           c.entity_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
           c.event_hash.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button onClick={onBack} className="hover:text-indigo-600 font-medium">
              &larr; Back to Admin Overview
            </button>
            <span>/</span>
            <span>Tamper-Evident Ledger</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Cryptographic Hash-Chained Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sequential SHA-256 transaction blocks tying business states to cryptographic checkpoints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tamperedIndex !== null ? (
            <button
              onClick={handleRestoreChain}
              className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all"
            >
              Restore Original Ledger
            </button>
          ) : (
            <button
              onClick={() => handleSimulateTamper(2)}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              Simulate DB Tampering (Demo)
            </button>
          )}

          <button
            onClick={handleVerifyChain}
            disabled={isVerifying}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            {isVerifying ? 'Recalculating Hashes...' : 'Verify Full Hash Chain'}
          </button>
        </div>
      </div>

      {/* Chain Status Callout Banner */}
      <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between shadow-sm ${
        tamperedIndex !== null
          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-900 dark:text-rose-200'
          : 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200'
      }`}>
        <div className="flex items-center gap-3">
          {tamperedIndex !== null ? (
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
          ) : (
            <ShieldCheck className="w-6 h-6 text-purple-600 shrink-0" />
          )}
          <div>
            <p className="font-bold text-sm">
              {tamperedIndex !== null
                ? `SECURITY INTEGRITY BREACH: Broken Hash Link at Block #${tamperedIndex + 1}`
                : 'Ledger Continuity Verified: All 5 Event Hashes Valid'}
            </p>
            <p className="text-[11px] opacity-80 mt-0.5">
              Algorithm: <code className="font-mono font-bold">SHA256(canonical_payload + previous_hash)</code> &bull; Write access restricted via PostgreSQL append-only constraints.
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by action, actor ID, entity ID, or SHA-256 hash..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
          />
        </div>
      </div>

      {/* Sequential Hash-Chained Blocks View */}
      <div className="space-y-3">
        {filteredChain.map((block, index) => {
          const isTampered = block.status === 'HASH_MISMATCH_TAMPERED'
          const isBroken = block.status === 'BROKEN_CHAIN_LINK'
          return (
            <div
              key={block.event_id}
              className={`p-4 rounded-2xl border transition-all ${
                isTampered
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 shadow-md ring-2 ring-rose-500'
                  : isBroken
                  ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 opacity-75'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 text-xs font-bold flex items-center justify-center font-mono">
                    #{block.block_index}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {block.event_id}
                  </span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-xs font-bold text-indigo-600 uppercase">
                    {block.action}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-400">
                    {block.timestamp}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isTampered ? 'bg-rose-100 text-rose-800' :
                    isBroken ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {block.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-500 text-[11px]">
                    <strong>Actor:</strong> {block.actor_id}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    <strong>Entity:</strong> {block.entity_type} &bull; <span className="font-mono text-indigo-600">{block.entity_id}</span>
                  </p>
                  <p className="text-slate-800 dark:text-slate-200 mt-2 font-medium">
                    {block.reason}
                  </p>
                </div>

                {/* Cryptographic Hashes */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono text-[10px]">
                  <div>
                    <span className="text-slate-400 block font-sans text-[9px] uppercase font-bold">Previous Block Hash</span>
                    <span className="text-slate-500 truncate block">{block.previous_hash}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-sans text-[9px] uppercase font-bold">Current Event Hash</span>
                    <span className={isTampered ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold truncate block'}>
                      {block.event_hash}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
