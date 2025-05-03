import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function CopyWithTick({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <span onClick={handleCopy} className="  active:scale-95">
      {copied ? <Check className="size-4 " /> : <Copy className="size-4" />}
    </span>
  );
}
