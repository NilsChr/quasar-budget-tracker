<template>
    <q-page class="row column items-center justify-start q-pa-lg q-mt-xl" :key="componentKey">
        <div class="row full-width q-pa-sm" v-for="key in  autoTagger.predictions.keys()" :key="key">
            <div class="col-3">
                {{ key }}
            </div>
            <div class="col-4">
                Tag ids: {{ autoTagger.predictions.get(key) }}
            </div>
            <div class="col-3">
                <div v-for="n in autoTagger.predictions.get(key)" :key="`tag-${n}`">
                    {{ tagsStore.tagDict.get(n)?.title }}
                </div>
            </div>
            <div class="col-2">
                <q-btn icon="delete" flat @click="deleteKey(key)"></q-btn>
            </div>
            <q-separator class="full-width" />
        </div>
    </q-page>
</template>
<script lang="ts" setup>
import { useTagsStore } from 'src/stores/tagsStore';
import autoTagger from 'src/util/autoTagger';
import { ref, onMounted } from 'vue';
const componentKey = ref(0);

const tagsStore = useTagsStore();

const deleteKey = (key: string) => {
    autoTagger.predictions.delete(key)
    autoTagger.save();
    componentKey.value++;
}

onMounted(() => {
    autoTagger.cleanup();
})

</script>