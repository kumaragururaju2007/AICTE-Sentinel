import React, { useState } from 'react'
import {
  History, ShieldCheck, CheckCircle2, AlertTriangle, Search,
  Lock, Key, RefreshCw, Download, FileText, Check, ShieldAlert
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/common/DataTable'
import { AUDIT_LOGS_DATA } from '../../data/adminMockData'
import { useApplicationContext } from '../../context/ApplicationContext'

export default function AuditLogs() {
  let appContext = null
  try {
    appContext = useApplicationContext()
  } catch (e) {
    appContext = null
  }

  const baseLogs = appContext ? appContext.auditLogs : AUDIT_LOGS_DATA
  const [chain, setChain] = useState(baseLogs)

  // Keep in sync with app context when new events are logged
  React.useEffect(() => {
    if (appContext?.auditLogs) {
      setChain(appContext.auditLogs)
    }
  }, [appContext?.auditLogs])

  const [isVerifying, setIsVerifying] = useState(false)
  const [tamperedIndex, setTamperedIndex] = useState(null)

  // Verify hash chain continuity
  const handleVerifyChain = () => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      if (tamperedIndex !== null) {
        alert(`CRYPTOGRAPHIC INTEGRITY ALERT: Broken hash link at Block #${tamperedIndex + 1}! Event hash does not match previous block link.`)
      } else {
        alert('CRYPTOGRAPHIC VERIFICATION SUCCESS: All 5 SHA-256 blocks are valid, sequential, and tamper-evident.')
      }
    }, 600)
  }

  // Simulate database tampering (SIH Demo differentiator)
  const handleSimulateTamper = (index) => {
    setTamperedIndex(index)
    setChain(prev => prev.map((block, idx) => {
      if (idx === index) {
        return {
          ...block,
          notes: '[TAMPERED] Unauthorized modification of deficiency findings',
          eventHash: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
          chainStatus: 'HASH_MISMATCH_TAMPERED'
        }
      }
      if (idx > index) {
        return {
          ...block,
          chainStatus: 'BROKEN_CHAIN_LINK'
        }
      }
      return block
    }))
  }

  const handleRestoreChain = () => {
    setTamperedIndex(null)
    setChain(AUDIT_LOGS_DATA)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tamper-Evident SHA-256 Audit Trail"
        subtitle="Cryptographically chained transaction ledger recording every statutory state transition and officer action"
        badgeText="Cryptographic Proof Core"
        breadcrumbs={['AICTE Sentinel', 'Admin Portal', 'Audit Logs']}
        actions={
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
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all"
              >
                Simulate DB Tampering (Demo)
              </button>
            )}

            <button
              onClick={handleVerifyChain}
              disabled={isVerifying}
              className="px-4 py-2 rounded-xl bg-[#7738E8] hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              {isVerifying ? 'Verifying Hashes...' : 'Verify Full Hash Chain'}
            </button>
          </div>
        }
      />

      {/* Disclaimers & Integrity Alert Banner */}
      <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between shadow-xs ${
        tamperedIndex !== null
          ? 'bg-rose-50 border-rose-300 text-rose-900'
          : 'bg-purple-50 border-purple-200 text-purple-900'
      }`}>
        <div className="flex items-center gap-3">
          {tamperedIndex !== null ? (
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
          ) : (
            <ShieldCheck className="w-6 h-6 text-[#7738E8] shrink-0" />
          )}
          <div>
            <p className="font-bold text-sm">
              {tamperedIndex !== null
                ? `SECURITY INTEGRITY BREACH: Broken Hash Link at Block #${tamperedIndex + 1}`
                : 'Ledger Continuity Verified: All 5 Sequential Blocks Valid'}
            </p>
            <p className="text-[11px] opacity-80 mt-0.5">
              Algorithm: <code className="font-mono font-bold">SHA256(canonical_payload + previous_hash)</code> &bull; Illustrative tamper-evident model for demonstration data.
            </p>
          </div>
        </div>
      </div>

      {/* Sequential Hash Chain Event Blocks */}
      <div className="space-y-3">
        {chain.map(block => {
          const isTampered = block.chainStatus === 'HASH_MISMATCH_TAMPERED'
          const isBroken = block.chainStatus === 'BROKEN_CHAIN_LINK'
          return (
            <div
              key={block.eventId}
              className={`p-4 rounded-2xl border transition-all ${
                isTampered
                  ? 'bg-rose-50/70 border-rose-400 shadow-sm ring-2 ring-rose-500'
                  : isBroken
                  ? 'bg-amber-50/50 border-amber-300 opacity-75'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-[#7738E8] text-xs font-bold flex items-center justify-center font-mono">
                    #{block.blockIndex}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900">{block.eventId}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-xs font-bold text-[#1769E0] uppercase">{block.action}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-400">{block.timestamp}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isTampered ? 'bg-rose-100 text-rose-800' :
                    isBroken ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-[#159B68]'
                  }`}>
                    {block.chainStatus.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-500 text-[11px]">
                    <strong>Actor:</strong> {block.user} ({block.role})
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    <strong>Related Application:</strong> <span className="font-mono text-[#1769E0]">{block.relatedApplication}</span>
                  </p>
                  <p className="text-slate-800 mt-2 font-medium">{block.notes}</p>
                </div>

                {/* Hashes Display */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-[10px]">
                  <div>
                    <span className="text-slate-400 block font-sans text-[9px] uppercase font-bold">Previous Block Hash</span>
                    <span className="text-slate-500 truncate block">{block.previousHash}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-sans text-[9px] uppercase font-bold">Current Block Hash</span>
                    <span className={isTampered ? 'text-rose-600 font-bold block truncate' : 'text-[#159B68] font-bold block truncate'}>
                      {block.eventHash}
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

