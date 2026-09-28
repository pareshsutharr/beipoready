"use client";

const LETTER_STAGGER = 0.028; // seconds per letter
const START_DELAY = 0.25;

export default function AnimatedServiceTitle({ text }: { text: string }) {
  let letterIndex = 0;

  return (
    <h1
      key={text}
      className="font-heading text-4xl sm:text-5xl font-bold text-white leading-tight mb-6"
    >
      {text.split(" ").map((word, wi, words) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((ch, ci) => {
            const delay = START_DELAY + letterIndex++ * LETTER_STAGGER;
            return (
              <span
                key={ci}
                className="svc-title-letter inline-block"
                style={{ animationDelay: `${delay}s` }}
              >
                {ch}
              </span>
            );
          })}
          {wi < words.length - 1 && " "}
        </span>
      ))}
    </h1>
  );
}
