<script setup>
import converter from "../helpers/converter";
import Swal from "sweetalert2";
import { JSONEditor } from "vanilla-jsoneditor";
import "vanilla-jsoneditor/themes/jse-theme-dark.css";

let editor;

let editorType =
  localStorage.getItem("editorType") == "basic" ? "basic" : "advanced";

document.addEventListener("DOMContentLoaded", () => {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.getElementById("betterJSONEditor").classList.add("jse-theme-dark");
  }

  let content = {
    text: undefined,
    json: {},
  };

  editor = new JSONEditor({
    target: document.getElementById("betterJSONEditor"),
    props: {
      content,
      onChange: (
        updatedContent,
        previousContent,
        { contentErrors, patchResult }
      ) => {
        // content is an object { json: JSONData } | { text: string }
        console.log("onChange", {
          updatedContent,
          previousContent,
          contentErrors,
          patchResult,
        });
        content = updatedContent;
      },
    },
  });
  applyEditorType();
});

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

let prettyJSON = localStorage.getItem("prettyJSON")
  ? localStorage.getItem("prettyJSON")
  : false;
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("prettyChBox").checked = prettyJSON;
});

let currentDecryptedJSON = null;

function decrypt() {
  const data = document.getElementById("encryptedDataText").value;

  try {
    const veryData = JSON.parse(data);
    document.getElementById("decryptedData-Text").value =
      converter.decryptValue(veryData.data);
    jsonWrap = veryData;
    currentDecryptedJSON = converter.decryptValue(veryData.data);
    editor.set({ json: JSON.parse(converter.decryptValue(veryData.data)) });
  } catch (e) {
    document.getElementById("decryptedData-Text").value =
      converter.decryptValue(data);
    jsonWrap.data = converter.decryptValue(data);
    currentDecryptedJSON = converter.decryptValue(data);
  }
  togglePrettify(true);
}

function savei() {
  let data;

  if (editorType == "basic") {
    data = JSON.parse(document.getElementById("decryptedData-Text").value);
  } else {
    data = editor.get().json;
  }

  try {
    let jsonWrapCopy = { ...jsonWrap };
    jsonWrapCopy.data = converter.encryptValue(data);
    navigator.clipboard.writeText(JSON.stringify(jsonWrapCopy));

    Toast.fire({
      icon: "success",
      title: "Data copied",
    });
  } catch (e) {
    Toast.fire({
      icon: "error",
      title: "Error while encrypting",
    });
  }
}

function togglePrettify(nochange) {
  if (document.getElementById("prettyChBox").checked) {
    if (!nochange) localStorage.setItem("prettyJSON", "yes");
    if (currentDecryptedJSON) {
      document.getElementById("decryptedData-Text").value = JSON.stringify(
        JSON.parse(document.getElementById("decryptedData-Text").value),
        null,
        4
      );
    }
  } else {
    if (!nochange) localStorage.removeItem("prettyJSON");
    if (currentDecryptedJSON) {
      document.getElementById("decryptedData-Text").value = JSON.stringify(
        JSON.parse(document.getElementById("decryptedData-Text").value)
      );
    }
  }
}

function handleFileInput() {
  const file = document.getElementById("jsonFileInput").files[0];

  const reader = new FileReader();

  reader.onload = function (event) {
    var contents = event.target.result;
    var json = JSON.parse(contents); // parse the JSON string into a JavaScript object
    document.getElementById("encryptedDataText").value = JSON.stringify(json);
    decrypt();
    // console.log(json); // print the object
  };

  reader.onerror = function (event) {
    console.error("File could not be read! Code " + event.target.error.code);
  };

  reader.readAsText(file); // read the file as a text string
}

function applyEditorType() {
  if (editorType == "advanced") {
    document.getElementById("prettyChBoxContainer").style.display = "none";
    document.getElementById("decryptedData-Text").style.display = "none";
    document.getElementById("betterJSONEditor").style.display = "block";
    document.getElementById("typeSelecotr").value = "adv";
    editor.set({
      json: JSON.parse(document.getElementById("decryptedData-Text").value),
    });
  } else {
    document.getElementById("typeSelecotr").value = "basic";
    document.getElementById("prettyChBoxContainer").style.display = "block";
    document.getElementById("decryptedData-Text").style.display = "block";
    document.getElementById("betterJSONEditor").style.display = "none";
    if (document.getElementById("prettyChBox").checked) {
      document.getElementById("decryptedData-Text").value = JSON.stringify(
        editor.get().json,
        null,
        4
      );
    } else {
      document.getElementById("decryptedData-Text").value = JSON.stringify(
        editor.get().json
      );
    }
  }
}

function switchEditorType() {
  if (editorType == "basic") {
    editorType = "advanced";
    localStorage.setItem("editorType", "advanced");
  } else {
    editorType = "basic";
    localStorage.setItem("editorType", "basic");
  }
  applyEditorType();
}
</script>

<template>
  <h1 class="w-full text-center font-bold text-4xl mt-10">
    Subway surfers JSON editor
  </h1>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2">
    <div>
      <input
        type="file"
        class="file-input file-input-sm file-input-bordered file-input-primary w-full"
        style="margin-top: 30px; margin-left: 2.5%; width: 95%"
        accept=".json"
        id="jsonFileInput"
        @input="handleFileInput()"
      />
      <div style="width: 100%; display: flex; justify-content: center">
        <textarea
          placeholder="Encrypted data"
          class="textarea textarea-bordered textarea-lg mt-2 textAreaE textarea-primary"
          style="width: 95%"
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
    </div>

    <!-- DIVIDER -->
    <div class="divider lg:hidden"></div>

    <!-- END DIVIDER -->
    <div>
      <div
        style="
          width: 120px;
          margin-top: 23px;
          margin-bottom: 7px;
          margin-left: 2.5%;
          display: flex;
        "
      >
        <div
          class="form-control"
          id="prettyChBoxContainer"
        >
          <label class="label cursor-pointer">
            <input
              type="checkbox"
              checked="checked"
              class="checkbox checkbox-secondary"
              style="margin-right: 10px"
              id="prettyChBox"
              @change="togglePrettify()"
            />
            <span
              class="label-text"
              style="width: 100px"
              >Pretty JSON</span
            >
          </label>
        </div>
        <select
          class="select select-secondary select-sm"
          style="width: 500px; margin-bottom: 10px"
          id="typeSelecotr"
          @change="switchEditorType()"
        >
          <option disabled>Editor type</option>
          <option value="adv">Advanced</option>
          <option value="basic">Basic</option>
        </select>
      </div>

      <div style="width: 100%; display: flex; justify-content: center">
        <div
          id="betterJSONEditor"
          class="w-full"
          style="width: 95%; height: 58vh"
        ></div>
        <textarea
          placeholder="Decrypted data"
          class="textarea textarea-bordered textarea-lg textAreaE textarea-secondary hidden"
          style="width: 95%"
          id="decryptedData-Text"
          value="{}"
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
    </div>
  </div>

  <!-- DIVIDER -->
</template>

<style scoped>
/* Mobile */
@media only screen and (max-width: 1000px) {
  .textAreaE {
    height: 300px;
  }
}

/* Desktop */
@media only screen and (min-width: 1000px) {
  .textAreaE {
    height: 58vh;
  }
}
</style>
