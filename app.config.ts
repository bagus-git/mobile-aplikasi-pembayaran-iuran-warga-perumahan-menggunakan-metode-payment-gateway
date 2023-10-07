import { ConfigContext, ExpoConfig } from "expo/config";

module.exports = ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    slug: "my-app",
    name: "my-app",
    extra: {
      midtransServerKeyEncoded:
        "U0ItTWlkLXNlcnZlci1WYzU4M05HYkM2d2hWNE9lWGlNYVlCa1Y=",
    },
  };
};
