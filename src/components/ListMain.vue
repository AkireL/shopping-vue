<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import {ref, watch} from "vue"
import { onMounted } from 'vue'

import { 
    VCard,
    VDataTable,
    VBtn,
    VCardTitle
} from 'vuetify/components'

const headers = [
    { align: 'start', key: 'title', sortable: false, title: 'Titulo'},
    { key: 'noArticle', title: 'Articulo' },
    { key: 'price', title: 'Precio' },
    { key: 'options', title: 'Opción' },
];

const desserts = ref([]);

onMounted(() => {
    const item = JSON.parse(localStorage.getItem("lists")) || []

    desserts.value = item;
})

watch(desserts, () => {
    localStorage.setItem('lists', JSON.stringify(desserts.value))
}, {deep: true});

const onClick = (event: any) =>{
//     console.table(event);
} 

const addNewList = () => {
    desserts.value = [
        ...desserts.value,
        {
            "id": uuidv4(),
            "title": "",
            "noArticle": null,
            "price": null, 
            "items" : [],
        }
    ];
}
</script>
<template>
    <v-card flat>
    <v-card-title>
        <div style="display: flex; flex-direction: row; align-items: space-between;">
            <div>Shopping</div>
            <div><v-btn @click="addNewList">New list</v-btn></div>
        </div>
    </v-card-title>
    <v-data-table
        :headers="headers"
        :items="desserts">
        <template v-slot:item.options="{ item }">
            <v-btn icon="mdi-pencil" variant="plain" @click="() => $router.push({ path: `/row/${item.id}` })"></v-btn>
            <v-btn icon="mdi-trash-can" variant="plain" :value="item.id" @click="() => onClick(item)"></v-btn>
            <v-btn icon="mdi-clipboard-text-multiple" variant="plain" model-value="item.id"></v-btn>
        </template>
    </v-data-table>
</v-card>
</template>