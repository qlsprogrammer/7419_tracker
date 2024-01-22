import { withAuth } from "next-auth/middleware";

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  callbacks: {
    async authorized({ req, token }) {
      if (req.nextUrl.pathname == "/pwreset") return true;
      if (req.nextUrl.pathname.startsWith("/api/pwreset")) return true;
      if (req.nextUrl.pathname.endsWith("/signup")) return true;
      if (req.nextUrl.pathname.startsWith("/api/verify")) return true;
      if (token?.user == null) return false;
      if (req.nextUrl.pathname === "/admin") {
        return (
          (<any>token.user).role === "ADMIN" ||
          (<any>token.user).role == "SITEADMIN"
        );
      }
      if (req.nextUrl.pathname === "/siteadmin") {
        return (<any>token.user).role === "SITEADMIN";
      }
      return !!token;
    },
  },
  pages: {
    signIn: "/login",
  },
});
