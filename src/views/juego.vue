<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; 

const preguntas = ref([]);
const cargando = ref(true);

const obtenerPreguntas = async () => {
    try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10');
        preguntas.value = response.data.results;
        console.log("Preguntas cargadas:", preguntas.value);
    } catch (error) {
        console.error("Error con Axios:", error);
    } finally {
        cargando.value = false;
    }
};

onMounted(() => {
    obtenerPreguntas();
});
</script>

<template>
    <div class="juego-container">
        <h1>Juego Millonario</h1>
        <q-btn color="primary" label="Ir al Final" to="/final" /><br>
    </div>
</template>

<style scoped src="../styles/juego.css"></style>