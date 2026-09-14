import { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    Pressable,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const API_KEY = 'cv_hkgBhiqEDlnYiHfDOof78_Fq9qh0e2RpOj_kJ0NTOz8tyfGs4TJ_ByKGF6FovudW';

const api = axios.create({
    baseURL: 'https://api-ds.codeverse.dev.br',
    headers: {
        'x-api-key': API_KEY,
    },
});

export default function FilmesExcluirScreen() {
    const [filmes, setFilmes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [excluindoId, setExcluindoId] = useState(null);

    async function buscarFilmes() {
        setCarregando(true);
        setErro(null);

        try {
            const resposta = await api.get('/api/filmes', {
                params: { limit: 50 },
            });
            setFilmes(resposta.data.data);
        } catch (e) {
            setErro('Não foi possível carregar os filmes. Tente de novo em instantes.');
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscarFilmes();
    }, []);

    function confirmarExclusao(filme) {
        Alert.alert(
            'Excluir filme',
            `Tem certeza que quer excluir "${filme.title}"? Essa ação não pode ser desfeita.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => excluirFilme(filme.id),
                },
            ],
        );
    }

    async function excluirFilme(id) {
        setExcluindoId(id);

        try {
            await api.delete(`/api/filmes/${id}`);
            setFilmes((atual) => atual.filter((item) => item.id !== id));
        } catch (e) {
            Alert.alert(
                'Não deu para excluir o filme',
                'A API respondeu com erro. Tenta de novo em instantes.',
            );
        } finally {
            setExcluindoId(null);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.conteudo}>
                <View style={styles.header}>
                    <Text style={styles.tituloPagina}>Excluir filme</Text>
                    <Text style={styles.subtitulo}>DELETE /api/filmes/:id</Text>
                </View>

                {carregando && (
                    <ActivityIndicator
                        size="small"
                        color="#ff007f"
                        style={{ marginVertical: 16 }}
                    />
                )}
                {erro && <Text style={styles.erro}>{erro}</Text>}

                {!carregando &&
                    filmes.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <Image source={{ uri: item.imageUrl }} style={styles.imagem} />
                            <View style={styles.info}>
                                <Text style={styles.titulo}>{item.title}</Text>
                                <Text style={styles.categoria}>
                                    {item.diretor} · {item.ano}
                                </Text>
                            </View>
                            <Pressable
                                style={styles.botaoExcluir}
                                onPress={() => confirmarExclusao(item)}
                                disabled={excluindoId === item.id}>
                                <Text style={styles.botaoExcluirTexto}>
                                    {excluindoId === item.id ? '...' : 'Excluir'}
                                </Text>
                            </Pressable>
                        </View>
                    ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#12071f',
    },
    conteudo: {
        padding: 24,
        paddingBottom: 48,
        gap: 12,
    },
    header: {
        marginBottom: 8,
        alignItems: 'center',
        gap: 4,
    },
    tituloPagina: {
        fontSize: 32,
        fontWeight: '800',
        color: '#ff007f',
        textAlign: 'center',
    },
    subtitulo: {
        fontSize: 14,
        color: '#ffb3d9',
        opacity: 0.9,
        textAlign: 'center',
    },
    erro: {
        color: '#ff7f7f',
        marginTop: 12,
        textAlign: 'center',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#2b003b',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 0, 127, 0.2)',
        padding: 10,
    },
    imagem: {
        width: 58,
        height: 58,
        borderRadius: 12,
        backgroundColor: '#1a0d2b',
    },
    info: {
        flex: 1,
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ff007f',
    },
    categoria: {
        fontSize: 12,
        color: '#f5d7ea',
        marginTop: 2,
    },
    botaoExcluir: {
        backgroundColor: '#ff0033',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
    },
    botaoExcluirTexto: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 13,
    },
});
