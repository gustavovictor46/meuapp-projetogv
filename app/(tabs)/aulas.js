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

const API_KEY = 'cv_InnR9-XNuZ4JXroshH82no3KLySUCTLaJKot9VCmkityEtSBFKTAu-XTStCcc3_D';
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
            const resposta = await api.get("/api/filmes", {
                params: { limit: 50 }
            });
            setFilmes(resposta.data.data);
        } catch (error) {
            setErro("Não foi possível carregas os filmes. Tente de novo em instantes.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscarFilmes();
    }, []);

    async function excluirFilme(id) {
        setExcluindoId(id);

        try {
            await api.delete(`/api/filmes/${id}`);

            setFilmes((atual) => atual.filter((item) => item.id !== id));
        } catch (error) {
            Alert.alert("Não deu para excluir o filme", "A API respondeu com erro. Tente de novo em instantes.")
        } finally {
            setExcluindoId(null);
        }
    }

    function confirmarExclusao(filme) {
        Alert.alert("Excluir filme", Tem certeza que quer excluir "${filme.title}"? Essa ação não pode ser desfeita., [{ text: "Cancelar", style: "cancel" }, { text: "Excluir", style: "destructive", onPress: () => excluirFilme(filme.id) }]);
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.conteudo}>
                <View style={styles.header}>
                    <Text style={styles.tituloPagina}>Excluir filme</Text>
                    <Text style={styles.subtitulo}>DELETE /api/filmes/:id</Text>
                </View>

                {carregando && <ActivityIndicator style={{ marginVertical: 16 }} />}
                {erro && <Text style={styles.erro}>{erro}</Text>}

                {!carregando &&
                    filmes.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <Image source={{ uri: item.imageUrl }} style={styles.imagem} />
                            <View style={styles.info}>
                                <Text style={styles.titulo}>{item.title}</Text>
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
    backgroundColor: '#2b003b', 
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
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#ff007f',
  },
  tituloPagina: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ff007f',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: '#ff007f',
    opacity: 0.8,
    textAlign: 'center',
  },
  erro: {
    color: '#ff4d4d',
    textAlign: 'center',
    marginVertical: 12,
    fontSize: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#2b003b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 127, 0.2)', 
    overflow: 'hidden',
    paddingRight: 12,
  },
  imagem: {
    width: 64,
    height: 64,
    borderRadius: 8,
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
  botaoExcluir: {
    backgroundColor: '#ff007f', 
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  botaoExcluirTexto: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
});