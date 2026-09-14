import { StyleSheet, Text, View } from 'react-native';

export default function ExemploScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tela de exemplo</Text>
            <Text style={styles.text}>Esta rota está funcionando corretamente.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0b1020',
        padding: 24,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 12,
    },
    text: {
        color: '#c7d2fe',
        fontSize: 16,
        textAlign: 'center',
    },
});
