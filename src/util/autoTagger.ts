import { Tag, useTagsStore } from "src/stores/tagsStore";

const autoTagger = {
  predictions: new Map<string, number[]>(),
  load() {
    const mapString = localStorage.getItem('autotagger');
    if(!mapString) return;
    const mapData = JSON.parse(mapString);
    this.predictions = new Map(mapData);
  },
  save() {
    const mapString = JSON.stringify(Array.from(this.predictions.entries()));
    localStorage.setItem('autotagger', mapString);
  },
  tagAdded(tagId: number, description: string) {
    const key = description.toLowerCase();
    const existingTags = this.predictions.get(key) || [];
    if (!existingTags.includes(tagId)) {
      existingTags.push(tagId);
    }
    this.predictions.set(key, existingTags);

    // SAVE
    this.save();
  },
  descriptionAdded(description: string): number[] {
    if(description === '') return [];

    const match = Array.from(this.predictions.keys()).find((key) =>
      key.includes(description.toLowerCase())
    );

    if (!match) return [];

    const tagsStore = useTagsStore();

    const tagIds = this.predictions.get(match);
    if(!tagIds) return [];
    for(let i = tagIds.length; i >= 0; i--) {
        if(tagsStore.tagDict.get(tagIds[i]) === undefined) {
            tagIds.splice(i,1);
        }
    }

    return tagIds || [];
  },
  cleanup() {
    const tagsStore = useTagsStore();

    Array.from(this.predictions.keys()).forEach(prediction => {
        const tagIds = this.predictions.get(prediction);
        if(!tagIds) return [];
        for(let i = tagIds.length; i >= 0; i--) {
            if(tagsStore.tagDict.get(tagIds[i]) === undefined) {
                console.log('Removing', tagIds[i]);
                tagIds.splice(i,1);
            }
            if(tagIds.length === 0) {
                this.predictions.delete(prediction);
            }
        }
    })

  }
};

export default autoTagger;
