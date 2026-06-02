export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-3xl border border-white/10 bg-black/50 backdrop-blur-xl p-8 text-center">
        <h1 className="text-2xl font-black tracking-tight">Kamu sedang offline</h1>
        <p className="text-zinc-300 text-sm mt-3 leading-relaxed">
          DailyQuest butuh koneksi internet untuk sinkronisasi data terbaru. Coba lagi
          saat jaringan kamu kembali normal.
        </p>
      </div>
    </main>
  );
}
