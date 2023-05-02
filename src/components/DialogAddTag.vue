<template>
    <q-dialog v-model="tagDialog" maximized>
        <q-card class="">
            <q-bar style="background-color: transparent;">
                <q-space />
                <q-btn dense flat icon="close" v-close-popup>
                    <q-tooltip class=" text-primary">Close</q-tooltip>
                </q-btn>
            </q-bar>
            <q-card-section v-if="props.addTagModule">
                <div class="text-h6 text-center">Add Tags</div>
            </q-card-section>
            <q-card-section v-if="props.addTagModule">
                <div class="row justify-center items-center align-center">
                    <div class="row col-12 justify-center q-ma-lg" v-if="!modeAddTag">
                        <!--
                        <label><strong>New Tag</strong></label>
                        -->
                        <q-btn dense square class="q-mt-sm q-pa-sm" unelevated color="primary"
                            @click="modeAddTag = true">NEW TAG</q-btn>
                    </div>
                    <div class="row justify-between" v-if="modeAddTag">
                        <q-input v-model:model-value="newTagTitle" class="col-8" label="Title" dense hide-bottom-space
                            hide-hint filled square borderless></q-input>
                        <q-btn @click="colorDialog = true" class="fill-height" unelevated icon="color" square
                            :style="{ backgroundColor: color }"></q-btn>
                        <q-dialog v-model="colorDialog">
                            <q-card :style="{ minWidth: colorDialogMinWidth + 'px' }">
                                <q-color v-model="color" no-header class="my-picker" no-footer />
                            </q-card>
                        </q-dialog>
                        <q-btn dense square class="q-mt-sm full-width" unelevated color="primary"
                            :disable="newTagTitle == ''" @click="addTag">ADD</q-btn>
                        <q-btn dense square class="q-mt-sm full-width" unelevated color="primary"
                             @click="cancelTag">CANCEL</q-btn>
                    </div>
                    <div class="row col-12 justify-center q-ma-sm">
                    </div>
                </div>
            </q-card-section>
            <q-card-section>
                <div class="row justify-center items-center align-center">
                    <div class="row col-12 justify-center q-ma-lg">
                        <label><strong>Tags to add</strong></label>
                    </div>
                    <q-chip v-for="tag in tagsToAdd" :key="`tags-to-add-${tag}`" removable
                        @remove="tagsToAdd = tagsToAdd.filter(t => t !== tag)"
                        :style="{ backgroundColor: tagStore.tagDict.get(tag)?.color }"
                        :text-color="tagStore.tagDict.get(tag)?.textColor">
                        {{ tagStore.tagDict.get(tag)?.title }}
                    </q-chip>
                </div>
                <q-separator class="q-ma-lg"></q-separator>
                <div class="row justify-center items-center align-center">
                    <div class="row col-12 justify-center">
                        <label><strong>Available Tags</strong></label>
                    </div>
                    <q-chip v-for="tag in selectableTags" :key="`selectable-tags-${tag}`"
                        :style="{ backgroundColor: tag.color }" @click="tagsToAdd.push(tag.id)" clickable
                        :text-color="tag.textColor">
                        {{ tag.title }}
                    </q-chip>
                </div>
            </q-card-section>
            <q-card-section class="q-ma-xl">
                <q-btn @click="addTags" class="full-width" color="primary" unelevated square>Done</q-btn>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useTagsStore } from 'src/stores/tagsStore';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps({
    existingTags: {
        type: Array,
        of: Number,
        required: true
    },
    addTagModule: {
        type: Boolean,
        required: true
    }
})

const modeAddTag = ref<boolean>(false);

const tagStore = useTagsStore();
const { tagDialog } = storeToRefs(tagStore);

const newTagTitle = ref<string>('');
const color = ref<string>('#1976D2');
const colorDialog = ref<boolean>(false);
const colorDialogMinWidth = ref<number>(200);
const tagsToAdd = ref<number[]>([]);

const addTag = () => {
    tagStore.addTag(newTagTitle.value, color.value);
    color.value = '#1976D2';
    colorDialog.value = false;
    newTagTitle.value = '';
}

const cancelTag = () => {
    modeAddTag.value = false;
    color.value = '#1976D2';
    colorDialog.value = false;
    newTagTitle.value = '';
}

const selectableTags = computed(() => {
    return Array.from(tagStore.tagDict.values()).filter(t => !tagsToAdd.value.includes(t.id));
})

onMounted(() => {
    colorDialogMinWidth.value = window.innerWidth * 0.85;
})

watch(() => tagDialog.value, () => {
    if (tagDialog.value === false) return;
    tagsToAdd.value = [];
    const uniqueTags = new Set([...tagsToAdd.value, ...<number[]>Array.from(props.existingTags.values())])
    tagsToAdd.value = [...uniqueTags]
})

function addTags() {
    emit('add-tags', tagsToAdd.value);
    tagDialog.value = false;
}

const emit = defineEmits(['add-tags']);


</script>