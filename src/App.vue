<template>
  <router-view />

  <Logo style="position:absolute; top: -50px; left: -50px; width: 200px;"/>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Logo from './components/Logo.vue';
import { useDbStore } from './stores/dbStore';
import { useTransactionStore } from './stores/transactionStore';
import autoTagger from './util/autoTagger';

const dbStore = useDbStore();
const transactionStore = useTransactionStore();
//console.log('test');


onMounted(() => {
  dbStore.loadData();
  autoTagger.load();
  autoTagger.cleanup();

 // transactionStore.test();
})


</script>

<style>
/*
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400&display=swap');
*/
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

html, body {margin: 0; height: 100%; overflow: hidden}

html * {
  /*font-family: 'Fredoka', sans-serif*/
  font-family: 'Roboto', 'Times New Roman' ,sans-serif
}

.debug {
  border: 1px solid red;
}

</style>