<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { bancoPreguntas } from '../assets/preguntas.js';
import { useQuasar } from 'quasar'; // Importamos el composable

const $q = useQuasar(); // Instancia para usar los plugins (Dialog, Notify, etc)
const router = useRouter();

// Estados
const preguntas = ref([]);
const cargando = ref(true);
const indiceActual = ref(0);
const seleccionBloqueada = ref(false);
const indiceRespuestaSeleccionada = ref(null);
const respuestaCorrectaIndex = ref(null);

// Ayudas
const ayudasUsadas = reactive({ cincuenta: false, llamada: false, publico: false });
const opcionesOcultas = ref([]); 

// Escala de premios
const escalaPremios = ["$ 100K", "$ 200K", "$ 500K", "$ 1M", "$ 2M", "$ 5M", "$ 10M", "$ 20M", "$ 50M", "$ 100 MILLONES"];

// --- LÓGICA DE FINALIZACIÓN ---
const finalizarJuego = (resultado) => {
    let nivelAlcanzado = indiceActual.value;
    let premioGanado = '$ 0';

    if (resultado === 'gano') {
        nivelAlcanzado = 10;
        premioGanado = escalaPremios[9];
    } else if (resultado === 'retiro') {
        premioGanado = indiceActual.value > 0 ? escalaPremios[indiceActual.value - 1] : '$ 0';
    }

    // --- AQUÍ ESTÁ EL ID Y EL FORMATO NUEVO ---
    const datosJuego = {
        id: Date.now(), // ID único (timestamp)
        fecha: new Date().toLocaleString(), // Fecha y hora legible
        resultado: resultado,
        nivel: nivelAlcanzado,
        premio: premioGanado
    };
    
    // 1. Guardamos el historial completo (por si quieres ver todas las partidas luego)
    const historial = JSON.parse(sessionStorage.getItem('historialPartidas') || '[]');
    historial.push(datosJuego);
    sessionStorage.setItem('historialPartidas', JSON.stringify(historial));

    // 2. Guardamos el "último" específico para que la pantalla Final sepa qué mostrar
    sessionStorage.setItem('resultadoJuegoActual', JSON.stringify(datosJuego));

    console.log("--- PARTIDA GUARDADA ---", datosJuego);

    router.push('/final');
};

// --- AYUDAS CON QUASAR PLUGINS ---
const usarCincuenta = () => {
    if (ayudasUsadas.cincuenta || seleccionBloqueada.value) return;
    ayudasUsadas.cincuenta = true;
    
    const indicesIncorrectos = preguntas.value[indiceActual.value].opcionesMezcladas
        .map((_, idx) => idx)
        .filter(idx => idx !== preguntas.value[indiceActual.value].indiceCorrecta);

    // Ocultar 2 al azar
    opcionesOcultas.value = indicesIncorrectos.sort(() => Math.random() - 0.5).slice(0, 2);
};

const simularRespuestaPlugin = (titulo, fuente) => {
    if (seleccionBloqueada.value) return;
    const opciones = preguntas.value[indiceActual.value].opcionesMezcladas;
    // Simula una respuesta (puede ser correcta o no, para darle realismo)
    const respuesta = opciones[Math.floor(Math.random() * opciones.length)];
    
    // USAMOS EL PLUGIN DE QUASAR
    $q.dialog({
        title: `<span class="text-warning">${titulo}</span>`,
        message: `${fuente} dice que la respuesta es:<br><br><strong>"${respuesta}"</strong>`,
        html: true,
        dark: true, // Modo oscuro para que combine
        ok: { color: 'primary', label: 'Entendido' },
        style: { border: '2px solid #d4af37' } // Borde dorado
    });
};

const usarLlamada = () => {
    if (ayudasUsadas.llamada) return;
    ayudasUsadas.llamada = true;
    simularRespuestaPlugin('📞 Llamada a un amigo', 'Tu amigo');
};

const usarPublico = () => {
    if (ayudasUsadas.publico) return;
    ayudasUsadas.publico = true;
    simularRespuestaPlugin('👥 Ayuda del Público', 'La mayoría del público');
};

// --- LÓGICA PRINCIPAL ---


