<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { watch, computed } from 'vue'
import { onMounted } from 'vue'
import { ref } from 'vue'
import {
    VTable,
    VCheckbox,
    VBtn,
    VDialog,
    VCard,
    VCardText,
    VCardActions,
    VTextField,
    VAutocomplete,
    VContainer,
    VIcon,
    VRow,
    VCol
} from 'vuetify/components';

interface List {
    items: Item[],
    id: string | null,
    title: string | null,
    price: number | null,
    noArticle: number | null,
};

interface Item{
    id: string,
    description: string | null,
    price: number | null,
    check: boolean,
};

const props = withDefaults(
    defineProps<{
        id: string
    }>(),
    {
        id: "88"
    }
)

const base = () => {
    return {
        id: uuidv4(),
        title: null,
        price: null,
        noArticle:0,
        items: [] as Item[],
    } as List;
}

const row = ref<List>(base());
const open = ref<boolean>(false);
const itemSelected = ref<Item | null>(null);
const suggestion_items = [
    'Jitomate',
    'zanahoria',
    'tomate',
    'papa',
    'espinaca',
    'calabaza',
    'lechuga',
    'cebolla',
    'ajo',
    'pescado',
    'camarón',
    'pepicha',
    'huaxontle',
    'maíz',
    'alaches',
    'acelga',
    'platano',
    'manzana',
    'frijol'
]

// Load localStorage data
onMounted(() => {
    const item = loadFromStorage() ?? base();
    row.value = item;
});

const unCheckItems = computed(() => row.value.items.filter((item) => !item.check));
const checkItems = computed(() => row.value.items.filter((item) => item.check));

const saveToLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem('lists') ?? '[]') as List[];
    
    let index = data.findIndex((item) => {
        return item.id === props.id;
    });

    data[index] = row.value

    localStorage.setItem('lists', JSON.stringify(data))
};

watch(row, () => {
    let total = row.value.items.reduce((previous: number, current: Item) => previous + (current.price ?? 0), 0);
    row.value.price = total;

    saveToLocalStorage();
}, {deep: true});

const loadFromStorage = () => {
    const data = JSON.parse(localStorage.getItem('lists') ?? '[]') as List[];

    return data.find((item) => {
        return item.id === props.id;
    });
}

const activateTrash = (item: Item) => {
    open.value = true
    itemSelected.value = item
}

const trash = () => {
    open.value = false;
    let filteredItems = [...row.value.items];

    filteredItems = filteredItems.filter((item) => {
        return item.id !== itemSelected.value?.id;
    });

    row.value.items = [...filteredItems];

    itemSelected.value = null;
}

// Update row
const updateRowCheckbox = (item: Item) => {
    item.check = !item.check;
}

const addItem = () => {
    let rowTmp = {...row.value};

    rowTmp.items = [
        ...row.value.items, 
        {
            'id': uuidv4(),
            'description': "",
            'price': null,
            'check': false,
        } as Item,
    ];

    rowTmp.noArticle = (rowTmp.items ?? []).length;

    const total = rowTmp.items.reduce(
        (accumulator: number, currentValue: Item) => accumulator + (currentValue.price ?? 0),
    0,);
    
    rowTmp.price = total;

    row.value = rowTmp;
}
</script>

<template>
    <div style="padding: 100px">
        <v-btn @click="addItem"> Add</v-btn>
        <v-container fluid>
            <v-row justify="center">
                <v-col cols="12">
                    <v-text-field v-model="row.title" label="Nombre de la lista"></v-text-field>
                    <p>Tu lista <v-icon icon="mdi-house"></v-icon></p>
                    <!-- No check items -->
                    <v-table v-if="checkItems.length > 0" density="compact" style="margin-top: 50px">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Descripción</th>
                                <th>Precio {{ row.price }}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, key) in checkItems" :key="item.id">
                                <td>
                                    <v-checkbox color="green" :model-value="item.check"
                                        @update:model-value="() => updateRowCheckbox(item)"></v-checkbox>
                                </td>
                                <td>
                                    <v-autocomplete v-model="item.description" :items="suggestion_items"
                                        label="item"></v-autocomplete>
                                </td>
                                <td style="width: 15%">
                                    <v-text-field v-model.number="item.price" density="compact"
                                        type="number"></v-text-field>
                                </td>
                                <td>
                                    <v-btn icon="mdi-trash-can" variant="plain" :value="item.id"
                                        @click="() => activateTrash(item)" style="margin: 0; padding: 0"></v-btn>
                                </td>
                            </tr>
                            <tr class="bg-blue-lighten-4">
                                <td colspan="3" style="text-align: end">Total</td>
                                <td style="text-align: start">{{ checkItems.reduce((part, item) => part+item.price, 0) ?? 0 }}</td>
                            </tr>
                        </tbody>
                    </v-table>

                    <!-- check items -->
                    <v-card>
                        <v-card-text>
                            <v-table v-if="unCheckItems.length > 0" density="compact">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Descripción</th>
                                        <th>Precio</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, key) in unCheckItems" :key="item.id">
                                        <td>
                                            <v-checkbox color="green" :model-value="item.check"
                                                @update:modelValue="() => updateRowCheckbox(item)"></v-checkbox>
                                        </td>
                                        <td>
                                            <v-text-field v-model="item.description" density="compact"></v-text-field>
                                        </td>
                                        <td style="width: 15%">
                                            <v-text-field v-model.number="item.price" density="compact"
                                                type="number"></v-text-field>
                                        </td>
                                        <td>
                                            <v-btn icon="mdi-trash-can" variant="plain" :value="item.id"
                                                @click="() => activateTrash(item)"></v-btn>
                                        </td>
                                    </tr>
                                    <tr class="bg-green-lighten-4">
                                        <td colspan="3" style="text-align: end">Total</td>
                                        <td style="text-align: start">{{ unCheckItems.reduce((part, item) => part+item.price, 0) ?? 0 }}</td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
    <!-- Modal -->
    <v-dialog v-model="open" width="auto">
        <v-card title="Atención">
            <v-card-text> ¿Desea eliminar? </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="trash">Aceptar</v-btn>
                <v-btn color="primary" @click="() => {
                        open = false
                        itemSelected = {}
                    }
                    ">Cancelar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
