import { Ionicons } from "@expo/vector-icons";
import React, { ComponentProps, useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import Theme from "../constants/Theme";

type IconName = ComponentProps<typeof Ionicons>['name'];

interface FeatureCardProps {
    icon: IconName;
    title: string;
    description: string;
    delay?: number;
}

export default function FeatureCard({
    icon,
    title,
    description,
    delay = 0,
}: FeatureCardProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                delay,
                useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 600,
                delay,
                useNativeDriver: Platform.OS !== 'web',
            }),
        ]).start();
    }, [delay, fadeAnim, translateY]);

    return (
        <Animated.View
            style={[
                styles.card,
                { opacity: fadeAnim, transform: [{ translateY }] },
            ]}
        >
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={28} color={Theme.colors.primary} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Theme.colors.card,
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: 'rgba(47, 107, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 17,
        color: Theme.colors.text,
        fontWeight: "bold",
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: Theme.colors.placeholder,
    },
});
