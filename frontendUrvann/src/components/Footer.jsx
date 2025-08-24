export default function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-sm text-emerald-900/80">
          © {new Date().getFullYear()} GreenNest. Grow with love 🌱
        </p>
        <p className="text-xs text-emerald-800/70">
          Built by @vibhuRathore
        </p>
      </div>
    </footer>
  );
}
