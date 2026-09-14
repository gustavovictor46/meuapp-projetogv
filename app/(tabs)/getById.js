import { useState } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Keyboard,
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

export default function FilmesBuscarPorIdScreen() {
    const [id, setId] = useState('');
    const [filme, setFilme] = useState(null);
    const [buscando, setBuscando] = useState(false);
    const [erro, setErro] = useState(null);
    const [naoEncontrado, setNaoEncontrado] = useState(false);

    async function buscarPorId() {
        if (!id) {
            setErro('Digite um id para buscar.');
            return;
        }

        Keyboard.dismiss();
        setBuscando(true);
        setErro(null);
        setNaoEncontrado(false);
        setFilme(null);

        try {
            const resposta = await api.get(`/api/filmes/${id}`);
            setFilme(resposta.data.data ?? resposta.data);
        } catch (e) {
            if (e.response && e.response.status === 404) {
                setNaoEncontrado(true);
            } else {
                setErro('Não foi possível buscar o filme. Tente de novo em instantes.');
            }
        } finally {
            setBuscando(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.conteudo}>
                <View style={styles.header}>
                    <Text style={styles.tituloPagina}>Buscar filme</Text>
                    <Text style={styles.subtitulo}>GET /api/filmes/:id</Text>
                </View>

                <Text style={styles.rotulo}>Id do filme</Text>
                <View style={styles.linhaBusca}>
                    <TextInput
                        style={styles.campo}
                        value={id}
                        onChangeText={setId}
                        placeholder="Ex: 1"
                        keyboardType="numeric"
                    />
                    <Pressable style={styles.botao} onPress={buscarPorId} disabled={buscando}>
                        <Text style={styles.botaoTexto}>{buscando ? '...' : 'Buscar'}</Text>
                    </Pressable>
                </View>

                {buscando && (
                    <ActivityIndicator
                        size="small"
                        color="#ff007f"
                        style={{ marginVertical: 16 }}
                    />
                )}
                {erro && <Text style={styles.erro}>{erro}</Text>}

                {naoEncontrado && (
                    <Text style={styles.avisoNaoEncontrado}>
                        Nenhum filme encontrado com o id "{id}".
                    </Text>
                )}

                {filme && (
                    <View style={styles.card}>
                        <Image source={{ uri: filme.imageUrl }} style={styles.imagem} />
                        <View style={styles.info}>
                            <Text style={styles.titulo}>{filme.title}</Text>
                            <Text style={styles.categoria}>
                                {filme.diretor} · {filme.ano}
                            </Text>
                            <Text style={styles.detalhe}>Gênero: {filme.genero}</Text>
                            <Text style={styles.detalhe}>Nota: {filme.nota}</Text>
                        </View>
                    </View>
                )}
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
    },
    header: {
        marginBottom: 16,
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
    rotulo: {
        fontSize: 13,
        fontWeight: '600',
        color: '#f5d7ea',
        marginBottom: 6,
    },
    linhaBusca: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-start',
    },
    campo: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'rgba(255, 0, 127, 0.35)',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 11,
        backgroundColor: '#2b003b',
        color: '#fff',
    },
    botao: {
        backgroundColor: '#ff007f',
        paddingHorizontal: 18,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 46,
    },
    botaoTexto: {
        color: '#ffffff',
        fontWeight: '700',
    },
    erro: {
        color: '#ff7f7f',
        marginTop: 12,
    },
    avisoNaoEncontrado: {
        color: '#ffb3d9',
        marginTop: 16,
        fontStyle: 'italic',
    },
    card: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 18,
        backgroundColor: '#2b003b',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 0, 127, 0.2)',
        overflow: 'hidden',
        padding: 10,
    },
    imagem: {
        width: 92,
        height: 92,
        borderRadius: 12,
        backgroundColor: '#1a0d2b',
    },
    info: {
        flex: 1,
        justifyContent: 'center',
        paddingRight: 4,
        gap: 3,
    },
    titulo: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ff007f',
    },
    categoria: {
        fontSize: 13,
        color: '#f5d7ea',
    },
    detalhe: {
        fontSize: 13,
        color: '#ffb3d9',
    },
});
