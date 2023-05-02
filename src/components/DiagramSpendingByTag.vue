<template>
    <div class="row column full-width q-pa-lg">
        <div class="row q-ma-xs" v-for="(d, index) in data" :key="index" style="maxHeight: 20px;">
            <div class="col-3 q-pt-xs" style="font-size: 0.7em; text-align: left;">
                {{ tagStore.tagDict.get(d.tag)?.title || 'no tag' }}
            </div>
            <div class="col-7" style="position: relative;">
                <div :style="{ position: 'absolute', width: d.width + '%', height: '100%', backgroundColor: '#3E96F6' }">
                </div>
                <strong style="position: absolute; right: -50px;"><MoneyString :value="d.cost*-1"/></strong>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useTagsStore } from 'src/stores/tagsStore';
import { Transaction } from 'src/stores/transactionStore';
import { PropType, watch, ref } from 'vue';
import MoneyString from './MoneyString.vue';

const data = ref<{ tag: number, cost: number, width: number }[]>([])

const tagStore = useTagsStore();

const props = defineProps({
    transactions: {
        type: Array as PropType<Array<Transaction>>,
        required: true
    }
})


watch(() => props.transactions, () => {
    data.value = [];
    const uniqueTags: Set<number> = new Set();
    const agregatedCost: Map<number, number> = new Map();

    props.transactions.forEach(t => {
        t.tags.forEach(tag => {
            uniqueTags.add(tag);
        })
    })

    uniqueTags.forEach(tag => {
        if (!agregatedCost.get(tag)) {
            agregatedCost.set(tag, 0);
        }
        const costs = props.transactions.filter(t => t.tags.includes(tag));
        const total = costs.reduce((acc, cur) => acc + cur.cost, 0);
        agregatedCost.set(tag, agregatedCost.get(tag)! + total);
    })
    const noTagCosts = props.transactions.filter(t => t.tags.length == 0);
    const total = noTagCosts.reduce((acc, cur) => acc + cur.cost, 0);
    if(total !== 0) {
        agregatedCost.set(-1, total);
    }
    agregatedCost.forEach((v: number, k: number) => {
        data.value.push({ tag: k, cost: v, width: 0 });
    })
    data.value = data.value.sort((a, b) => a.cost - b.cost);
    data.value.forEach(d => {
        d.width = d.cost / data.value[0].cost * 100;
    })

})

</script>