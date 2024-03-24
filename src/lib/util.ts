import {differenceInYears} from 'date-fns';

export function calculateAge(dob: Date) {
    return differenceInYears(new Date(), dob);
}