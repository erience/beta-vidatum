// utils/cookieHelper.js
export function getCookieValue(name) {
  const cookies = document.cookie.split("; ").reduce((acc, curr) => {
    const [key, value] = curr.split("=");
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
  // console.log("🚀 ~ cookies ~ document.cookie:", cookies)

  // In your case, assume the cookie holds a JSON string (e.g., '{"username": "john"}')
  if (cookies[name]) {
    try {
      const jsonString = cookies[name].replace(/^j:/, "");
      const parsedData = JSON.parse(jsonString);
      return parsedData;
    } catch (err) {
      console.error("Error parsing cookie", err);
    }
  }
  return null;
}
