import Image from "next/image";
import Link from "next/link";

export default function Logo({ size = "md", variant = "dark" }) {
  const sizes = {
    sm: { icon: 28, text: "text-base" },
    md: { icon: 36, text: "text-xl" },
    lg: { icon: 48, text: "text-2xl" },
  };
  const s = sizes[size] || sizes.md;
  const textColor = variant === "light" ? "text-gray-900" : "text-white";

  return (
    <Link href="/" className="flex items-center gap-2.5 select-none">
      <Image
        src="/logo.png"
        alt="Ummed logo belgisi"
        width={s.icon}
        height={Math.round(s.icon * 1.08)}
        className="object-contain flex-shrink-0"
        priority
      />
      <span className={`${s.text} font-medium ${textColor} tracking-tight`}>
        Ummed
      </span>
    </Link>
  );
}
