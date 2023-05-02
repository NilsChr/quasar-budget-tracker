<template>
    <q-page class="row column items-center justify-start q-pa-lg">
        <div class="row justify-center ">
            <label class="text-h4"><strong>Settings</strong></label>
        </div>
        <div class="row justify-center q-ma-lg">
            <q-btn color="primary" unelevated square @click="router.push('/managetags')">Manage Tags</q-btn>
        </div>
        <div class="row justify-center q-ma-lg">
            <q-btn color="primary" unelevated square @click="router.push('/manageautotags')">Manage Auto Tags</q-btn>
        </div>
        <div class="row justify-center q-ma-lg">
            <q-btn color="primary" unelevated square @click="clearTransactions">Clear Transactions</q-btn>
        </div>
    </q-page>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useDbStore } from 'src/stores/dbStore';
import { useTransactionStore } from 'src/stores/transactionStore';
import { useRouter } from 'vue-router';

// @ts-ignore
import useQuasar from 'quasar/src/composables/use-quasar.js';
const $q = useQuasar()


const router = useRouter();

const dbStore = useDbStore();

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore)

const clearTransactions = () => {

    $q.dialog({
        title: 'Confirm',
        message: 'This will delete all transactions forever.',
        cancel: true,
        persistent: true
    }).onOk(() => {
        transactions.value = [];
        dbStore.save();
        // console.log('>>>> OK')
    }).onCancel(() => {
        // console.log('>>>> Cancel')
    }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
    })

}

</script>