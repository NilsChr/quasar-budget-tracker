<template>
    <q-page class="row column items-center justify-start q-pa-lg">
        <div class="full-width row column justify-center align-center items-center"
            :style="{ height: pageHeight * 0.30 + 'px' }">
            <q-input v-model.number="cost" hide-bottom-space hide-hint borderless
                input-class="text-center text-h4 text-weight-bold" @focus="onPriceFocus" @blur="onPriceBlur"
                pattern="[0-9]*">
            </q-input>
            <label class="text-center text-h5"
                style="background-color: transparent; margin-bottom: 0px;"><strong>NOK</strong></label>
        </div>
        <div class="full-width" :style="{ height: pageHeight * 0.1 + 'px' }">
            <q-input v-model.number="description" hide-bottom-space hide-hint borderless maxlength="20"
                input-class="text-center text-h6" placeholder="Description" @blur="onDescriptionChange"></q-input>
        </div>
        <div class="full-width row column justify-center align-center items-center"
            :style="{ height: pageHeight * 0.3 + 'px' }">
            <q-chip v-for="tag in tags" removable @remove="removeTag(tag)"
                :style="{ backgroundColor: tagStore.tagDict.get(tag)?.color }"
                :text-color="tagStore.tagDict.get(tag)?.textColor">
                {{ tagStore.tagDict.get(tag)?.title }}
            </q-chip>
            <q-btn dense icon="add" flat round @click="tagDialog = true" />
        </div>
        <div class="full-width row column justify-around align-center items-center"
            :style="{ height: pageHeight * 0.2 + 'px' }">
            <q-btn square unelevated color="primary" class="full-width"
                :disable="cost === 0 || cost === null || isNaN(cost)" @click="onSpend">Spend</q-btn>
            <q-btn square unelevated color="positive" class="full-width"
                :disable="cost === 0 || cost === null || isNaN(cost)" @click="onRecieve">Recieve</q-btn>
        </div>
    </q-page>
    <DialogAddTag :existing-tags="tags" @add-tags="onAddTags" :add-tag-module="true" />
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import DialogAddTag from 'src/components/DialogAddTag.vue';
import { useDbStore } from 'src/stores/dbStore';
import { useLayoutStore } from 'src/stores/layoutStore';
import { useTagsStore } from 'src/stores/tagsStore';
import { useTransactionStore } from 'src/stores/transactionStore';
import autoTagger from 'src/util/autoTagger';
import { ref } from 'vue';

const tagStore = useTagsStore();
const { tagDialog } = storeToRefs(tagStore);

const layoutStore = useLayoutStore();
const { pageHeight } = storeToRefs(layoutStore);

const dbStore = useDbStore();

const transactionStore = useTransactionStore();

const cost = ref<number | null>(0);
const description = ref<string>('');
const tags = ref<number[]>([]);

const onPriceBlur = () => {
    if (cost.value === null || isNaN(cost.value)) cost.value = 0;
}

const onPriceFocus = () => {
    if (cost.value === 0) cost.value = null;
}

const removeTag = (tag: number) => {
    tags.value = tags.value.filter(t => t !== tag);
}

const onAddTags = (t: number[]) => {
    tags.value = [...t]
    t.forEach(t => {
        autoTagger.tagAdded(t, description.value);
    })
}

const resetValues = () => {
    tags.value = [];
    cost.value = 0;
    description.value = '';
}

const onSpend = () => {
    transactionStore.addTransaction(cost.value! * -1, description.value, tags.value);
    dbStore.save();
    resetValues();
}

const onRecieve = () => {
    transactionStore.addTransaction(cost.value!, description.value.trim(), tags.value);
    dbStore.save();
    resetValues();
}

const onDescriptionChange = () => {
    const t = autoTagger.descriptionAdded(description.value.trim());
    tags.value = [...t]
}

</script>