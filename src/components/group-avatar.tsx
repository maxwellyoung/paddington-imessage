import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function GroupAvatar({
  name,
  image,
  className,
}: {
  name: string;
  image?: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={cn("aspect-square", className)}>
      <AvatarImage src={image} alt={name} className="object-cover" />
      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
