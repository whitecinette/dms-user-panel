export const AUTH_KEYS = [
  "token",
  "refreshToken",
  "role",
  "code",
  "name",
  "position",
  "userId",
  "toolpad-mode",
  "toolpad-color-scheme-dark",
];

export const clearAuthStorage = () => {
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
};

// optional helper if ever needed
export const preserveWebDeviceIdAndClearAuth = () => {
  const webDeviceId = localStorage.getItem("webDeviceId");
  clearAuthStorage();
  if (webDeviceId) {
    localStorage.setItem("webDeviceId", webDeviceId);
  }
};