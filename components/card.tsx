import { cn } from "@/lib/utils";
import { cloneElement } from "react";

const cardBase = "rounded-xl border border-border";

type IconCard_T = {
  icon: React.ReactElement<{ weight?: string; className?: string }>;
  title: string;
  description?: string | number;
  className?: string;
};

export function IconCard({ icon, title, description, className }: IconCard_T) {
  return (
    <div className={cn(cardBase, "p-4 flex flex-col gap-1 items-start text-left h-full", className)}>
      <span className="mb-1">
        {cloneElement(icon, {
          weight: icon.props.weight || "light",
          className: cn("text-primitive-light", icon.props.className),
        })}
      </span>
      <div className="font-semibold text-primitive-dark">{title}</div>
      {description && <div className="text-primitive-light text-sm">{description}</div>}
    </div>
  );
}

export function HorizontalCard({
  title,
  subTitle,
  children,
  icon,
  className,
}: {
  children: React.ReactNode;
  title: string;
  subTitle: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(cardBase, "py-4 px-6 flex items-center justify-between", className)}>
      <div className="flex gap-3 items-center">
        {icon && <div className="border border-border rounded-sm p-1">{icon}</div>}
        <div>
          <div className="font-semibold">{title}</div>
          <p className="text-muted-foreground text-sm">{subTitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

export function SelectableCard({
  children,
  isSelected,
  onClick,
  className,
}: {
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        cardBase,
        "justify-between py-4 px-6 cursor-pointer",
        isSelected && "bg-primary-50 border-primary-500",
        className,
      )}
      role="button"
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(cardBase, "overflow-hidden", className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-4 py-4", className)}>{children}</div>;
}

const cardButtonBaseStyles = "w-full cursor-pointer px-4 py-3 font-semibold flex gap-2 items-center justify-center";
export function CardButton({
  className,
  href,
  onClick,
  children,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}) {
  return (
    <div className={cn("w-full border-t border-border", className)}>
      {href ? (
        <a href={href} className={cn(cardButtonBaseStyles, className)}>
          {children}
        </a>
      ) : (
        <button onClick={onClick} className={cn(cardButtonBaseStyles, className)}>
          {children}
        </button>
      )}
    </div>
  );
}
