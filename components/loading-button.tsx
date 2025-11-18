import { Loader2 } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { type VariantProps } from "class-variance-authority";

export type LoadingButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    children: React.ReactNode;
    isLoading: boolean;
  };

export default function LoadingButton({ children, isLoading, ...props }: LoadingButtonProps) {
  return (
    <Button {...props}>
      <div
        className={`absolute inset-0 w-full h-full flex items-center justify-center ${isLoading ? "opacity-100 z-[1]" : "opacity-0 -z-1"}`}
      >
        <Loader2 size={20} style={{ width: "20px", height: "20px" }} className="animate-spin" />
      </div>
      <span className={`${isLoading ? "opacity-0" : "opacity-100"}`}>{children}</span>
    </Button>
  );
}
