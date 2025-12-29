"use client";
import { useUser } from "@clerk/nextjs";

export default function ComingSoon() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <div
      className="flex min-h-screen items-center justify-center
      bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-400"
    >
      <div className="text-center px-6 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white">
          {user?.firstName} {user?.lastName}
        </h1>
        <h1
          className="text-4xl md:text-6xl font-extrabold text-white
          drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
        >
          IMO Gaming Arena
        </h1>

        <p className="mt-4 text-white/90 text-lg">
          A premium gaming destination offering high-end PC & console gaming,
          competitive eSports matches, and an immersive gaming atmosphere 🎮🔥
        </p>

        <div className="mt-6 text-white text-base md:text-lg space-y-3">
          <p className="font-semibold">Ajay Verma</p>

          <p>
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

          <p className="pt-2 text-white/90">
            📍 <span className="font-semibold">Address:</span>
            <br />
            Shop A-5, Gurudatta Chaupati, Mhalunge - Nande Rd, Opp. VTP Sales
            Office, Pune, Maharashtra 411045
          </p>

          <ul className="mt-4 list-disc list-inside text-left text-white/90">
            <li>High-end PC & Console Gaming</li>
            <li>PS5 & Competitive Multiplayer Games</li>
            <li>eSports Tournaments & Events</li>
            <li>High-Speed Internet & Comfortable Setup</li>
            <li>Friendly & Family-Friendly Gaming Zone</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
