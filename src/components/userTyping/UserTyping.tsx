import "./user-typing.css";

function UserTyping({ username }: { username: string }) {
  return (
    <div className="flex items-center justify-start gap-3">
      <div className="typing">
        <div className="typing__dot"></div>
        <div className="typing__dot"></div>
        <div className="typing__dot"></div>
      </div>
      <p className="text-sm capitalize text-zinc-400">
        {username} is typing message ..
      </p>
    </div>
  );
}

export default UserTyping;
