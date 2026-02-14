import Dashboard from "@/components/dashboard";
import Protected from "@/components/protected";

export default function Home() {
  return (
    <Protected>
      <Dashboard />
    </Protected>
  );
}
