export const msalConfig = {
  auth: {
    clientId: "67ca8b3d-a34f-47bc-8b7d-3310daaa7c76",
    authority:
      "https://login.microsoftonline.com/a3cc7823-f4ae-464e-98f5-832ec02f1c03",
    redirectUri: window.location.origin,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};
