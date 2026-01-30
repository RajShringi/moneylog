import Link from "next/link";

export default function Home() {
  return (
    <div className="p-4">
      <Link href={"/dashboard"}>Dashboard</Link>
    </div>
  );
}
