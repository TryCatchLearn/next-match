import { differenceInYears } from "date-fns";

export function calculateAge(dob: string | Date) {
    return differenceInYears(new Date(), new Date(dob));
}