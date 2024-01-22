<script setup lang="ts">

import {ref} from "vue"

import { VCard, VDataTable, VBtn } from 'vuetify/components'

const headers = [
    { align: 'start', key: 'title', sortable: false, title: 'Titulo'},
    { key: 'noArticle', title: 'Articulo' },
    { key: 'price', title: 'Precio' },
    { key: 'options', title: 'Opción' },
];

localStorage.setItem("lists", JSON.stringify([
        {
            "id": 88, "title": "lista uno", "noArticle": 5, "price":670, "items" : [
                {
                    'id': 1,
                    'description': "description",
                    'price': 230,
                    'check': true,
                },
                {
                    'id': 3,
                    'description': "otherssss",
                    'price': 270,
                    'check': true,
                },
            ],
        },
    ])
);
const data = JSON.parse(localStorage.getItem("lists"));

const desserts = ref(data || []);

const search = "";

const onClick = (event: any) =>{
//     console.table(event);
} 
</script>
<template>
    <v-card flat
    title="Nutrition">
    <v-data-table
        :headers="headers"
        :items="desserts"
        :search="search">

        <template v-slot:item.options="{ item }">
            <v-btn icon="mdi-pencil" variant="plain" @click="() => $router.push('/row')"></v-btn>
            <v-btn icon="mdi-trash-can" variant="plain" :value="item.id" @click="() => onClick(item)"></v-btn>
            <v-btn icon="mdi-clipboard-text-multiple" variant="plain" model-value="item.id"></v-btn>
        </template>
    </v-data-table>
</v-card>
</template>