import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

/** Validates req.body and stores the cleaned result on res.locals.body. */
export function validateBody(schema: ZodTypeAny): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body ?? {});
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0]?.toString() ?? 'form';
        if (issue.code === 'unrecognized_keys') {
          fieldErrors.form = 'The form contained unexpected fields.';
        } else if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      res.status(400).json({ message: 'Some fields need attention.', fieldErrors });
      return;
    }
    res.locals.body = result.data;
    next();
  };
}
