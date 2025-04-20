import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import axios from "axios";

// This component is for debugging purposes
const ApiStatusCheck = () => {
    const [status, setStatus] = useState("Loading...");
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [details, setDetails] = useState({});

    const checkApiStatus = async () => {
        setStatus("Checking API connections...");
        try {
            // Try connecting to the direct proxy endpoint
            const baseUrl = process.env.REACT_APP_API_URL || "http://10.10.115.83:5001/direct-api";
            const response = await axios.get(`${baseUrl}/mangaList`);

            // If successful, show some data
            setStatus("✅ Connection successful!");
            setDetails({
                apiUrl: baseUrl,
                responseStatus: response.status,
                itemCount: response.data?.mangaList?.length || 0,
                firstItem: response.data?.mangaList?.[0]?.title || "N/A",
            });
        } catch (error) {
            // Show detailed error for debugging
            setStatus("❌ Connection failed");
            setDetails({
                error: error.message,
                apiUrl: process.env.REACT_APP_API_URL,
                info: "Check if the server is running and the URL is correct",
            });
        }
    };

    useEffect(() => {
        checkApiStatus();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>API Status Check</Text>
            <Text style={status.includes("✅") ? styles.successText : styles.errorText}>{status}</Text>

            <Button
                title={detailsVisible ? "Hide Details" : "Show Details"}
                onPress={() => setDetailsVisible(!detailsVisible)}
            />

            {detailsVisible && (
                <View style={styles.detailsContainer}>
                    {Object.entries(details).map(([key, value]) => (
                        <Text
                            key={key}
                            style={styles.detailText}
                        >
                            <Text style={styles.detailLabel}>{key}: </Text>
                            {JSON.stringify(value)}
                        </Text>
                    ))}
                </View>
            )}

            <Button
                title="Retry Connection"
                onPress={checkApiStatus}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#f7f7f7",
        borderRadius: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    successText: {
        color: "green",
        fontWeight: "bold",
        marginBottom: 12,
    },
    errorText: {
        color: "red",
        fontWeight: "bold",
        marginBottom: 12,
    },
    detailsContainer: {
        marginTop: 12,
        marginBottom: 12,
        padding: 12,
        backgroundColor: "#eaeaea",
        borderRadius: 6,
    },
    detailText: {
        fontSize: 14,
        marginBottom: 6,
    },
    detailLabel: {
        fontWeight: "bold",
    },
});

export default ApiStatusCheck;
