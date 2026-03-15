import Image from "next/image";

export function ProfilePicture({
  src,
  alt = "Profile picture",
}: {
  src?: string | null;
  alt?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={104}
        height={104}
        className="h-[104px] w-[104px] rounded-[28px] border border-white/10 object-cover"
      />
    );
  }

  return (
    <div className="flex h-[104px] w-[104px] items-center justify-center rounded-[28px] border border-white/10 bg-gradient-to-br from-accent/25 via-white/10 to-sky-400/25 text-3xl font-semibold text-text">
      PP
    </div>
  );
}

