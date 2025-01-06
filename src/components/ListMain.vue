<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { onMounted, ref, watch} from "vue"
import type { List } from "@/types/listTypes";
import { 
    VCard,
    VCardText,
    VCardTitle,
    VDataTable,
    VBtn,
} from 'vuetify/components'

const headers: any = [
    { align: 'start', key: 'title', sortable: false, title: 'Titulo'},
    { key: 'noArticle', title: 'Articulo' },
    { key: 'price', title: 'Precio' },
    { key: 'options', title: 'Opción' },
];

const shoppingLists = ref<List[]>();

onMounted(() => {
    shoppingLists.value = JSON.parse(localStorage.getItem("lists") ?? '[]') as List[];
});

watch(shoppingLists, () => {
    localStorage.setItem('lists', JSON.stringify(shoppingLists.value))
}, {deep: true});

const onRemove = (item: List) => {
    let copy: List[]  = [...shoppingLists.value ?? []];
    
    let index: number = copy.findIndex((actual: List) => actual.id === item.id);

    if (index > 0) {
        copy.splice(index, 1);
        shoppingLists.value = copy;
    }
} 

const addNewList = () => {
    let newItem = {
        "id": uuidv4(),
        "title": "",
        "noArticle": null,
        "price": null, 
        "items" : [],
    };

    shoppingLists.value = shoppingLists.value ? [...shoppingLists.value, newItem]: [newItem];
}
</script>
<template>
    <div style="margin: 30px;">
        <v-card>
            <v-card-title>
                Your lists
            </v-card-title>
            <v-card-text>
                <div><v-btn @click="addNewList" icon="mdi-plus" color="green" size="small"></v-btn></div>
                <v-data-table
                :headers="headers"
                :items="shoppingLists">
                <template v-slot:item.options="{ item }">
                    <v-btn icon="mdi-pencil" variant="plain" @click="() => $router.push({ path: `/row/${item.id}` })"></v-btn>
                    <v-btn icon="mdi-trash-can" variant="plain" :value="item.id" @click="() => onRemove(item)"></v-btn>
                    <v-btn icon="mdi-clipboard-text-multiple" variant="plain" model-value="item.id"></v-btn>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</div>
</template>