export default function StatCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-background p-5">

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {icon}
                {title}
            </div>

            <p className="mt-2 text-2xl font-semibold">
                {value}
            </p>

        </div>
    );
}