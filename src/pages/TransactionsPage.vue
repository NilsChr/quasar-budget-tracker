<template>
    <q-page class="row column items-center justify-start q-pa-lg">
        <div class="full-width row column justify-center align-center items-center"
            :style="{ height: pageHeight * 0.05 + 'px' }">
            <label><strong>Transactions</strong></label>
        </div>
        <q-separator class="full-width"></q-separator>
        <div class="full-width row justify-start align-start items-start q-ma-sm">
            <q-btn size="sm" outline color="grey" class="q-pl-sm q-pr-sm" @click="filterDialog = true">
                <q-icon left name="drag_handle" class="q-mr-xs" />
                <div>Filter</div>
            </q-btn>

            <q-btn size="sm" unelevated color="primary" class="q-ml-sm q-pl-sm q-pr-xs" @click="filterSearch = null"
                v-if="filterSearch !== null && filterSearch !== ''">
                <div>{{ filterSearch }}</div>
                <q-icon left name="close" class="q-ml-xs q-mr-xs" />
            </q-btn>

            <q-btn size="sm" unelevated color="primary" class="q-ml-sm q-pl-sm q-pr-xs" @click="clearDateFilter"
                v-if="dateFilterExists">
                <div>{{ dateFilterText }}</div>
                <q-icon left name="close" class="q-ml-xs q-mr-xs" />
            </q-btn>

            <q-btn size="sm" unelevated color="primary" class="q-ml-sm q-pl-sm q-pr-xs" @click="filterTags = []"
                v-if="filterTags.length > 0">
                <div>Tags {{ filterTags.length }}</div>
                <q-icon left name="close" class="q-ml-xs q-mr-xs" />
            </q-btn>
        </div>
        <q-separator class="full-width"></q-separator>
        <div class="full-width row justify-end align-center items-center" :style="{ height: pageHeight * 0.05 + 'px' }">
            <div class="col-3">
                <label><strong>Total</strong></label>
            </div>
            <div class="col-3 row reverse q-pr-md">
                <strong><MoneyString :value="filteredTransactionsTotal" /></strong>
            </div>
        </div>
        <q-separator class="full-width"></q-separator>
        <div class="row full-width full-height" :style="{ height: pageHeight * 0.3 + 'px' }">
            <q-virtual-scroll :style="{ maxHeight: pageHeight * 0.80 + 'px' }" :items="filteredTransactions" separator
                v-slot="{ item, index }" class="full-width" id="virtual-scroll-transactions">
                <q-item :key="index" dense class="full-width" clickable @click="edit(item)">
                    <q-item-section>
                        <q-item-label>
                            <strong>{{ item.shortDate.substring(0, 5) }}</strong> <label class="q-ma-xs"></label>{{
                                item.description }}
                        </q-item-label>
                        <div class="row">
                            <q-chip v-for="tag in item.tags" :style="{ backgroundColor: tagStore.tagDict.get(tag)?.color }"
                                :text-color="tagStore.tagDict.get(tag)?.textColor" size="xs">
                                {{ tagStore.tagDict.get(tag)?.title }}
                            </q-chip>
                        </div>
                    </q-item-section>
                    <q-item-section side>
                        <q-item-label>
                            <!--
                                <strong>{{ item.cost }}</strong>
                            -->
                            <MoneyString :value="item.cost" />
                        </q-item-label>
                    </q-item-section>
                </q-item>
            </q-virtual-scroll>
        </div>

        <q-dialog v-model="editTransactionDialog" position="bottom">
            <q-card :style="{ height: pageHeight * 0.70 + 'px' }">
                <q-card-section class="full-width row column justify-center align-center items-center">
                    <q-input v-model.number="editTransaction!.cost" hide-bottom-space hide-hint borderless
                        input-class="text-center text-h4 text-weight-bold" pattern="[0-9]*"></q-input>
                    <label class="text-center text-h5"
                        style="background-color: transparent; margin-bottom: 0px;"><strong>NOK</strong></label>
                </q-card-section>
                <q-card-section>
                    <q-input v-model.number="editTransaction!.description" hide-bottom-space hide-hint borderless
                        maxlength="20" input-class="text-center text-h6" placeholder="Description"
                        @blur="onDescriptionChange"></q-input>
                </q-card-section>
                <q-card-section class="full-width row column justify-center align-center items-center">
                    <q-chip v-for="tag in editTransaction!.tags" removable @remove="removeTag(tag)"
                        :style="{ backgroundColor: tagStore.tagDict.get(tag)?.color }"
                        :text-color="tagStore.tagDict.get(tag)?.textColor">
                        {{ tagStore.tagDict.get(tag)?.title }}
                    </q-chip>
                    <q-btn dense icon="add" flat round @click="tagDialog = true" />
                </q-card-section>
                <q-card-section class="q-mt-lg">
                    <q-btn square unelevated color="warning" class="full-width" @click="deleteTransaction">Delete</q-btn>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
    <DialogAddTag :existing-tags="editTransaction.tags" :add-tag-module="true" @add-tags="onAddTags"
        v-if="editTransaction" />
    <DialogTransactionFilter />
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import DialogAddTag from 'src/components/DialogAddTag.vue';
import { useDbStore } from 'src/stores/dbStore';
import { useLayoutStore } from 'src/stores/layoutStore';
import { useTagsStore } from 'src/stores/tagsStore';
import { Transaction, useTransactionStore } from 'src/stores/transactionStore';
import autoTagger from 'src/util/autoTagger';
import { computed, onMounted, ref } from 'vue';
// @ts-ignore
import useQuasar from 'quasar/src/composables/use-quasar.js';
import DialogTransactionFilter from 'src/components/DialogTransactionFilter.vue';
import { isVSlot } from '@vue/compiler-core';
import MoneyString from 'src/components/MoneyString.vue';
const $q = useQuasar()

