<template>
    <label>{{ toMoneyString(props.value) }}</label>
</template>
<script lang="ts" setup>

const props = defineProps({
    value: {
        type: Number,
        required: true
    }
})

const toMoneyString = (n: number): string => {
    return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

</script>