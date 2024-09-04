export default function useRegister() {
  const register = async (
    email,
    password,
    firstname,
    lastname,
    role,
    company
  ) => {
    try {
      const config = useRuntimeConfig();
      const response = await fetch("https://datescalendar.fr/api/v1/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          APIKEY: config.public.ADMIN_API_KEY,
        },
        body: JSON.stringify({
          user: { email, password, firstname, lastname, role, company },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.error || "An unknown error occurred"
        );
      } else {
        const successData = await response.json();
        console.log(successData.message);
      }

      // Handle success response here
    } catch (error) {
      console.error(
        "There was a problem with the signup request:",
        error.message
      );
      return { success: false, error: error.message };
    }
  };
  return {
    register,
  };
}
