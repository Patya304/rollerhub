import { redirect } from "next/navigation";

// A korábbi /preview/app/profile cím a saját profil demóra irányít.
export default function PreviewProfileRedirect() {
  redirect("/preview/app/profile/me");
}
