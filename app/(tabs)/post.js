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

const API_KEY = "cv_hkgBhiqEDlnYiHfDOof78_Fq9qh0e2RpOj_kJ0NTOz8tyfGs4TJ_ByKGF6FovudW";

  baseURL: "https://api-ds.codeverse.dev.br",
  headers: {
    "x-api-key": API_KEY,
  },
});


export default function FilmesCriarScreen() {
  const [titulo, setTitulo] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [diretor, setDiretor] = useState("");
  const [ano, setAno] = useState("");
  const [genero, setGenero] = useState("");
  const [nota, setNota] = useState("");

  const [enviando, setEnviando] = useState(false);

  async function criarFilme() {
    if (!titulo || !imagemUrl || !diretor || !ano || !genero || !nota) {
      Alert.alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setEnviando(true);
    try {
      const payload = {
        title: titulo,
        imageUrl: imagemUrl,
        diretor: diretor,
        ano: Number(ano),
        genero: genero,
        nota: Number(nota),
      };

      const resposta = await api.post("/api/filmes", payload);

      Alert.alert("Filme criado!", resposta.data.title);
      setTitulo("");
      setImagemUrl("");
      setDiretor("");
      setAno("");
      setGenero("");
      setNota("");
    } catch (e) {
      console.log("Erro da API:", e.response?.data || e.message);
      Alert.alert("Erro da API", JSON.stringify(e.response?.data || { message: e.message }));
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

        <Text style={styles.rotulo}>Ano</Text>
        <TextInput
          style={styles.campo}
          value={ano}
          onChangeText={setAno}
          keyboardType="numeric"
          placeholder="Ex: 2022"
        />

        <Text style={styles.rotulo}>Gênero</Text>
        <TextInput
          style={styles.campo}
          value={genero}
          onChangeText={setGenero}
          placeholder="Ex: Thriller"
        />

        <Text style={styles.rotulo}>Nota</Text>
        <TextInput
          style={styles.campo}
          value={nota}
          onChangeText={setNota}
          keyboardType="decimal-pad"
          placeholder="Ex: 8.7"
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