const obtenerPreguntas = async () => {
    cargando.value = true;
    try {
        // Simular pequeña espera para UX
        await new Promise(resolve => setTimeout(resolve, 600));

        // Seleccionar 10 preguntas aleatorias
        const preguntasAleatorias = bancoPreguntas
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);

        preguntas.value = preguntasAleatorias.map((p) => {
            // Unir y mezclar opciones
            const opciones = [...p.incorrect_answers, p.correct_answer].sort(() => Math.random() - 0.5);
            return {
                ...p,
                opcionesMezcladas: opciones,
                indiceCorrecta: opciones.indexOf(p.correct_answer)
            };
        });
    } catch (e) { 
        console.error("Error cargando preguntas locales:", e); 
    } finally { 
        cargando.value = false; 
    }
};

const seleccionarOpcion = (index) => {
    if (seleccionBloqueada.value || opcionesOcultas.value.includes(index)) return;
    
    seleccionBloqueada.value = true;
    indiceRespuestaSeleccionada.value = index;
    respuestaCorrectaIndex.value = preguntas.value[indiceActual.value].indiceCorrecta;

    setTimeout(() => {
        if (index === respuestaCorrectaIndex.value) {
            // Correcto
            if (indiceActual.value < 9) {
                indiceActual.value++;
                seleccionBloqueada.value = false;
                indiceRespuestaSeleccionada.value = null;
                opcionesOcultas.value = [];
            } else {
                finalizarJuego('gano');
            }
        } else {
            // Incorrecto
            setTimeout(() => finalizarJuego('perdio'), 1000);
        }
    }, 2000);
};

const obtenerClaseBoton = (index) => {
    if (opcionesOcultas.value.includes(index)) return 'respuesta-oculta';
    if (indiceRespuestaSeleccionada.value === null) return '';
    if (index === indiceRespuestaSeleccionada.value) {
        return index === respuestaCorrectaIndex.value ? 'correcto' : 'incorrecto';
    }
    if (index === respuestaCorrectaIndex.value && indiceRespuestaSeleccionada.value !== index) {
        return 'correcto-revelado';
    }
    return '';
};

onMounted(obtenerPreguntas);
</script>

<template>
    <div class="juego-container">
        <div v-if="cargando" class="loading"><h2>Cargando...</h2></div>

        <div v-else-if="preguntas.length > 0" class="tablero-juego">
            
            <div class="cabecera-superior">
                <span class="badge-categoria">{{ preguntas[indiceActual].category }}</span>
                <q-btn 
                    label="Retirarse" color="negative" size="sm" icon="logout"
                    :disable="indiceActual < 4 || seleccionBloqueada"
                    @click="finalizarJuego('retiro')"
                />
            </div>

            <div class="barra-ayudas">
                <q-btn round color="deep-purple" icon="phone" size="sm" @click="usarLlamada" :disable="ayudasUsadas.llamada || seleccionBloqueada">
                    <q-tooltip>Llamada</q-tooltip>
                </q-btn>
                <q-btn round color="deep-purple" icon="groups" size="sm" @click="usarPublico" :disable="ayudasUsadas.publico || seleccionBloqueada">
                    <q-tooltip>Público</q-tooltip>
                </q-btn>
                 <q-btn round color="deep-purple" label="50:50" size="sm" @click="usarCincuenta" :disable="ayudasUsadas.cincuenta || seleccionBloqueada" style="font-weight:900; font-size: 10px;">
                    <q-tooltip>50/50</q-tooltip>
                </q-btn>
            </div>

            <div class="pregunta-box">
                <h2 v-html="preguntas[indiceActual].question"></h2>
            </div>

            <div class="opciones-grid">
                <button 
                    v-for="(opcion, index) in preguntas[indiceActual].opcionesMezcladas" 
                    :key="index"
                    class="opcion-card"
                    :class="obtenerClaseBoton(index)"
                    @click="seleccionarOpcion(index)"
                    v-html="opcion"
                >
                </button>
            </div>

            <div class="escala-container">
                <div 
                    v-for="(premio, index) in escalaPremios.slice().reverse()" 
                    :key="index"
                    class="escala-item"
                    :class="{ 'activo': (escalaPremios.length - 1 - index) === indiceActual }"
                >
                    <span class="nivel-numero">{{ escalaPremios.length - index }}</span>
                    <span class="nivel-valor">{{ premio }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped src="../styles/juego.css"></style>