import React from "react";
import { StyleSheet, View } from "react-native";
import FeatureCard from "./FeatureCard";

export default function FeaturesList() {
    return (
        <View style={styles.list}>
            <FeatureCard
                icon="💬"
                title="Mensagens em tempo real"
                description="Envio rápido e instantâneo."
                delay={200}
            />
            <FeatureCard
                icon="👥"
                title="Crie comunidades"
                description="Conecte pessoas e grupos."
                delay={400}
            />
            <FeatureCard
                icon="🔐"
                title="Chat seguro"
                description="Conversas protegidas e privadas."
                delay={600}
            />
            <FeatureCard
                icon="⚡"
                title="Conexão instantânea"
                description="Conecte-se com o mundo."
                delay={800}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        width: '100%',
        marginBottom: 48,
    }
});
