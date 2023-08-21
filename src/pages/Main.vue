<script setup>
import converter from "../helpers/converter";
import Swal from "sweetalert2";

let jsonWrap = {
  version: 3,
  data: "",
};

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

function decrypt() {
  const data = document.getElementById("encryptedDataText").value;

  try {
    const veryData = JSON.parse(data);
    document.getElementById("decryptedData-Text").value =
      converter.decryptValue(veryData.data);
    jsonWrap = veryData;
  } catch (e) {
    document.getElementById("decryptedData-Text").value =
      converter.decryptValue(data);
    jsonWrap.data = converter.decryptValue(data);
  }
}

function savei() {
  const data = document.getElementById("decryptedData-Text").value;

  try {
    let jsonWrapCopy = { ...jsonWrap };
    jsonWrapCopy.data = converter.encryptValue(data);
    navigator.clipboard.writeText(JSON.stringify(jsonWrapCopy));

    Toast.fire({
      icon: "success",
      title: "Data saved",
    });
  } catch (e) {
    Toast.fire({
      icon: "error",
      title: "Error while encrypting",
    });
  }
}
</script>

<template>
  <h1 class="w-full text-center font-bold text-4xl mt-10">
    Subway surfers JSON editor
  </h1>
  <div
    style="
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 30px;
    "
  >
    <textarea
      placeholder="Encrypted data"
      class="textarea textarea-bordered textarea-lg"
      style="width: 95%; height: 300px"
      id="encryptedDataText"
    ></textarea>
  </div>
  <div
    style="
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 30px;
    "
  >
    <button
      class="btn btn-primary"
      style="width: 95%"
      @click="decrypt()"
    >
      Decrypt
    </button>
  </div>
  <div class="divider"></div>
  <div
    style="
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 30px;
    "
  >
    <textarea
      placeholder="Decrypted data"
      class="textarea textarea-bordered textarea-lg"
      style="width: 95%; height: 300px"
      id="decryptedData-Text"
    ></textarea>
  </div>
  <div
    style="
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 30px;
    "
  >
    <button
      class="btn btn-secondary"
      style="width: 95%"
      @click="savei()"
    >
      Re-Encrypt and copy
    </button>
  </div>
</template>
