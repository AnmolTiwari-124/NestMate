 function Chat() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      
      <div className="bg-zinc-900 w-[500px] h-[650px] rounded-2xl border border-zinc-800 flex flex-col">
        
        {/* Header */}
        <div className="border-b border-zinc-800 p-5 text-xl font-semibold">
          💬 Private Chat
        </div>

        {/* Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          
          <div className="bg-zinc-800 w-fit px-4 py-2 rounded-2xl">
            Hello 👋
          </div>

          <div className="bg-white text-black w-fit ml-auto px-4 py-2 rounded-2xl">
            Hi there 🚀
          </div>

        </div>

        {/* Input */}
        <div className="border-t border-zinc-800 p-4 flex gap-3">
          
          <input
            type="text"
            placeholder="Type message..."
            className="flex-1 bg-zinc-800 rounded-full px-4 py-3 outline-none"
          />

          <button className="bg-white text-black px-5 rounded-full font-semibold">
            Send
          </button>

        </div>
      </div>
    </div>
  );
}

export default Chat;