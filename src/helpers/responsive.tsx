import { Dimensions, PixelRatio } from "react-native";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const wp = (widthPercent: number) => {
  const elemWidth =
    typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

export const hp = (heightPercent: number) => {
  const elemHeight =
    typeof heightPercent === "number"
      ? heightPercent
      : parseFloat(heightPercent);

  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};
