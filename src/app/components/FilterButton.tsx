export default function FilterButton({
    children,
    active,
    onClick,
}: {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex h-9 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition ${active
                    ? "bg-foreground text-background"
                    : "hover:bg-muted"
                }`}
        >
            {children}
        </button>
    );
}