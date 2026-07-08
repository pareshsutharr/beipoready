import Link from "next/link";

const TEAM = [
  {
    name: "Rakesh",
    role: "[Head of Fundraising]",
    image: "/teamfolder/rakesh.JPG?v=20260708",
    designation: "[Designation, e.g. Founder & Managing Director]",
    credentials: "[Credentials: CA / CFA / MBA]",
    bio: "[1–2 line bio: years of experience, area of expertise, notable listings or mandates.]",
  },
  {
    name: "Saurav",
    role: "[Founder]",
    image: "/teamfolder/saurav.JPG?v=20260708",
    designation: "[Designation, e.g. Founder & Managing Director]",
    credentials: "[Credentials: CA / CFA / MBA]",
    bio: "[1–2 line bio: years of experience, area of expertise, notable listings or mandates.]",
  },
  {
    name: "Vishwa",
    role: "[Head of IPO Advisory]",
    image: "/teamfolder/vishwa.JPG?v=20260708",
    designation: "[Designation, e.g. Founder & Managing Director]",
    credentials: "[Credentials: CA / CFA / MBA]",
    bio: "[1–2 line bio: years of experience, area of expertise, notable listings or mandates.]",
  },
];

export default function TeamSection() {
  return (
    <section className="w-full bg-brand-cream py-20 sm:py-28" aria-labelledby="team-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">
            The People Behind Your Listing
          </p>
          <h2 id="team-heading" className="font-heading text-3xl sm:text-4xl font-bold text-[#0D4A6F]">
            Advisors who&rsquo;ve done this before
          </h2>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
          {TEAM.map((member) => (
            <li key={member.name}>
              <article className="group h-full overflow-hidden rounded border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[4/5] overflow-hidden bg-brand-navy">
                  <div
                    role="img"
                    aria-label={member.name}
                    className="absolute inset-0 bg-cover bg-top transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url("${member.image}")` }}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/28 to-transparent opacity-90"
                    aria-hidden="true"
                  />
                  <Link
                    href="#"
                    aria-label={`${member.name} LinkedIn profile URL`}
                    className="absolute right-6 top-6 z-10 flex h-14 w-14 items-center justify-center rounded bg-white text-2xl font-bold text-brand-navy shadow-md transition-colors hover:bg-brand-gold"
                  >
                    in
                  </Link>
                  <div className="absolute inset-x-0 bottom-0 z-10 p-7">
                    <h3 className="font-heading text-4xl font-bold leading-none text-white">
                      {member.name}
                    </h3>
                    <p className="mt-5 font-sans text-sm font-bold uppercase tracking-[0.22em] text-brand-gold">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="p-7">
                  <p className="font-sans text-lg leading-relaxed text-slate-600">
                    {member.designation} · <br />
                    {member.credentials}
                  </p>
                  <p className="mt-7 font-sans text-lg leading-relaxed text-slate-600">
                    {member.bio}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
