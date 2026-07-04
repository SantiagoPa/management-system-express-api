import type { ErrorSchemaZod } from "../types/error-zod.type.ts";

export const formatErrrorsSchemasZod = (errors: ErrorSchemaZod) => {
    return errors.reduce<string[]>((acc, el)=>{
        acc.push(`${el.path[0]}: ${el.message}`);
        return acc;
    },[]);
}