import React from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from "../Screens/Onboarding";
import Onboarding2 from "../Screens/Onboarding2";
import Onboarding3 from "../Screens/Onboarding3";
import LoginScreen from "../Screens/Login";
import SignupScreen from "../Screens/Signup";
import PostLogin from "../Screens/Postlogin";
import ForgotPasswordScreen from "../Screens/forget_password";
import OtpScreen from "../Screens/otp";
import ResetPasswordScreen from "../Screens/resetpassword";
import SuccessScreen from "../Screens/success";
const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="onboarding">
                <Stack.Screen
                    name="onboarding"
                    component={Onboarding}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="onboarding2"
                    component={Onboarding2}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="onboarding3"
                    component={Onboarding3}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="postlogin"
                    component={PostLogin}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="signup"
                    component={SignupScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="forgetpassword"
                    component={ForgotPasswordScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="otp"
                    component={OtpScreen}
                    options={({ navigation }) => ({
                        title: 'OTP', // Set the title for the OTP screen
                        headerTitleAlign: 'center',
                        headerShown: true, // Show the header for the OTP screen
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                                <FontAwesome name="arrow-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        // Add other header configurations here if needed
                    })}
                />
                <Stack.Screen
                    name="resetpassword"
                    component={ResetPasswordScreen}
                    options={({ navigation }) => ({
                        title: 'Reset Password', // Set the title for the OTP screen
                        headerTitleAlign: 'center',
                        headerShown: true, // Show the header for the OTP screen
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                                <FontAwesome name="arrow-left" size={20} color="black" />
                            </TouchableOpacity>
                        ),
                        // Add other header configurations here if needed
                    })}
                />

                <Stack.Screen
                    name="success"
                    component={SuccessScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}