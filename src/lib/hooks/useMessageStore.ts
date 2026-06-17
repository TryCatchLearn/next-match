import { create } from "zustand";
import { MessageDto } from "../types"
import { devtools } from "zustand/middleware";

type MessageState = {
    messages: MessageDto[];
    unreadCount: number;
    add: (message: MessageDto) => void;
    remove: (id: string) => void;
    set: (messages: MessageDto[]) => void;
    updateUnreadCount: (amount: number) => void;
    resetMessages: () => void;
}

export const useMessageStore = create<MessageState>()(devtools((set) => ({
    messages: [],
    unreadCount: 0,
    add: (message) => set(state => ({messages: [message, ...state.messages]}), 
        false, 'messages/add'),
    remove: (id) => set(state => ({messages: state.messages.filter(m => m.id !== id)}), 
        false, 'messages/remove'),
    set: (messages) => set(state => {
        const map = new Map([...state.messages, ...messages].map(m => [m.id, m]));
        const uniqueMessages = Array.from(map.values());
        return {messages: uniqueMessages}
    }, false, 'messages/set'),
    updateUnreadCount: (amount) => set(state => ({unreadCount: state.unreadCount + amount}), 
        false, 'messages/updateUnread'),
    resetMessages: () => set({messages: []}, false, 'messages/reset')
}), {name: 'MessageStore'}))