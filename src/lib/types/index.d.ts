import { $ZodIssue } from "zod/v4/core";

type ActionResult<T> = {status: 'success', data: T} 
    | {status: 'error', error: string | $ZodIssue[]}