<script setup>
import converter from "../helpers/converter";

converter.decryptValue(
  "IegY21/091yYehMIQUAncLb0+eNp0bWOmVTEuDTpYivflHk2jXbfoY8k59HxVoDT770+nkmdYfYvDeJkW1rJ9LBF9FlwvYWjcR6s1LUELVnkpYO97Zee9B4ZJhviMF0xtB0KDZ7JYtUTj4gIezSDe1lmEJATMP0j6foSL92r319Fr16AC9yYLQK5TrBColPXiG1jkDzAO7XXYteUJq0Q+S6BUVAuPxZaPSapYZbO1fB2z32NNYrkqsZ4fz02SAV91qIcAci37koNfnurcpogwgyGHlB5vHsuxMyOlJuMJuISylt2jCNax8jbwTLdFfDG5wOtT4/GCO5STDkfs4A2BQInVIZWWEgTZR8opFPArEM="
);
</script>

<template>
  <h1 class="w-full text-center font-bold text-4xl mt-10">
    Subway surfers JSON editor
  </h1>
  <textarea
    placeholder="Encrypted data"
    class="textarea textarea-bordered textarea-lg w-full"
  ></textarea>
</template>
