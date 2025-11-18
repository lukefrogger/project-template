import { GlobalStoreProps } from "@/stores/global-store";
import { GlobalStoreInitializer } from "@/providers/global-store-initializer";

export default async function Layout({ children }: { children: React.ReactNode | React.ReactNode[] }) {
  const contact = await getGlobalStoreDetails();

  return (
    <AuthenticatedAppLayout>
      <GlobalStoreInitializer contact={contact as GlobalStoreProps | null} />
      {/* Sidebar? */}
      {children}
    </AuthenticatedAppLayout>
  );
}
