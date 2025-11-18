import { ResetPasswordForm } from "@/components/features/auth/reset-password-form";

export default async function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white relative">
      <main className="grid grid-cols-1 md:grid-cols-2 h-screen">
        <div className="p-8 flex items-center justify-center w-full h-full">
          <div className="absolute top-6 left-6 z-10">
            {/* <Image src={logo} alt="logo" height={68} width={270} priority /> */}
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden w-full max-w-md ">
            <div className="py-4 px-6 border-b border-neutral-200">
              <h1 className="text-2xl font-semibold text-neutral-600 ">Password</h1>
            </div>
            <div className="px-4 pt-6 pb-4">
              <ResetPasswordForm />
            </div>
          </div>
        </div>
        <div className="h-full pr-8 pb-8 pt-8">
          <div className="h-full w-full relative rounded-xl overflow-hidden">
            {/* <Image
              src={coolImage}
              alt="cool image"
              className="object-cover object-left"
              fill
              priority
            /> */}
          </div>
        </div>
      </main>
    </div>
  );
}
