
"use client";

const IndexPage = () => {
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/generateAuthUrl", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch the Auth URL");
      }

      const data = await res.json();

      if (data.url) {
        console.log("Redirecting to:", data.url);
        // Redirect to the URL
        window.location.href = data.url;
      } else {
        console.error("No URL returned from the API");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
      <h1>Login with Google</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default IndexPage;
