<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-page-sticky position="bottom">
      <q-tabs id="tabs-bar" v-model="tab" align="justify" :style="{ width: width }"
        style="background-color: white;" >
        <q-tab name="addtransaction" icon="paid" class="col q-pb-lg q-pt-sm" />
        <q-tab name="transactions" icon="receipt_long" class="col q-pb-lg q-pt-sm" />
        <q-tab name="savings" icon="savings" class="col q-pb-lg q-pt-sm" />
        <q-tab name="settings" icon="settings" class="col q-pb-lg q-pt-sm" />
      </q-tabs>
    </q-page-sticky>
  </q-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useLayoutStore } from 'src/stores/layoutStore';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const tab = ref<string>('paid');
const width = ref<string>('');

const layoutStore = useLayoutStore();
const { pageHeight, tabsHeight } = storeToRefs(layoutStore);

watch(() => tab.value, () => {
  router.push(tab.value);
})

onMounted(() => {
  width.value = window.innerWidth + 'px';

  tabsHeight.value = document.getElementById('tabs-bar')!.offsetHeight;
  pageHeight.value = window.innerHeight - tabsHeight.value;
})

</script>
