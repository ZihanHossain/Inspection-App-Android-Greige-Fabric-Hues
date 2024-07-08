import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../components/HomeScreen";
// import CreateBatch from "./batchCreation/CreateBatch";
// import BatchCreation from "./batchCreation/BatchCreation";
import AddGSMScreen from "./AddGSMScreen";
// import PrintScreen from "./PrintScreen";
// import RollCreation from "./batchCreation/RollCreation";
import AddRollQty from "./AddRollQty";
import InspactionScreen from "./InspectionScreen";
import LoginScreen from "./LoginScreen";
import { IconButton } from "react-native-paper";
import InternetConnectionAlert from "react-native-internet-connection-alert";
import { View } from "react-native";

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  return (
    <InternetConnectionAlert
      onChange={(connectionState) => {
        console.log("Connection State: ", connectionState);
      }}
    >
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              title: "Home",
              headerTintColor: "white",
              headerStyle: {
                backgroundColor: "#03B061",
              },
            }}
          />
          {/* <Stack.Screen
          name="PrintScreen"
          component={PrintScreen}
          options={({ navigation }) => ({
            title: "Print",
            headerLeft: () => (
              <IconButton
                icon="home"
                onPress={() => navigation.navigate("HomeScreen")}
              />
            ),
          })}
        />
        <Stack.Screen name="BatchCreation" component={BatchCreation} />
        <Stack.Screen name="CreateBatch" component={CreateBatch} /> */}
          <Stack.Screen
            name="AddGSMScreen"
            component={AddGSMScreen}
            options={({ navigation }) => ({
              title: "Add GSM",
              headerLeft: () => (
                <IconButton
                  icon="home"
                  onPress={() => navigation.navigate("HomeScreen")}
                />
              ),
            })}
          />
          <Stack.Screen
            name="RollCreation"
            component={AddRollQty}
            options={({ navigation }) => ({
              title: "Add Roll Qty",
              headerLeft: () => (
                <IconButton
                  icon="home"
                  onPress={() => navigation.navigate("HomeScreen")}
                />
              ),
            })}
          />
          <Stack.Screen
            name="InspactionScreen"
            component={InspactionScreen}
            options={({ navigation }) => ({
              title: "4 Point Inspection",
              headerLeft: () => (
                <IconButton
                  icon="home"
                  onPress={() => navigation.navigate("HomeScreen")}
                />
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </InternetConnectionAlert>
  );
};
