// TEMP route to bootstrap the admin user. Delete after first use.
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_EMAIL = "nutriservidor@gmail.com";
const ADMIN_PASSWORD = "@Nto2026";

export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      GET: async () => {
        // Try create user; if exists, fetch it
        let userId: string | null = null;
        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          email_confirm: true,
        });
        if (created?.user) {
          userId = created.user.id;
        } else if (createErr) {
          // user likely exists — list and find
          const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
          const found = list?.users.find((u) => u.email === ADMIN_EMAIL);
          if (found) {
            userId = found.id;
            // ensure password is set
            await supabaseAdmin.auth.admin.updateUserById(found.id, {
              password: ADMIN_PASSWORD,
              email_confirm: true,
            });
          }
        }

        if (!userId) {
          return new Response(
            JSON.stringify({ ok: false, error: createErr?.message ?? "no user" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        const { error: roleErr } = await supabaseAdmin
          .from("user_roles")
          .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

        return new Response(
          JSON.stringify({ ok: !roleErr, userId, roleErr: roleErr?.message }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      },
    },
  },
});
