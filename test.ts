import { z } from "zod";

const schema = z.object({ name: z.string() });
const result = schema.safeParse({ name: 123 });
if (!result.success) {
  console.log("has errors:", "errors" in result.error);
  console.log("has issues:", "issues" in result.error);
}
