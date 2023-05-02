import { defineStore } from 'pinia';
import getContrastColor from 'src/util/getContrastColor';
import { useDbStore } from './dbStore';

export interface Tag {
    id: number;
    color: string;
    textColor: string;
    title: string;
}

export interface ITagsStore {
    tags: Tag[];
    tagDialog: boolean;
}

export const useTagsStore = defineStore('tags', {
  state: () => ({
    tags: [],
    tagDialog: false
  } as ITagsStore),
  getters: {
    tagDict: (state): Map<number, Tag> => {
        const map = new Map();
        state.tags.forEach(t => {
            map.set(t.id, t);
        })

        return map;
    }
  },
  actions: {
    addTag(title: string, color: string) {
        const dbStore = useDbStore();
        const tag: Tag = {
            id: dbStore.nextId(),
            color: color,
            title: title,
            textColor: getContrastColor(color)
        }
        this.tags.push(tag);
        dbStore.save();
    }
  },
});
