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
} from 'vuetify/components'

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
        items: [
        ]
    }
}

const row = ref(base())
const open = ref<boolean>(false)
const itemSelected = ref<Object>({})
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
    const item = readLocalStorage() ?? base()
    row.value = item
});

const unCheckItems = computed(() => row.value.items.filter((item) => !item.check));
const checkItems = computed(() => row.value.items.filter((item) => item.check));

watch(row, () => {
    const data = JSON.parse(localStorage.getItem('lists'))

    let index = data.findIndex((item) => {
        return item.id === props.id;
    });

    let total = row.value.items.reduce((previous, current) => previous+current.price, 0);
    
    row.value.price = total;

    data[index] = row.value

    localStorage.setItem('lists', JSON.stringify(data))
}, {deep: true});

const readLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem('lists'))

    return data.find((item) => {
        return item.id === props.id;
    });
}

const activateTrash = (item: object) => {
    open.value = true
    itemSelected.value = item
}

const trash = () => {
    open.value = false;
    let filteredItems = [...row.value.items];

    filteredItems = filteredItems.filter((item) => {
        return item.id !== itemSelected.value.id;
    });

    row.value.items = [...filteredItems];

    itemSelected.value = {};
}

// Update row
const updateRowCheckbox = (item: Object) => {
    item.check = !item.check;
}

const addItem = () => {
    let rowTmp = {...row.value};

    rowTmp.items = [
        ...row.value.items, 
        {
            'id': uuidv4(),
            'description': "",
            'price': null
        },
    ];

    rowTmp.noArticle = (rowTmp.items ?? []).length;

    const total = rowTmp.items.reduce(
        (accumulator, currentValue) => accumulator + currentValue.price,
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
                                    <v-autocomplete v-model="checkItems[key].description" :items="suggestion_items"
                                        label="item"></v-autocomplete>
                                </td>
                                <td style="width: 15%">
                                    <v-text-field v-model.number="checkItems[key].price" density="compact"
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
                                            <v-text-field v-model="unCheckItems[key].description" density="compact"></v-text-field>
                                        </td>
                                        <td style="width: 15%">
                                            <v-text-field v-model.number="unCheckItems[key].price" density="compact"
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
