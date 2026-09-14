import { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator,
    Image,
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

export default function FilmesEditarScreen() {
    const [filmes, setFilmes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [selecionado, setSelecionado] = useState(null);

    const [titulo, setTitulo] = useState('');
    const [imagemUrl, setImagemUrl] = useState('');
    const [diretor, setDiretor] = useState('');
    const [ano, setAno] = useState('');
    const [genero, setGenero] = useState('');
    const [nota, setNota] = useState('');
    const [salvando, setSalvando] = useState(false);

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

    function selecionarFilme(filme) {
        setSelecionado(filme);
        setTitulo(filme.title ?? '');
        setImagemUrl(filme.imageUrl ?? '');
        setDiretor(filme.diretor ?? '');
        setAno(String(filme.ano ?? ''));
        setGenero(filme.genero ?? '');
        setNota(String(filme.nota ?? ''));
    }

    async function salvarEdicao() {
        if (!selecionado) return;
        if (!titulo || !imagemUrl || !diretor || !ano || !genero || !nota) {
            Alert.alert('Preencha todos os campos obrigatórios.');
            return;
        }

        setSalvando(true);

        try {
            const resposta = await api.put(`/api/filmes/${selecionado.id}`, {
                title: titulo,
                imageUrl: imagemUrl,
                diretor,
                ano: Number(ano),
                genero,
                nota: Number(nota),
            });

            const nomeFilme = resposta.data?.data?.title ?? resposta.data?.title ?? titulo;
            Alert.alert('Filme atualizado!', nomeFilme);

            setSelecionado(null);
            buscarFilmes();
        } catch (e) {
            Alert.alert(
                'Não deu para atualizar o filme',
                'A API respondeu com erro. Confere se todos os campos estão corretos e tenta de novo.',
            );
        } finally {
            setSalvando(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.conteudo}>
                <View style={styles.header}>
                    <Text style={styles.tituloPagina}>Editar filme</Text>
                    <Text style={styles.subtitulo}>PUT /api/filmes/:id</Text>
                </View>

                {!selecionado && (
                    <>
                        <Text style={styles.instrucao}>Toque em um filme para editar:</Text>

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
                                <Pressable
                                    key={item.id}
                                    style={styles.linha}
                                    onPress={() => selecionarFilme(item)}>
                                    <Image source={{ uri: item.imageUrl }} style={styles.poster} />
                                    <View style={styles.info}>
                                        <Text style={styles.linhaTitulo}>{item.title}</Text>
                                        <Text style={styles.linhaDetalhes}>{item.diretor}</Text>
                                    </View>
                                    <Text style={styles.linhaSeta}>editar ›</Text>
                                </Pressable>
                            ))}
                    </>
                )}

                {selecionado && (
                    <>
                        <Pressable onPress={() => setSelecionado(null)} style={styles.voltar}>
                            <Text style={styles.voltarTexto}>‹ voltar para a lista</Text>
                        </Pressable>

                        <Text style={styles.rotulo}>Título</Text>
                        <TextInput
                            style={styles.campo}
                            value={titulo}
                            onChangeText={setTitulo}
                            placeholder="Ex: Oppenheimer"
                        />

                        <Text style={styles.rotulo}>URL da imagem</Text>
                        <TextInput
                            style={styles.campo}
                            value={imagemUrl}
                            onChangeText={setImagemUrl}
                            placeholder="Ex: https://exemplo.com/oppenheimer.jpg"
                        />

                        <Text style={styles.rotulo}>Diretor</Text>
                        <TextInput
                            style={styles.campo}
                            value={diretor}
                            onChangeText={setDiretor}
                            placeholder="Ex: Christopher Nolan"
                        />

                        <Text style={styles.rotulo}>Ano</Text>
                        <TextInput
                            style={styles.campo}
                            value={ano}
                            onChangeText={setAno}
                            keyboardType="numeric"
                            placeholder="Ex: 2023"
                        />

                        <Text style={styles.rotulo}>Gênero</Text>
                        <TextInput
                            style={styles.campo}
                            value={genero}
                            onChangeText={setGenero}
                            placeholder="Ex: Drama"
                        />

                        <Text style={styles.rotulo}>Nota</Text>
                        <TextInput
                            style={styles.campo}
                            value={nota}
                            onChangeText={setNota}
                            keyboardType="decimal-pad"
                            placeholder="Ex: 8.9"
                        />

                        <Pressable style={styles.botao} onPress={salvarEdicao} disabled={salvando}>
                            <Text style={styles.botaoTexto}>
                                {salvando ? 'Salvando...' : 'Salvar alterações'}
                            </Text>
                        </Pressable>
                    </>
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
    instrucao: {
        fontSize: 14,
        color: '#f5d7ea',
        marginBottom: 4,
    },
    erro: {
        color: '#ff7f7f',
        marginTop: 12,
        textAlign: 'center',
    },
    linha: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2b003b',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 0, 127, 0.2)',
        padding: 10,
        gap: 12,
    },
    poster: {
        width: 54,
        height: 54,
        borderRadius: 12,
        backgroundColor: '#1a0d2b',
    },
    info: {
        flex: 1,
        justifyContent: 'center',
    },
    linhaTitulo: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ff007f',
    },
    linhaDetalhes: {
        fontSize: 12,
        color: '#f5d7ea',
        marginTop: 2,
    },
    linhaSeta: {
        fontSize: 13,
        color: '#ffb3d9',
        fontWeight: '700',
    },
    voltar: {
        marginBottom: 8,
    },
    voltarTexto: {
        color: '#ffb3d9',
        fontWeight: '700',
    },
    rotulo: {
        fontSize: 13,
        fontWeight: '600',
        color: '#f5d7ea',
        marginBottom: 4,
    },
    campo: {
        borderWidth: 1,
        borderColor: 'rgba(255, 0, 127, 0.35)',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 11,
        marginBottom: 10,
        backgroundColor: '#2b003b',
        color: '#fff',
    },
    botao: {
        backgroundColor: '#ff007f',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 6,
    },
    botaoTexto: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 15,
    },
});
