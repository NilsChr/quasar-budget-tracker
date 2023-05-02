<template>
    <q-page class="row column items-center justify-start q-pa-lg q-mt-xl">
        <q-list bordered separator class="full-width">
            <q-item clickable v-ripple v-for="tag in tags" :key="tag.id" @click="editTag(tag)">
                <q-item-section>{{ tag.title }}</q-item-section>
                <q-item-section>
                    <q-chip :style="{ backgroundColor: tag.color }"></q-chip>
                </q-item-section>
            </q-item>
        </q-list>

        <q-dialog v-model="dialog">
            <q-card max-width="300">
                <q-card-section>
                    <div class="text-h6 text-center">Update Tag</div>
                </q-card-section>
                <q-card-section>
                    <div class="row justify-center items-center align-center">
                        <div class="row justify-between">
                            <q-input v-model:model-value="newTagTitle" class="col-8" label="Title" dense hide-bottom-space
                                hide-hint filled square borderless></q-input>
                            <q-btn @click="colorDialog = true" class="fill-height" unelevated icon="color" square
                                :style="{ backgroundColor: color }"></q-btn>
                            <q-dialog v-model="colorDialog">
                                <q-card :style="{ minWidth: colorDialogMinWidth + 'px' }">
                                    <q-color v-model="color" no-header class="my-picker" no-footer />
                                </q-card>
                            </q-dialog>
                            <q-btn dense square class="q-mt-sm full-width q-ma-lg" unelevated color="primary"
                                :disable="newTagTitle == ''" @click="deleteTag">Delete</q-btn>
                            <q-btn dense square class="q-mt-sm full-width" unelevated color="primary"
                                :disable="newTagTitle == ''" @click="updateTag">Update</q-btn>
                        </div>

                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useDbStore } from 'src/stores/dbStore';
import { Tag, useTagsStore } from 'src/stores/tagsStore';
import { useTransactionStore } from 'src/stores/transactionStore';
import { ref } from 'vue';

const dbStore = useDbStore();

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);


const tagsStore = useTagsStore();
const { tags } = storeToRefs(tagsStore);

const selectedTag = ref<Tag | null>(null);
const dialog = ref<boolean>(false);

const newTagTitle = ref<string>('');
const color = ref<string>('');
const colorDialog = ref<boolean>(false);
const colorDialogMinWidth = ref<number>(200);

const editTag = (tag: Tag) => {
    selectedTag.value = tag;
    dialog.value = true;

    newTagTitle.value = tag.title;
    color.value = tag.color;
}

const deleteTag = () => {
    if(selectedTag.value === null) return;

    transactions.value.forEach(t => {
        t.tags = t.tags.filter(t => t !== selectedTag.value!.id);
    })

    tags.value = tags.value.filter(t => t !== selectedTag.value)

    dbStore.save();
    dialog.value = false;
}

const updateTag = () => {
    if(!selectedTag.value) return;

    selectedTag.value.title = newTagTitle.value;
    selectedTag.value.color = color.value;

    dbStore.save();

    dialog.value = false;
}

</script>