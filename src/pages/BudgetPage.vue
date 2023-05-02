<template>
    <q-page class="row column items-center justify-start q-pa-lg">
        <div class="full-width row column justify-center align-center items-center"
            :style="{ height: pageHeight * 0.10 + 'px' }">
            <label><strong>Budget</strong></label>
        </div>

        <div class="row full-width justify-center q-ma-md" :style="{ height: pageHeight * 0.05 + 'px' }">
            <q-input v-model.number="income" class="col-8" label="Income" dense hide-bottom-space hide-hint filled square
                borderless pattern="[0-9]*">
                <template v-slot:append>
                    <q-icon name="payments" />
                </template>
            </q-input>
        </div>
        <div class="row full-width justify-around items-center" :style="{ height: pageHeight * 0.05 + 'px' }">
            <div class="col-1">
                <q-btn icon="chevron_left" round flat @click="changeViewMonth(-1)"></q-btn>
            </div>
            <div class="col-10 row justify-center align-center items-center">
                <label><strong>{{ getMonthName }}</strong> {{ viewYear % 2000 }}</label>
            </div>
            <div class="col-1">
                <q-btn icon="chevron_right" round flat @click="changeViewMonth(1)"></q-btn>
            </div>
        </div>
        <div class="row full-width justify-around items-center q-mt-md" :style="{ height: pageHeight * 0.10 + 'px' }">
            <div class="budget-part column col-3 justify-center items-center align-center">
                <q-icon name="currency_exchange" size="1.5rem" />
                <label class="q-mt-sm">{{ monthTransactions.length }}</label>
            </div>

            <div class="budget-part column col-3 justify-center items-center align-center">
                <q-icon name="payments" size="1.5rem" />
                <MoneyString class="q-mt-sm" :value="spending"/>
            </div>

            <div class="budget-part column col-3 justify-center items-center align-center">
                <q-icon name="account_balance" size="1.5rem" />
                <MoneyString class="q-mt-sm" :value="income + spending"/>
            </div>

            <div class="budget-part column col-3 justify-center items-center align-center">
                <q-icon name="account_balance_wallet" size="1.5rem" />
                <MoneyString class="q-mt-sm" :value="dailyBudget"/>
            </div>
        </div>
        <div class="row full-width justify-around items-center" :style="{ height: pageHeight * 0.10 + 'px' }">
            <DiagramSpendingByTag :transactions="monthTransactions" />
        </div>
    </q-page>
</template>
<script lang="ts" setup>
import { Transaction, useTransactionStore } from 'src/stores/transactionStore';
import { computed, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useDbStore } from 'src/stores/dbStore';
import { useLayoutStore } from 'src/stores/layoutStore';
import DiagramSpendingByTag from 'src/components/DiagramSpendingByTag.vue';
import MoneyString from 'src/components/MoneyString.vue';

const layoutStore = useLayoutStore();
const { pageHeight } = storeToRefs(layoutStore);

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const dbStore = useDbStore();
const { income } = storeToRefs(dbStore);

const viewMonth = ref<number>(0);
const viewYear = ref<number>(0);

const monthTransactions = computed<Transaction[]>(() => {
    const startDate = new Date(viewYear.value, viewMonth.value, 1);
    const endDate = new Date(viewYear.value, viewMonth.value + 1, 1);
    const out = transactions.value.filter(t => t.date > startDate && t.date < endDate);
    return out;
})

const spending = computed<number>(() => {
    return monthTransactions.value.reduce((acc, cur) => acc + cur.cost, 0);
})

const dailyBudget = computed<number>(() => {
    const startDate = new Date(viewYear.value, viewMonth.value + 1, 0);
    const daysInMonth = startDate.getDate();
    const currentDay = new Date().getDate();
    return parseInt(((income.value + spending.value) / (daysInMonth - currentDay)).toFixed(0));
})

const getMonthName = computed<any>(() => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const date = new Date(viewYear.value, viewMonth.value).getMonth();
    return monthNames[date];
})

const changeViewMonth = (delta: number) => {
    viewMonth.value += delta;
    if (viewMonth.value < 0) {
        viewYear.value--;
        viewMonth.value = 11;
    } else if (viewMonth.value > 11) {
        viewYear.value++;
        viewMonth.value = 0;
    }
}

watch(() => income.value, () => {
    dbStore.save();
})

onMounted(() => {
    const date = new Date();
    viewMonth.value = date.getMonth();
    viewYear.value = date.getFullYear();
})

</script>
<style lang="scss">
.budget-part {
    min-height: 85px;
}
</style>