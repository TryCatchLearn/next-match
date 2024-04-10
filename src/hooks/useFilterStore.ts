import { UserFilters } from '@/types'
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type FilterState = {
    filters: UserFilters;
    setFilters: (filterName: keyof FilterState['filters'], value: any) => void;
}

const useFilterStore = create<FilterState>()(devtools((set) => ({
    filters: {
        ageRange: [18,100],
        gender: ['male', 'female'],
        orderBy: 'updated',
        withPhoto: true
    },
    setFilters: (filterName, value) => set(state => {
        return {
            filters: {...state.filters, [filterName]: value}
        }
    })
})))
 
export default useFilterStore;