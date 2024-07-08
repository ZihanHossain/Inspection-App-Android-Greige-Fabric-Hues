import React from "react";
import { LogBox } from "react-native";
import { Navigation } from "./components/navigation";

global.SERVERID = "10.12.3.182:3005";
global.APPVERSION = "V1.1";

export default function App({ navigation }) {
  return <Navigation />;
}

LogBox.ignoreLogs(["Warning: Failed prop type: Invalid prop `textStyle`"]);
