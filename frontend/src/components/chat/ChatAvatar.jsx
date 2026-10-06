function ChatAvatar({ user, isOnline = false, size = "md" }) {
  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";

  const sizeClasses = {
    sm: "h-10 w-10 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-14 w-14 text-lg",
  };

  return (
    <div className="relative shrink-0">
      {user?.profileImage ? (
        <img
          src={user.profileImage}
          alt={user.name || "User"}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-zinc-800 font-semibold text-white ring-1 ring-zinc-700`}
        >
          {initials}
        </div>
      )}

      <span
        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-950 ${
          isOnline ? "bg-emerald-400" : "bg-zinc-600"
        }`}
      />
    </div>
  );
}

export default ChatAvatar;
