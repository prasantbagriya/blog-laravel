import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, X, Users, Loader2 } from 'lucide-react';

export default function CommunityChat({ community, auth, onClose }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        // Fetch existing messages
        axios.get(`/community/${community.id}/chat/messages`)
            .then(res => {
                setMessages(res.data);
                setIsLoading(false);
                setTimeout(scrollToBottom, 100);
            })
            .catch(err => {
                console.error("Error fetching messages", err);
                setIsLoading(false);
            });

        if (auth?.user && window.Echo) {
            // Join Presence Channel
            const channel = window.Echo.join(`community.${community.id}`);

            channel.here((users) => {
                setOnlineUsers(users);
            })
            .joining((user) => {
                setOnlineUsers(prev => {
                    if (!prev.find(u => u.id === user.id)) {
                        return [...prev, user];
                    }
                    return prev;
                });
            })
            .leaving((user) => {
                setOnlineUsers(prev => prev.filter(u => u.id !== user.id));
            })
            .listen('MessageSent', (e) => {
                setMessages(prev => [...prev, e.message]);
                setTimeout(scrollToBottom, 100);
            });

            return () => {
                window.Echo.leave(`community.${community.id}`);
            };
        }
    }, [community.id, auth]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !auth?.user) return;

        const tempMessage = {
            id: Date.now(),
            community_id: community.id,
            user_id: auth.user.id,
            message: newMessage,
            user: {
                id: auth.user.id,
                username: auth.user.username,
                name: auth.user.name
            },
            created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, tempMessage]);
        setNewMessage('');
        setTimeout(scrollToBottom, 100);

        axios.post(`/community/${community.id}/chat/messages`, { message: newMessage.trim() })
            .then(res => {
                // Optionally replace temp message with actual message from server
                setMessages(prev => prev.map(m => m.id === tempMessage.id ? res.data : m));
            })
            .catch(err => {
                console.error("Error sending message", err);
                // remove temp message on error
                setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
            });
    };

    return (
        <div className="fixed bottom-0 right-4 w-[350px] h-[500px] bg-white rounded-t-lg shadow-2xl border border-[#EDEFF1] flex flex-col z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-[#0079D3] text-white p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="font-bold">r/{community.name} Chat</div>
                    <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                        <Users size={12} /> {onlineUsers.length}
                    </div>
                </div>
                <button onClick={onClose} className="hover:bg-white/20 rounded p-1 transition-colors">
                    <X size={18} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#F6F7F8] flex flex-col gap-3">
                {isLoading ? (
                    <div className="flex-1 flex justify-center items-center text-[#878A8C]">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex-1 flex justify-center items-center text-[#878A8C] text-sm text-center">
                        Welcome to the live chat!<br/>Be the first to say hello.
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = auth?.user?.id === msg.user_id;
                        const showHeader = idx === 0 || messages[idx - 1].user_id !== msg.user_id;

                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                {showHeader && !isMe && (
                                    <span className="text-xs font-bold text-[#878A8C] mb-1 ml-1">{msg.user?.username || msg.user?.name || 'Unknown'}</span>
                                )}
                                <div 
                                    className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                                        isMe 
                                            ? 'bg-[#0079D3] text-white rounded-tr-sm' 
                                            : 'bg-white text-[#1C1C1C] border border-[#EDEFF1] rounded-tl-sm'
                                    }`}
                                >
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-[#EDEFF1]">
                {auth?.user ? (
                    <form onSubmit={sendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Message..."
                            className="flex-1 bg-[#F6F7F8] border border-transparent focus:border-[#0079D3] rounded-full py-2 px-4 text-sm outline-none transition-colors"
                        />
                        <button 
                            type="submit" 
                            disabled={!newMessage.trim()}
                            className="p-2 bg-[#0079D3] text-white rounded-full hover:bg-[#005EAC] disabled:opacity-50 disabled:hover:bg-[#0079D3] transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                ) : (
                    <div className="text-center text-sm text-[#878A8C] py-2">
                        <a href="/login" className="text-[#0079D3] hover:underline font-bold">Log in</a> to join the chat
                    </div>
                )}
            </div>
        </div>
    );
}
