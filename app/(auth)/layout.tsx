import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex min-h-screen w-full justify-between font-inter">
            <div className="flex flex-col w-full">
                <div className="ml-2 mt-2">
                    <ThemeToggle onAuth={true} />
                </div>
                {children}
            </div>

            <div className="auth-asset">
                <div>
                    <Image src="/icons/auth-image.svg" alt="Auth iamge" width={500} height={500} priority className="w-auto h-auto" />
                </div>
            </div>
        </main>
    );
}