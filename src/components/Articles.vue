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

const emit = defineEmits(["removeItem"]);

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
                                style="margin: 0; padding: 0; align-items: start"></v-btn>
                        </td>
                    </tr>
                    <tr class="bg-blue-lighten-4">
                        <td colspan="3" style="text-align: end; font-weight: 800;">Total</td>
                        <td style="text-align: start; font-weight: 800;">$ {{ total }}</td>
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