const layoutStore = useLayoutStore();
const { pageHeight } = storeToRefs(layoutStore);

const dbStore = useDbStore();
const tagStore = useTagsStore();
const { tagDialog } = storeToRefs(tagStore);
const transactionStore = useTransactionStore();
const { transactions, filterDialog, filterSearch, filterDateFrom, filterDateTo, filterTags } = storeToRefs(transactionStore);
const maxHeight = ref<number>(200);

const editTransactionDialog = ref<boolean>(false);
const editTransaction = ref<Transaction | undefined>(undefined);

const edit = (transaction: Transaction) => {
    editTransactionDialog.value = true;
    editTransaction.value = transaction;
}

const onAddTags = (t: number[]) => {
    editTransaction.value!.tags = [...t]
    t.forEach(t => {
        autoTagger.tagAdded(t, editTransaction.value!.description);
    })
    dbStore.save();
}

const removeTag = (tag: number) => {
    editTransaction.value!.tags = editTransaction.value!.tags.filter(t => t !== tag);
    dbStore.save();
}

const onDescriptionChange = () => {
    const t = autoTagger.descriptionAdded(editTransaction.value!.description);
    editTransaction.value!.tags = [...t]
    dbStore.save();
}

const deleteTransaction = () => {
    $q.dialog({
        title: 'Confirm',
        message: 'Delete this transaction?',
        cancel: true,
        persistent: true
    }).onOk(() => {
        transactions.value = transactions.value.filter(t => t.id !== editTransaction.value!.id);
        editTransaction.value = undefined;
        editTransactionDialog.value = false;
        dbStore.save();
        // console.log('>>>> OK')
    }).onCancel(() => {
        // console.log('>>>> Cancel')
    }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
    })
}

const filteredTransactions = computed(() => {
    const needle = filterSearch.value?.toLowerCase().trim();

    const out = transactions.value.filter(t => {
        if (filterDateFrom.value && new Date(filterDateFrom.value) > t.date) return false;
        if (filterDateTo.value && new Date(filterDateTo.value) <= t.date) return false;

        if (needle !== undefined && !t.description.toLowerCase().includes(needle)) return false;

        if (filterTags.value.length > 0 && !t.tags.some(e => filterTags.value.includes(e))) return false;

        return true;
    })
    return out.sort((a, b) => { return b.date.getTime() - a.date.getTime() });
})

const filteredTransactionsTotal = computed(() => {
    return filteredTransactions.value.reduce((acc, val) => acc + val.cost, 0);
})

const dateFilterExists = computed(() => {
    return filterDateFrom.value || filterDateTo.value
})

const clearDateFilter = () => {
    filterDateFrom.value = undefined;
    filterDateTo.value = undefined;
}

const dateFilterText = computed(() => {
    return `${filterDateFrom.value?.toString().substring(5, 10) || ''} - ${filterDateTo.value?.toString().substring(5, 10) || ''}`//'TEST LOL'
})

onMounted(() => {
    maxHeight.value = window.innerHeight * 0.7;
})

</script>

<style lang="scss">
#virtual-scroll-transactions {
    .q-virtual-scroll__content {
        scroll-snap-type: y mandatory;

        div {
            scroll-snap-align: start;
        }
    }
}

</style>