import { Toaster } from "react-hot-toast";
import ThemeProvider from "@/components/providers/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          },
          success: {
            icon: "🎉",
          },
        }}
      />
    </ThemeProvider>
  );
}
