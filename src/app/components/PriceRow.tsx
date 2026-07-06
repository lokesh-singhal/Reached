export default function PriceRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <p className={bold ? "font-semibold" : ""}>
        {label}
      </p>
      <p className={bold ? "font-semibold" : ""}>
        {value}
      </p>
    </div>
  );
}