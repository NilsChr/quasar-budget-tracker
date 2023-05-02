<template>
    <q-dialog v-model="filterDialog" position="bottom">
        <q-card :style="{ height: pageHeight * 0.70 + 'px' }">
            <q-card-section class="row full-width justify-center items-center q-pt-sm q-pb-sm">
                <div style="background-color: #ddd; height: 5px; width: 40px; border-radius: 1em;"></div>
            </q-card-section>
            <q-card-section class="text-center q-pa-sm">
                <div><strong>Filter Transactions</strong></div>
            </q-card-section>
            <q-card-section>
                <q-input v-model="filterSearch" class="full-width" label="Search" dense hide-bottom-space hide-hint filled
                    square borderless clearable>
                    <template v-slot:append>
                        <q-icon name="search"></q-icon>
                    </template>
                </q-input>
            </q-card-section>
            <q-card-section class="q-pb-xs">
                <div class="row justify-start q-pl-sm q-pr-sm">
                    <div class="col-3"><strong>From Date</strong></div>
                    <div class="col-3">{{ filterDateFrom }}</div>
                    <q-icon name="event" class="cursor-pointer col-2" v-if="filterDateFrom === undefined">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="filterDateFrom">
                                <div class="row items-start justify-start">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                            </q-date>
                        </q-popup-proxy>
                    </q-icon>
                    <q-btn icon="close" flat round @click="filterDateFrom = undefined" v-if="filterDateFrom !== undefined" size="xs"></q-btn>
                </div>
            </q-card-section>
            <q-card-section class="q-pt-xs">
                <div class="row justify-start q-pl-sm q-pr-sm">
                    <div class="col-3"><strong>To Date</strong></div>
                    <div class="col-3">{{ filterDateTo }}</div>
                    <q-icon name="event" class="cursor-pointer col-2" v-if="filterDateTo === undefined">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="filterDateTo">
                                <div class="row items-start justify-start">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                            </q-date>
                        </q-popup-proxy>
                    </q-icon>
                    <q-btn icon="close" flat round @click="filterDateTo = undefined" v-if="filterDateTo !== undefined" size="xs"></q-btn>
                </div>
            </q-card-section>
            <q-card-section>
                <q-chip v-for="tag in filterTags" removable @remove="removeTag(tag)"
                    :style="{ backgroundColor: tagStore.tagDict.get(tag)?.color }"
                    :text-color="tagStore.tagDict.get(tag)?.textColor">
                    {{ tagStore.tagDict.get(tag)?.title }}
                </q-chip>
                <q-btn dense icon="add" flat round @click="tagDialog = true" />
            </q-card-section>
        </q-card>
    </q-dialog>
    <DialogAddTag :existing-tags="filterTags" @add-tags="onAddTags" :add-tag-module="false" />
</template>
<script lang="ts" setup>
import DialogAddTag from './DialogAddTag.vue';
import { storeToRefs } from 'pinia';
import { useLayoutStore } from 'src/stores/layoutStore';
import { useTagsStore } from 'src/stores/tagsStore';
import { useTransactionStore } from 'src/stores/transactionStore';
const layoutStore = useLayoutStore();
const { pageHeight } = storeToRefs(layoutStore);

const transactionStore = useTransactionStore();
const { filterDialog, filterSearch, filterDateFrom, filterDateTo, filterTags } = storeToRefs(transactionStore);

const tagStore = useTagsStore();
const { tagDialog } = storeToRefs(tagStore);

const removeTag = (tag: number) => {
    filterTags.value = filterTags.value.filter(t => t !== tag);
}

const onAddTags = (t: number[]) => {
    filterTags.value = [...t]
}

</script>