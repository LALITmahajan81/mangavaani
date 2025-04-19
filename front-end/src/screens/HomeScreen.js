import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <View className="p-5 bg-primary rounded-b-3xl">
                <Text className="text-2xl font-bold text-white">MangaVaani</Text>
            </View>

            <ScrollView className="flex-1 p-5">
                <View className="mb-6">
                    <Text className="text-xl font-bold mb-4 text-gray-800">Featured Manga</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {/* Featured manga cards will go here */}
                    </ScrollView>
                </View>

                <View className="mb-6">
                    <Text className="text-xl font-bold mb-4 text-gray-800">Recent Updates</Text>
                    {/* Recent updates list will go here */}
                </View>
            </ScrollView>

            <View className="flex-row justify-around p-4 bg-white border-t border-gray-200">
                <TouchableOpacity className="items-center">
                    <Ionicons
                        name="home"
                        size={24}
                        color="#FF6B6B"
                    />
                    <Text className="text-xs mt-1 text-primary">Home</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center">
                    <Ionicons
                        name="book"
                        size={24}
                        color="#666"
                    />
                    <Text className="text-xs mt-1 text-gray-600">Library</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center">
                    <Ionicons
                        name="compass"
                        size={24}
                        color="#666"
                    />
                    <Text className="text-xs mt-1 text-gray-600">Discover</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center">
                    <Ionicons
                        name="settings"
                        size={24}
                        color="#666"
                    />
                    <Text className="text-xs mt-1 text-gray-600">Settings</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;
