<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Datos del resultado
const datosResultado = ref(null);

// Configuración según el estado (títulos, mensajes e imágenes placeholder)
// NOTA PARA JESÚS: Cuando tengas las imágenes reales, guárdalas en assets
// y cambia los nombres aquí (ej: 'victoria.jpg', 'derrota.jpg', 'retiro.jpg')
const estados = {
    'gano': {
        titulo: '¡FELICITACIONES, MILLONARIO!',
        mensaje: 'Has respondido correctamente todas las preguntas. ¡Eres increíble!',
        // Usamos la misma de fondo como placeholder por ahora
        imagen: new URL('../assets/fondo.png', import.meta.url).href
    },
    'perdio': {
        titulo: '¡OH NO, QUÉ LÁSTIMA!',
        mensaje: 'Arriesgaste y no salió bien esta vez. ¡Pero llegaste muy lejos!',
        // Usamos la misma de fondo como placeholder por ahora
        imagen: new URL('../assets/fondo.png', import.meta.url).href
    },
    'retiro': {
        titulo: 'DECISIÓN INTELIGENTE',
        mensaje: 'Decidiste asegurar tu premio y retirarte a tiempo. ¡Bien jugado!',
        // Usamos la misma de fondo como placeholder por ahora
        imagen: new URL('../assets/fondo.png', import.meta.url).href
    }
};

// Propiedad computada para obtener la config actual fácilmente
const estadoActual = computed(() => {
    if (!datosResultado.value || !datosResultado.value.resultado) return {};
    return estados[datosResultado.value.resultado] || {};
});

onMounted(() => {
    // Recuperar datos del Session Storage
    const datosGuardados = sessionStorage.getItem('resultadoJuegoActual');
    if (datosGuardados) {
        datosResultado.value = JSON.parse(datosGuardados);
        console.log("Datos en Final:", datosResultado.value);
    } else {
        // Si alguien intenta entrar directo a /final sin jugar, lo mandamos al inicio
        router.push('/');
    }
});
</script>

<template>
    <div class="juego-container">
        
        <div v-if="datosResultado" class="tablero-juego final-content animate-pop-in">
            
            <h1 class="titulo-final" :class="datosResultado.resultado">
                {{ estadoActual.titulo }}
            </h1>

            <div class="imagen-container animate-pulse">
                <img :src="estadoActual.imagen" alt="Resultado" class="imagen-resultado" />
            </div>

            <p class="mensaje-final">{{ estadoActual.mensaje }}</p>
            <p class="nivel-alcanzado">Llegaste hasta la pregunta {{ datosResultado.nivel }}</p>
            
            <div class="premio-box">
                <span>TU PREMIO TOTAL:</span>
                <h2 class="premio-valor">{{ datosResultado.premio }}</h2>
            </div>

            <q-btn 
                to="/"
                label="Volver al Inicio"
                color="primary"
                icon="home"
                size="lg"
                glossy
                push
                class="q-mt-md btn-volver"
            />

        </div>
    </div>
</template>

<style scoped>
@import '../styles/juego.css';

.final-content {
    align-items: center;
    text-align: center;
    max-width: 500px;
}

.titulo-final {
    margin: 10px 0;
    font-size: 1.8rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}
.titulo-final.gano { color: #28a745; }
.titulo-final.perdio { color: #dc3545; }
.titulo-final.retiro { color: #d4af37; }

/* --- CAMBIOS EN LA IMAGEN --- */
.imagen-container {
    width: 220px; /* Un poco más grande */
    height: 220px;
    margin: 25px auto; /* Más margen vertical */
    border: 4px solid #d4af37; /* Borde más grueso */
    border-radius: 20px; /* ESQUINAS REDONDEADAS, YA NO ES CÍRCULO */
    overflow: hidden;
    box-shadow: 0 0 25px rgba(212, 175, 55, 0.5);
}

.imagen-resultado {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* --- ANIMACIÓN DE PALPITAR (AGRANDAR/ACHICAR) --- */
.animate-pulse {
    animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); box-shadow: 0 0 35px rgba(212, 175, 55, 0.7); }
    100% { transform: scale(1); }
}

/* ... RESTO DE ESTILOS IGUAL ... */
.mensaje-final {
    color: white;
    font-size: 1.1rem;
    margin-bottom: 5px;
}
.nivel-alcanzado {
    color: #aaa;
    font-size: 0.9rem;
}

.premio-box {
    background: rgba(212, 175, 55, 0.1);
    padding: 20px;
    border-radius: 15px;
    border: 1px solid #d4af37;
    margin: 20px 0;
    width: 100%;
}

.premio-box span {
    color: #d4af37;
    font-weight: bold;
    letter-spacing: 1px;
}

.premio-valor {
    margin: 10px 0 0 0;
    color: #d4af37;
    font-size: 2.5rem;
    font-weight: 900;
    text-shadow: 0 2px 10px rgba(212, 175, 55, 0.4);
}

.btn-volver {
    width: 80%;
    font-weight: bold;
}

.animate-pop-in {
    animation: popIn 0.5s ease-out;
}

@keyframes popIn {
    0% { opacity: 0; transform: scale(0.8); }
    100% { opacity: 1; transform: scale(1); }
}
</style>