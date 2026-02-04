<script setup>

</script>

<template>
    <div class="vista">
<q-page class="vista">
    <h1 style=" display:flex ; justify-content: center; align-items: center; padding-top:  6rem;">Quien quiere ser Millonario</h1>
</q-page>


<div class="inicios">

 <img src="public/millon.png" alt="imagen" style=" display:flex ; justify-self: center; align-self: center; width: 430px; min-height: 430px; margin-top: 5rem;"/>

    
    <q-btn color="primary" label="jugar" to="/juego" class="boton" /><br>

    
    </div>

    </div>
</template>

<style scoped>
.inicios{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top:  5rem;
    width: 100vw;
   
    
}

.boton{
    padding: 12px 36px;
  border-radius: 30px;
  font-weight: bold;
  letter-spacing: 2px;
  background: linear-gradient(135deg, gold, #ffb700);
  color: black;
  box-shadow: 0 0 12px gold;
     
    
}

.vista{
    background: url('public/fondo.png') center center no-repeat;
    min-height: 100vh;
    background-size: cover;
}


html, body, #q-app{

    height: 100%;
    margin: 0;
}
</style>
