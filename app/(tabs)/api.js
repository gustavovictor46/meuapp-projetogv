import { React, useState, useEffect } from "react"
import { View, Text, Image, ActivityIndicator, ScrollView, StyleSheet } from "react-native"
import axios from "axios" 
import { SafeAreaView } from "react-native-safe-area-context" 

const API_KEY = "cv_hkgBhiqEDlnYiHfDOof78_Fq9qh0e2RpOj_kJ0NTOz8tyfGs4TJ_ByKGF6FovudW"

const api = axios.create({
    baseURL: "https://api-ds.codeverse.dev.br",
    headers: {
        "x-api-key": API_KEY 
    }
})

export default function FilmesListarScreen() {
    const [filmes, setFilmes] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)

    async function buscarFilmes() {
        setCarregando(true)
        setErro(null)
        try {
            const resposta = await api.get("/api/filmes", {
                params: { limit: 50 }
            })
            setFilmes(resposta.data.data)
        } catch (error) {
            setErro("Não foi possivel carregar os filmes")
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        buscarFilmes()
    }, [])

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.conteudo}>
                <View style={styles.header}>
                    <Text style={styles.tituloPagina}>Listar filmes</Text>
                    <Text style={styles.subtitulo}>GET /api/filmes</Text>
                </View>

                {carregando && <ActivityIndicator style={{ marginVertical: 16 }} />}

                {erro && <Text style={styles.erro}>{erro}</Text>}

                {!carregando &&
                    filmes.map((filme) => (
                        <View key={filme.id} style={styles.card}>
                            <Image source={{ uri: filme.imageUrl }} height={64} width={64} style={styles.imagem} />
                            <View style={styles.info}>
                                <Text style={styles.titulo}>{filme.title}</Text>
                                <Text style={styles.categoria}>
                                    {filme.category} · {filme.year}
                                </Text>
                            </View>
                        </View>
                    ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#f8fbff" }, 
    conteudo: { padding: 24, paddingBottom: 48 }, 
    header: { marginBottom: 16 }, 
    tituloPagina: { fontSize: 24, fontWeight: "800", color: "#102542" }, 
    subtitulo: { fontSize: 14, color: "#5f6b7a", marginTop: 2 }, 

    erro: { color: "#c62828", marginTop: 12 }, 
    card: {
        flexDirection: "row", 
        gap: 12, 
        marginTop: 12, 
        backgroundColor: "white",
        borderRadius: 10, 
        overflow: "hidden", 
    },
    imagem: { width: 64, height: 64 }, 
    info: { flex: 1, justifyContent: "center", paddingRight: 12 }, 
    titulo: { fontSize: 16, fontWeight: "700" },
    categoria: { fontSize: 13, color: "#64748b" }, 
});
