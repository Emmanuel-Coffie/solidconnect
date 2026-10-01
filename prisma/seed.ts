import { mutate } from "../src/lib/store";
import { hash } from "bcryptjs";
async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    if (password.length < 14)
      throw new Error("Use an admin password of at least 14 characters.");
    const passwordHash = await hash(password, 12);
    await mutate((s) => {
      if (!s.users.some((x) => x.email === email.toLowerCase()))
        s.users.push({
          id: crypto.randomUUID(),
          name: "Solid Connect Admin",
          email: email.toLowerCase(),
          passwordHash,
          accountType: "Business",
          role: "ADMIN",
        });
    });
    console.log("Admin account provisioned.");
  } else {
    await mutate(() => {});
    console.log(
      "Demo catalogue initialized. Set ADMIN_EMAIL and ADMIN_PASSWORD to provision an administrator.",
    );
  }
}
main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
