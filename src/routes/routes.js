import inicio from "../views/inicio.vue"
import juego from "../views/juego.vue"
import final from "../views/final.vue"

import { createRouter, createWebHashHistory } from "vue-router"

const rutas = [
    { path: "/", component: inicio },
    { path: "/juego", component: juego },
    { path: "/final", component: final },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: rutas
})

export default router

//         <q-btn color="primary" label="inicio" to="/" /><br>
//         <q-btn color="primary" label="juego" to="/juego" /><br>
//         <q-btn color="primary" label="final" to="/final" /><br>