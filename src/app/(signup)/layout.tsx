import Header from "@/components/Header";

export const metadata = {
  title: {
    template: "%s | AightNow",
    default: "AightNow",
  },
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`font-pretendard w-[100vw] min-h-[100vh] flex flex-col `}>
      <Header />
      {children}
    </div>
  );
}
