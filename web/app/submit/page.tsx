import { SubmitForm } from "@/component/ui/submitForm";
import { Container } from "@/component/ui/container";

export const metadata = {
  title: "Submit Your Site — INSPOSITE",
  description:
    "Share a design portfolio, tool, or inspiration site with the INSPOSITE community.",
};

export default function SubmitPage() {
  return (
    <Container>
      <div className="min-h-[60vh] flex items-start justify-center pt-16 pb-24">
        {/* Card wrapper keeps the form feeling contained & premium */}
        <div className="w-full max-w-lg border border-slate-200 rounded-xl bg-white shadow-sm px-8 py-8">
          <SubmitForm />
        </div>
      </div>
    </Container>
  );
}
