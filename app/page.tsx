export default function ComingSoon() {
  return (
    <div
      className="flex min-h-screen items-center justify-center 
      bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-400"
    >
      <div className="text-center px-6">
        <h1
          className="text-4xl md:text-6xl font-extrabold text-white 
          drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
        >
          Coming Soon
        </h1>

        <p className="mt-4 text-white/90 text-lg">
          We’re working on something awesome 🚀
        </p>

        <div className="mt-6 text-white text-base md:text-lg">
          <p className="font-semibold">Ajay Verma</p>

          <p className="mt-2">
            📞{" "}
            <a
              href="tel:8095240976"
              className="underline hover:text-cyan-200 transition"
            >
              +91 8095240976
            </a>
          </p>

          <p>
            📞{" "}
            <a
              href="tel:7999348733"
              className="underline hover:text-cyan-200 transition"
            >
              +91 7999348733
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
