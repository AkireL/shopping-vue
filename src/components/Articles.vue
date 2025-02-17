<script setup lang="ts">
import { suggestionItems } from '@/data/suggestionItems';
import { ref, computed } from 'vue'
import {
    VTable,
    VCheckbox,
    VDialog,
    VBtn,
    VCard,
    VCardActions,
    VCardTitle,
    VCardText,
    VTextField,
    VCombobox,
} from 'vuetify/components';
import type { Item } from "@/types/listTypes";

const props = withDefaults(
    defineProps<{
        modelValue: Item[],
        title: string,
    }>(),
    {
        modelValue: () => {
            return [];
        }
    }
);

const open = ref<boolean>(false);
const itemSelected = ref<Item | null>(null);
const total = computed(() => props.modelValue.reduce((current: number, item: Item) => current + (item?.price ??0), 0));

const emit = defineEmits(["removeItem", "addItem"]);

const activateTrash = (item: Item) => {
    open.value = true
    itemSelected.value = item
}

const onRemove = () => {
    open.value = false;
    emit("removeItem", itemSelected.value);
    itemSelected.value = null;
}

const updateRowCheckbox = (item: Item) => {
    item.check = ! item.check;
}

</script>
<template>
    <v-card v-if="modelValue.length > 0">
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
            <v-table v-if="modelValue.length > 0" density="compact">
                <thead>
                    <tr>
                        <th style="width: 50px;"></th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th style="width: 50px;"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item) in modelValue" :key="item.id">
                        <td>
                            <v-checkbox
                                :model-value="item.check"
                                @update:modelValue="() => updateRowCheckbox(item)"
                                color="green"
                                density="compact"
                            ></v-checkbox>
                        </td>
                        <td>
                            <v-combobox
                                v-model="item.description"
                                :items="suggestionItems"
                                density="compact"
                            ></v-combobox>
                        </td>
                        <td style="width: 15%; padding: 0;margin: 0;">
                            <v-text-field
                                v-model.number="item.price"
                                density="compact"
                                type="number"
                            ></v-text-field>
                        </td>
                        <td style="padding: 0;margin: 0;">
                            <v-btn 
                                :value="item.id"
                                @click="() => activateTrash(item)"
                                icon="mdi-trash-can"
                                variant="plain"
                                class="m-0 p-0"
                                color="warning"
                                style="align-items: start">
                            </v-btn>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4">
                            <v-btn 
                                @click="() => $emit('addItem')"
                                icon="mdi-plus"
                                color="secondary"
                                size="x-small"
                                class="my-2"
                                >
                            </v-btn>
                        </td>
                    </tr>
                    <tr class="bg-green">
                        <td colspan="2" style="text-align: end; font-weight: 800;">Total</td>
                        <td colspan="2" style="text-align: end; font-weight: 800;">$ {{ total }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
    </v-card>
    
    <!-- Modal -->
    <v-dialog v-model="open" width="auto">
        <v-card title="Atención">
            <v-card-text> ¿Desea eliminar? </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="onRemove">Aceptar</v-btn>
                <v-btn color="primary" @click="() => {
                    open = false;
                    itemSelected = null;
                }
                    ">Cancelar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>