import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

// Em produção, uma chave de API não deveria morar direto no código do
// app (dá pra extrair de qualquer APK/IPA instalado). Aqui, como é uma
// API pública de estudo, deixamos direto no código pra simplificar.
const API_KEY = "cv_hkgBhiqEDlnYiHfDOof78_Fq9qh0e2RpOj_kJ0NTOz8tyfGs4TJ_ByKGF6FovudW";

// Mesma instância do axios usada na tela de listagem, com o header já
// configurado — toda chamada feita com "api" já sai autenticada.
const api = axios.create({
  baseURL: "https://api-ds.codeverse.dev.br",
  headers: {
    "x-api-key": API_KEY,
  },
});


export default function FilmesCriarScreen() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [diretor, setDiretor] = useState("");
  const [duracao, setDuracao] = useState("");
  const [genero, setGenero] = useState("");

  const [enviando, setEnviando] = useState(false);

  async function criarFilme() {
    if (!titulo) {
      Alert.alert("Preencha pelo menos o título.");
      return;
    }

    setEnviando(true);
    try {

      const resposta = await api.post("/api/filmes", {
        title: titulo,
        description: descricao,
        status: "lançado",
        imageUrl: imagemUrl,
        diretor: diretor,
        duracao: Number(duracao),
        genero: genero,
      });

      Alert.alert("Filme criado!", resposta.data.title);
      setTitulo("");
      setDescricao("");
      setImagemUrl("");
      setDiretor("");
      setDuracao("");
      setGenero("");
    }catch (e) {
            console.log("Erro da API:", e.response?.data || e.message);

            const mensagemErro = e.response?.data?.message || e.response?.data?.error || "Verifique os dados enviados.";

            Alert.alert("Erro da API", JSON.stringify(e.response?.data));
        } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.header}>
          <Text style={styles.tituloPagina}>Criar filme</Text>
          <Text style={styles.subtitulo}>POST /api/filmes</Text>
        </View>

        <Text style={styles.rotulo}>Título</Text>
        <TextInput
          style={styles.campo}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ex: The Batman"
        />

        <Text style={styles.rotulo}>Descrição</Text>
        <TextInput
          style={styles.campo}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Ex: Herói vigilante de Gotham City."
        />

        <Text style={styles.rotulo}>URL da imagem</Text>
        <TextInput
          style={styles.campo}
          value={imagemUrl}
          onChangeText={setImagemUrl}
          placeholder="Ex: https://exemplo.com/thebatman.jpg"
        />


        <Text style={styles.rotulo}>Diretor</Text>
        <TextInput
          style={styles.campo}
          value={diretor}
          onChangeText={setDiretor}
          placeholder="Ex: Matt Reeves"
        />

        <Text style={styles.rotulo}>Duração</Text>
        <TextInput
          style={styles.campo}
          value={duracao}
          onChangeText={setDuracao}
          placeholder="Ex: 176 minutos"
        />

        <Text style={styles.rotulo}>Gênero</Text>
        <TextInput
          style={styles.campo}
          value={genero}
          onChangeText={setGenero}
          placeholder="Ex: Thriller"
        />

        <Pressable style={styles.botao} onPress={criarFilme} disabled={enviando}>
          <Text style={styles.botaoTexto}>{enviando ? "Enviando..." : "Criar Filme"}</Text>
        </Pressable>
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
  secao: {
    fontSize: 14,
    fontWeight: "700",
    color: "#102542",
    marginTop: 8,
    marginBottom: 8,
  },

  rotulo: { fontSize: 13, fontWeight: "600", color: "#334155", marginBottom: 4 },
  campo: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: "white",
  },
  botao: {
    backgroundColor: "#1565c0",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  botaoTexto: { color: "white", fontWeight: "700" },
});