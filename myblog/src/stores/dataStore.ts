import { defineStore } from 'pinia';
import { getTable, postItem, deleteItem, updateItem } from '@/services/api';

interface Item {
  date: string;
  title: string;
  content: string;
}

export const useDataStore = defineStore('dataStore', {
  state: () => ({
    Items: [] as Item[],
  }),
  actions: {
    async fetchItems(source: string) {
      try {
        const data = await getTable(source);
        this.Items = data || [];
      } catch (error) {
        console.error('Error loading Items:', error);
      }
    },
    async addItem(source: string, item: Item) {
      try {
        const response = await postItem(source, item);
        this.Items.push(item);
        console.log('Item posted successfully:', response);
      } catch (error) {
        console.error('Error posting Item:', error);
      }
    },
    async removeItem(source: string, date: string) {
      try {
        const response = await deleteItem(source, date);
        this.Items = this.Items.filter((Item) => Item.date !== date);
        console.log('Item deleted successfully:', response);
      } catch (error) {
        console.error('Failed to delete Item:', error);
      }
    },
    async modifyItem(source: string, date: string, newContent: string, newTitle: string) {
      try {
        const response = await updateItem(source, date, newContent, newTitle);
        const ItemIndex = this.Items.findIndex((Item) => Item.date === date);
        if (ItemIndex !== -1) {
          this.Items[ItemIndex].content = newContent;
          this.Items[ItemIndex].title = newTitle;
        }
        console.log('Item updated successfully:', response);
      } catch (error) {
        console.error('Failed to update Item:', error);
      }
    }
  }
});
