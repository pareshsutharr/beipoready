import Image from "next/image";
import { User } from "lucide-react";

// Placeholder profiles — replace with real names, titles, credentials and
// photos before launch. Do not publish this section with brackets showing.
const TEAM: {
  name: string;
  designation: string;
  credentials: string[];
  bio: string;
  photoUrl: string | null;
}[] = [
  {
    name: "[Full Name]",
    designation: "[Designation]",
    credentials: ["[CA]", "[CFA]"],
    bio: "[1–2 line bio + notable listings/awards]",
    photoUrl: null,
  },
  {
    name: "[Full Name]",
    designation: "[Designation]",
    credentials: ["[Credentials]"],
    bio: "[Bio]",
    photoUrl: null,
  },
  {
    name: "[Full Name]",
    designation: "[Designation]",
    credentials: ["[Credentials]"],
    bio: "[Bio]",
    photoUrl: null,
  },
];

export default function TeamSection() {
  return (
    <section className="w-full py-20 sm:py-28 bg-white" aria-labelledby="team-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">
            The People Behind Your Listing
          </p>
          <h2 id="team-heading" className="font-serif text-3xl sm:text-4xl font-bold text-[#0D4A6F]">
            Advisors who&rsquo;ve done this before
          </h2>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto" role="list">
          {TEAM.map((member, i) => (
            <li key={i}>
              <div
                className="flex flex-col items-center text-center rounded-2xl border border-slate-200 bg-white p-7 h-full"
                style={{ boxShadow: "0 2px 12px rgba(13,74,111,0.05)" }}
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-5 flex items-center justify-center" style={{ background: "rgba(13,74,111,0.07)" }}>
                  {member.photoUrl ? (
                    <Image src={member.photoUrl} alt={member.name} width={96} height={96} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-[#0D4A6F]/40" aria-hidden="true" />
                  )}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#0D4A6F] mb-1">{member.name}</h3>
                <p className="text-sm font-medium text-slate-600 mb-3">{member.designation}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {member.credentials.map((c) => (
                    <span
                      key={c}
                      className="text-xs font-bold text-[#B9822E] rounded-full px-3 py-1"
                      style={{ background: "#FEF3C7" }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{member.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
