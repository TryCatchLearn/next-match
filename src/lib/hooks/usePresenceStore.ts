import {create} from 'zustand';
import {devtools} from 'zustand/middleware'

type PresenceState = {
    members: string[];
    add: (id: string) => void;
    remove: (id: string) => void;
    set: (ids: string[]) => void;
}

export const usePresenceStore = create<PresenceState>()(devtools((set) => ({
    members: [],
    add: (id) => set(state => ({members: [...state.members, id]}), false, 'presence/add'),
    remove: (id) => set(state => ({members: state.members.filter(m => m !== id)}),false, 'presence/remove'),
    set: (ids) => set({members: ids}, false, 'presence/set')
}), {name: 'PresenceStore'}));