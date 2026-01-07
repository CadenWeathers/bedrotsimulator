import React, { useState, useEffect } from 'react';

export default function BedroomGame() {
  const [hydration, setHydration] = useState(70);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);
  const [time, setTime] = useState(new Date(2024, 0, 1, 22, 30));
  const [notifications, setNotifications] = useState(3);
  const [feed, setFeed] = useState([]);
  const [messages, setMessages] = useState([
    { from: 'Mom', text: 'Don\'t forget to drink water! 💧', time: '10:15 PM', read: false, replied: false, reply: null },
    { from: 'Best Friend', text: 'u up?', time: '10:22 PM', read: false, replied: false, reply: null },
    { from: 'Group Chat', text: 'lmaooo did you see that', time: '10:28 PM', read: false, replied: false, reply: null },
  ]);
  const [activeMessageIndex, setActiveMessageIndex] = useState(null);
  const presetReplies = ['no', 'go away', 'yes id love that'];
  const [batteryLevel, setBatteryLevel] = useState(67);
  const [isCharging, setIsCharging] = useState(false);
  const [comfort, setComfort] = useState(85);
  const [position, setPosition] = useState('back');

  const socialPosts = [
    { user: 'cozy_nights', content: 'nothing beats staying in bed all weekend 🛏️', likes: 234 },
    { user: 'hydration_nation', content: 'reminder to drink water besties', likes: 1.2 },
    { user: 'sleepy.vibes', content: 'who else doom scrolling at 2am', likes: 892 },
    { user: 'comfort_zone', content: 'my bed is my best friend', likes: 445 },
    { user: 'late.night.thoughts', content: 'why do we only get sleepy when we have things to do', likes: 2.3 },
    { user: 'pillow_talk', content: 'just flipped to the cold side of the pillow >>>>', likes: 1.8 },
    { user: 'blanket_burrito', content: 'successfully cocooned. not moving for hours', likes: 567 },
    { user: 'midnight_snacker', content: 'debating if i should get up for a snack', likes: 723 },
  ];

  useEffect(() => {
    // Generate initial feed
    const shuffled = [...socialPosts].sort(() => Math.random() - 0.5);
    setFeed(shuffled);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && phoneOpen) {
        setPhoneOpen(false);
        setCurrentApp(null);
        setActiveMessageIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phoneOpen]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => new Date(prev.getTime() + 60000));
      setHydration(prev => Math.max(0, prev - 0.5));
      if (phoneOpen && !isCharging) {
        setBatteryLevel(prev => Math.max(0, prev - 0.3));
      }
      if (isCharging) {
        setBatteryLevel(prev => Math.min(100, prev + 2));
      }
      // Random notification
      if (Math.random() < 0.1) {
        setNotifications(prev => prev + 1);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [phoneOpen, isCharging]);

  const drinkWater = () => {
    setHydration(prev => Math.min(100, prev + 25));
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const refreshFeed = () => {
    const shuffled = [...socialPosts].sort(() => Math.random() - 0.5);
    setFeed(shuffled);
  };

  const changePosition = () => {
    const positions = ['back', 'left side', 'right side', 'stomach'];
    const currentIndex = positions.indexOf(position);
    const nextIndex = (currentIndex + 1) % positions.length;
    setPosition(positions[nextIndex]);
    setComfort(Math.min(100, comfort + 10));
  };

  const readMessage = (index) => {
    setMessages(prev => prev.map((m, i) => i === index ? { ...m, read: true } : m));
    setNotifications(prev => Math.max(0, prev - 1));
    setActiveMessageIndex(index);
  };

  const sendReply = (messageIndex, reply) => {
    setMessages(prev => prev.map((m, i) => 
      i === messageIndex ? { ...m, replied: true, reply: reply } : m
    ));
    setActiveMessageIndex(null);
  };

  // Phone UI
  const PhoneScreen = () => {
    if (!phoneOpen) return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
        <div className="w-72 h-[500px] bg-gray-900 rounded-3xl p-2 shadow-2xl border-4 border-gray-800">
          <div className="w-full h-full bg-gray-100 rounded-2xl overflow-hidden flex flex-col">
            {/* Status bar */}
            <div className="bg-gray-200 px-4 py-1 flex justify-between items-center text-xs text-gray-600">
              <span>{formatTime(time)}</span>
              <div className="flex items-center gap-2">
                {isCharging && <span className="text-green-500">⚡</span>}
                <span className={batteryLevel < 20 ? 'text-red-500' : ''}>{Math.round(batteryLevel)}%</span>
              </div>
            </div>

            {/* App content */}
            <div className="flex-1 overflow-hidden">
              {currentApp === null && (
                <div className="h-full bg-gradient-to-b from-indigo-900 to-purple-900 p-4">
                  <button 
                    onClick={() => setPhoneOpen(false)}
                    className="absolute top-12 right-4 text-white/70 hover:text-white text-xl"
                  >
                    ✕
                  </button>
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    <button onClick={() => setCurrentApp('social')} className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-400 rounded-xl flex items-center justify-center text-white text-xl relative">
                        📱
                        {notifications > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">{notifications}</span>
                        )}
                      </div>
                      <span className="text-white text-xs mt-1">Social</span>
                    </button>
                    <button onClick={() => setCurrentApp('messages')} className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white text-xl relative">
                        💬
                        {messages.filter(m => !m.read).length > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">{messages.filter(m => !m.read).length}</span>
                        )}
                      </div>
                      <span className="text-white text-xs mt-1">Messages</span>
                    </button>
                    <button onClick={() => setCurrentApp('weather')} className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl">
                        🌙
                      </div>
                      <span className="text-white text-xs mt-1">Weather</span>
                    </button>
                    <button onClick={() => setCurrentApp('music')} className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white text-xl">
                        🎵
                      </div>
                      <span className="text-white text-xs mt-1">Music</span>
                    </button>
                  </div>
                </div>
              )}

              {currentApp === 'social' && (
                <div className="h-full bg-white flex flex-col">
                  <div className="bg-gradient-to-r from-pink-500 to-orange-400 p-3 flex justify-between items-center">
                    <button onClick={() => setCurrentApp(null)} className="text-white">←</button>
                    <span className="text-white font-bold">Feed</span>
                    <button onClick={refreshFeed} className="text-white text-sm">↻</button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {feed.map((post, i) => (
                      <div key={i} className="p-3 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full" />
                          <span className="font-medium text-sm">{post.user}</span>
                        </div>
                        <p className="text-sm text-gray-700">{post.content}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span>❤️ {typeof post.likes === 'number' ? post.likes : `${post.likes}k`}</span>
                          <span>💬 {Math.floor(Math.random() * 50)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentApp === 'messages' && (
                <div className="h-full bg-white flex flex-col">
                  <div className="bg-green-500 p-3 flex items-center gap-3">
                    <button onClick={() => { setCurrentApp(null); setActiveMessageIndex(null); }} className="text-white">←</button>
                    <span className="text-white font-bold">Messages</span>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {activeMessageIndex !== null ? (
                      // Conversation view
                      <div className="flex flex-col h-full">
                        <div className="p-3 border-b border-gray-200 bg-gray-50">
                          <button 
                            onClick={() => setActiveMessageIndex(null)}
                            className="text-green-500 text-sm mb-2"
                          >
                            ← Back to messages
                          </button>
                          <div className="font-medium">{messages[activeMessageIndex].from}</div>
                        </div>
                        <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                          {/* Their message */}
                          <div className="flex justify-start">
                            <div className="bg-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%]">
                              <p className="text-sm">{messages[activeMessageIndex].text}</p>
                              <p className="text-xs text-gray-500 mt-1">{messages[activeMessageIndex].time}</p>
                            </div>
                          </div>
                          {/* Your reply if sent */}
                          {messages[activeMessageIndex].replied && (
                            <div className="flex justify-end">
                              <div className="bg-green-500 text-white rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%]">
                                <p className="text-sm">{messages[activeMessageIndex].reply}</p>
                                <p className="text-xs text-green-200 mt-1">Delivered</p>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Reply options */}
                        {!messages[activeMessageIndex].replied && (
                          <div className="p-3 border-t border-gray-200 bg-gray-50">
                            <p className="text-xs text-gray-500 mb-2">Quick replies:</p>
                            <div className="flex flex-col gap-2">
                              {presetReplies.map((reply, i) => (
                                <button
                                  key={i}
                                  onClick={() => sendReply(activeMessageIndex, reply)}
                                  className="bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-3 rounded-full transition"
                                >
                                  {reply}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Message list view
                      messages.map((msg, i) => (
                        <button 
                          key={i} 
                          onClick={() => readMessage(i)}
                          className={`w-full p-3 border-b border-gray-100 text-left ${!msg.read ? 'bg-green-50' : ''}`}
                        >
                          <div className="flex justify-between items-center">
                            <span className={`font-medium ${!msg.read ? 'text-black' : 'text-gray-600'}`}>{msg.from}</span>
                            <span className="text-xs text-gray-400">{msg.time}</span>
                          </div>
                          <p className={`text-sm ${!msg.read ? 'text-gray-700' : 'text-gray-400'}`}>{msg.text}</p>
                          {msg.replied && (
                            <p className="text-xs text-green-500 mt-1">✓ Replied: "{msg.reply}"</p>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {currentApp === 'weather' && (
                <div className="h-full bg-gradient-to-b from-indigo-900 to-blue-900 flex flex-col items-center justify-center text-white p-4">
                  <button onClick={() => setCurrentApp(null)} className="absolute top-12 left-4 text-white">←</button>
                  <div className="text-6xl mb-4">🌙</div>
                  <div className="text-5xl font-light mb-2">62°</div>
                  <div className="text-lg opacity-80">Clear Night</div>
                  <div className="mt-8 text-sm opacity-60">Perfect weather for staying in bed</div>
                </div>
              )}

              {currentApp === 'music' && (
                <div className="h-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center text-white p-4">
                  <button onClick={() => setCurrentApp(null)} className="absolute top-12 left-4 text-white">←</button>
                  <div className="w-40 h-40 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg mb-6 flex items-center justify-center text-6xl">
                    🎧
                  </div>
                  <div className="text-lg font-medium">lofi beats to chill to</div>
                  <div className="text-sm opacity-60 mb-6">Cozy Vibes Radio</div>
                  <div className="flex items-center gap-8 text-2xl">
                    <button className="opacity-60 hover:opacity-100">⏮</button>
                    <button className="w-12 h-12 bg-white text-gray-900 rounded-full flex items-center justify-center">▶</button>
                    <button className="opacity-60 hover:opacity-100">⏭</button>
                  </div>
                </div>
              )}
            </div>

            {/* Home indicator */}
            <div className="bg-gray-200 py-2 flex justify-center">
              <button 
                onClick={() => {
                  if (currentApp) {
                    setCurrentApp(null);
                    setActiveMessageIndex(null);
                  } else {
                    setPhoneOpen(false);
                  }
                }}
                className="w-24 h-1 bg-gray-400 rounded-full hover:bg-gray-500 transition"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-screen bg-gray-900 overflow-hidden relative select-none">
      {/* Room background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Window with moonlight */}
        <div className="absolute top-8 right-8 w-32 h-48 bg-indigo-950 rounded border-4 border-slate-700">
          <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-100 rounded-full opacity-80 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 to-transparent" />
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-700" />
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-700" />
        </div>
        {/* Stars outside */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{ 
              top: `${Math.random() * 30}%`, 
              right: `${Math.random() * 20 + 5}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Bed */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[600px]">
        {/* Headboard */}
        <div className="absolute -top-24 left-4 right-4 h-28 bg-amber-800 rounded-t-xl border-4 border-amber-900">
          {/* Headboard decoration */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-amber-700 rounded-lg" />
        </div>
        
        {/* Bed frame sides */}
        <div className="absolute top-0 -left-2 w-4 h-full bg-amber-800 rounded-l-lg" />
        <div className="absolute top-0 -right-2 w-4 h-full bg-amber-800 rounded-r-lg" />
        
        {/* Mattress */}
        <div className="relative bg-slate-100 h-72 rounded-lg mx-2 border-4 border-slate-300 overflow-hidden">
          {/* Mattress texture */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute w-full h-px bg-slate-400" style={{ top: `${i * 20 + 10}%` }} />
            ))}
          </div>
          
          {/* Sheets layer */}
          <div className="absolute inset-0 bg-slate-50" />
          
          {/* Pillow */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-52 h-24 bg-white rounded-2xl shadow-lg border-2 border-slate-200">
            {/* Pillow indent */}
            <div className="absolute inset-4 bg-slate-50 rounded-xl" />
          </div>
          
          {/* Goose */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10">
            {/* Goose body */}
            <div className="relative">
              {/* Neck */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-6 h-14 bg-white rounded-full shadow-md" />
              {/* Head */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-md">
                {/* Beak */}
                <div className="absolute top-4 -right-3 w-6 h-3 bg-orange-400 rounded-r-full shadow-sm" />
                {/* Eye */}
                <div className="absolute top-3 left-5 w-2 h-2 bg-black rounded-full" />
              </div>
              {/* Body - hidden under blanket, just showing top */}
              <div className="w-24 h-10 bg-white rounded-t-full shadow-md" />
            </div>
          </div>
          
          {/* Blanket */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-indigo-500 via-indigo-400 to-indigo-300 rounded-b-lg">
            {/* Blanket fold at top */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-indigo-200 rounded-t-lg" />
            {/* Blanket texture lines */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="absolute h-px bg-indigo-100" style={{ top: `${i * 10 + 15}%`, left: '3%', right: '3%' }} />
              ))}
            </div>
            {/* Blanket lump for body */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 h-28 bg-indigo-400 rounded-full opacity-50" />
          </div>
        </div>
        
        {/* Bed frame bottom */}
        <div className="h-10 bg-amber-800 rounded-b-xl mx-0 border-4 border-t-0 border-amber-900" />
        
        {/* Bed legs */}
        <div className="absolute -bottom-6 left-4 w-6 h-8 bg-amber-900 rounded-b-lg" />
        <div className="absolute -bottom-6 right-4 w-6 h-8 bg-amber-900 rounded-b-lg" />
      </div>

      {/* Nightstand with water */}
      <div className="absolute bottom-20 left-16">
        <div className="w-20 h-24 bg-amber-800 rounded">
          {/* Lamp */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            <div className="w-12 h-12 bg-yellow-100/80 rounded-full blur-sm" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1 h-8 bg-amber-600" />
          </div>
          {/* Water glass */}
          <button 
            onClick={drinkWater}
            className="absolute -top-8 right-2 w-8 h-10 bg-blue-200/60 rounded border-2 border-blue-300/60 hover:scale-110 transition-transform cursor-pointer"
          >
            <div 
              className="absolute bottom-0 left-0 right-0 bg-blue-400/60 rounded-b transition-all"
              style={{ height: `${hydration}%` }}
            />
          </button>
        </div>
      </div>

      {/* Phone charging cable visual */}
      {isCharging && (
        <div className="absolute bottom-48 right-32 w-px h-20 bg-white/30" />
      )}

      {/* Phone Screen Overlay */}
      <PhoneScreen />

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        {/* Stats */}
        <div className="bg-gray-800/80 rounded-lg p-3 space-y-2 backdrop-blur">
          <div className="text-white text-lg font-medium">{formatTime(time)}</div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">💧</span>
            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${hydration < 30 ? 'bg-red-500' : 'bg-blue-400'}`}
                style={{ width: `${hydration}%` }}
              />
            </div>
            <span className="text-white text-xs">{Math.round(hydration)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">😊</span>
            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400 transition-all"
                style={{ width: `${comfort}%` }}
              />
            </div>
            <span className="text-white text-xs">{Math.round(comfort)}%</span>
          </div>
          <div className="text-gray-400 text-xs">Position: {position}</div>
        </div>

        {/* Controls hint */}
        <div className="bg-gray-800/80 rounded-lg p-3 text-white text-sm backdrop-blur">
          <div className="font-medium mb-2">Actions</div>
          <div className="space-y-1 text-gray-300 text-xs">
            <div>• Click water glass to drink</div>
            <div>• Click bed to use phone</div>
            <div>• Click buttons to interact</div>
          </div>
        </div>
      </div>

      {/* Bottom action buttons */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        <button 
          onClick={() => setPhoneOpen(true)}
          className="bg-gray-800/90 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur transition"
        >
          📱 Check Phone
          {notifications > 0 && (
            <span className="bg-red-500 text-xs px-1.5 py-0.5 rounded-full">{notifications}</span>
          )}
        </button>
        <button 
          onClick={drinkWater}
          className="bg-blue-600/90 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur transition"
        >
          💧 Drink Water
        </button>
        <button 
          onClick={changePosition}
          className="bg-purple-600/90 hover:bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur transition"
        >
          🔄 Change Position
        </button>
        <button 
          onClick={() => setIsCharging(!isCharging)}
          className={`${isCharging ? 'bg-green-600/90 hover:bg-green-500' : 'bg-gray-800/90 hover:bg-gray-700'} text-white px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur transition`}
        >
          🔌 {isCharging ? 'Unplug' : 'Charge Phone'}
        </button>
      </div>

      {/* Low hydration warning */}
      {hydration < 30 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500/90 text-white px-6 py-3 rounded-lg animate-pulse z-30">
          💧 Getting thirsty... drink some water!
        </div>
      )}
    </div>
  );
}
