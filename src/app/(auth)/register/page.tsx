import { WalletCards, ShieldCheck, Sparkles, UserPlus } from "lucide-react"
import { AuthLayout } from "@/components/auth/auth-layout"
import RegisterForm from "./register-form"

export const dynamic = "force-dynamic"

export default function RegisterPage() {
  return (
    <AuthLayout
      brandHeading={
        <>
          Start tracking revenue.<br />
          <span className="text-blue-400">Grow with confidence.</span>
        </>
      }
      brandDescription="Create your QBIX workspace to manage revenue, set financial targets, streamline approvals, and access intelligent business insights."
      benefits={[
        {
          icon: <WalletCards className="h-5 w-5 text-blue-300" />,
          text: "Multi-currency reporting",
        },
        {
          icon: <ShieldCheck className="h-5 w-5 text-blue-300" />,
          text: "Secure team collaboration",
        },
        {
          icon: <Sparkles className="h-5 w-5 text-blue-300" />,
          text: "Executive reporting",
        },
      ]}
      previewCard={{
        title: "Everything your team needs",
        items: [
          "Revenue tracking",
          "Goal management",
          "Approval workflows",
          "Financial reporting",
        ],
      }}
      cardIcon={<UserPlus className="h-6 w-6" />}
      title="Create your account"
      description="Start managing your organization’s revenue with QBIX."
    >
      <RegisterForm />
    </AuthLayout>
  )
}
