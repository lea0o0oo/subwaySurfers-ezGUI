<script setup>
import converter from "../helpers/converter";
import Swal from "sweetalert2";
import { JSONEditor } from "vanilla-jsoneditor";
import "vanilla-jsoneditor/themes/jse-theme-dark.css";
import ShareManager from "../helpers/sharemanager";
import { useRoute } from "vue-router";

let editor;

const route = useRoute();

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
        // console.log("onChange", {
        //   updatedContent,
        //   previousContent,
        //   contentErrors,
        //   patchResult,
        // });
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
  document.getElementById("decryptBtn").disabled = true;
  document.getElementById("decryptBtn").innerHTML =
    '<span class="loading loading-spinner loading-md"></span>';
  const data = document.getElementById("encryptedDataText").value;

  try {
    try {
      const veryData = JSON.parse(data);
      document.getElementById("decryptedData-Text").value =
        converter.decryptValue(veryData.data);
      jsonWrap = veryData;
      currentDecryptedJSON = converter.decryptValue(veryData.data);
      let finalData = JSON.parse(converter.decryptValue(veryData.data));
      editor.set({ json: finalData });
    } catch (e) {
      Swal.fire(
        "Invalid data",
        "Check your file and make sure it's valid JSON data",
        "warning"
      );
    }
  } catch (e) {
    if (String(e) == 'SyntaxError: "undefined" is not valid JSON') {
      Swal.fire(
        "Invalid data",
        "The decrypted data is not valid JSON",
        "warning"
      );
    } else {
      document.getElementById("decryptedData-Text").value =
        converter.decryptValue(data);
      jsonWrap.data = converter.decryptValue(data);
      currentDecryptedJSON = converter.decryptValue(data);
    }
  } finally {
    document.getElementById("decryptBtn").disabled = false;
    document.getElementById("decryptBtn").innerHTML = "Decrypt";
  }
  togglePrettify(true);
}

function getEncryptedData() {
  let data;

  if (editorType == "basic") {
    data = JSON.parse(document.getElementById("decryptedData-Text").value);
  } else {
    data = editor.get().json || JSON.parse(editor.get().text);
  }

  try {
    let jsonWrapCopy = { ...jsonWrap };
    //console.log(jsonWrap);
    jsonWrapCopy.data = converter.encryptValue(data);
    return JSON.stringify(jsonWrapCopy);
  } catch (e) {
    throw e;
  }
}

function savei() {
  let data;
  try {
    navigator.clipboard.writeText(getEncryptedData());

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
    let finalDataApply;
    if (editor.get().json) {
      finalDataApply = editor.get().json;
    } else {
      finalDataApply = JSON.parse(editor.get().text);
    }
    document.getElementById("typeSelecotr").value = "basic";
    document.getElementById("prettyChBoxContainer").style.display = "block";
    document.getElementById("decryptedData-Text").style.display = "block";
    document.getElementById("betterJSONEditor").style.display = "none";
    if (document.getElementById("prettyChBox").checked) {
      document.getElementById("decryptedData-Text").value = JSON.stringify(
        finalDataApply,
        null,
        4
      );
    } else {
      document.getElementById("decryptedData-Text").value =
        JSON.stringify(finalDataApply);
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

function download() {
  let filename = window.prompt("Please enter the filename"); // Pass a second argument for default filename | window.prompt("Please enter the filename", "default")

  if (filename != null) {
    if (!filename.endsWith(".json")) {
      filename += ".json";
    }
    try {
      let fileContent = getEncryptedData();

      var blob = new Blob([fileContent], { type: "text/plain" });
      var url = URL.createObjectURL(blob);

      var link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      Toast.fire({
        icon: "success",
        title: "Success",
      });
    } catch (e) {
      console.error(e);
      Toast.fire({
        icon: "error",
        title: "Error while encrypting",
      });
    }
  }
}

async function generateURL() {
  document.getElementById("modal_loading").checked = true;
  let encryptedData = document.getElementById("encryptedDataText").value;
  let decryptedData;

  if (editorType == "basic") {
    decryptedData = JSON.parse(
      document.getElementById("decryptedData-Text").value
    );
  } else {
    decryptedData = editor.get().json || JSON.parse(editor.get().text);
  }
  if (encryptedData == "") {
    encryptedData = "{}";
  }
  try {
    const code = await ShareManager.saveCode(
      encryptedData,
      JSON.stringify(decryptedData)
    );
    document.getElementById("kbd-code").innerText = code;
    document.getElementById(
      "kbd-url"
    ).innerText = `${window.location.origin}/?c=${code}`;

    modal_share.showModal();
  } catch (e) {
    Swal.fire("Error", e.response.data.error, "error");
  } finally {
    document.getElementById("modal_loading").checked = false;
  }
}

function copyShareURl() {
  navigator.clipboard.writeText(document.getElementById("kbd-url").innerText);
  Toast.fire({
    icon: "success",
    title: "Success",
  });
}

// load

document.addEventListener("DOMContentLoaded", async () => {
  if (route.query.c) {
    document.getElementById("modal_loading").checked = true;
    try {
      const data = await ShareManager.getData(route.query.c);
      //console.log(data);
      if (data.encrypted != "{}") {
        document.getElementById("encryptedDataText").value = data.encrypted;
      }

      try {
        const veryData = data.decrypted;
        document.getElementById("decryptedData-Text").value = veryData;
        currentDecryptedJSON = veryData;
        let finalData = JSON.parse(veryData);
        editor.set({ json: finalData });
      } catch (e) {
        Swal.fire(
          "Invalid data",
          "Check your file and make sure it's valid JSON data",
          "warning"
        );
      }
    } catch (e) {
      Swal.fire("Error", e.response.data.error, "error");
    } finally {
      document.getElementById("modal_loading").checked = false;
    }
  }
});
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
          id="decryptBtn"
        >
          Decrypt
        </button>
      </div>
    </div>

    <!-- DIVIDER -->
    <div class="divider lg:hidden"></div>

    <!-- END DIVIDER -->
    <div class="h-full">
      <div
        style="
          width: 120px;
          margin-top: 30px;
          margin-bottom: 0px;
          margin-left: 2.5%;
          display: flex;
          align-items: center;
        "
      >
        <div class="form-control" id="prettyChBoxContainer">
          <label class="label cursor-pointer">
            <input
              type="checkbox"
              checked="checked"
              class="checkbox checkbox-secondary"
              style="margin-right: 10px"
              id="prettyChBox"
              @change="togglePrettify()"
            />
            <span class="label-text" style="width: 100px">Pretty JSON</span>
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
          class="w-full jsonEditor"
          style="width: 95%"
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
          onclick="modal_act.showModal()"
        >
          Export
        </button>
      </div>
    </div>
  </div>

  <div class="divider"></div>
  <h3 class="text-center w-full text-3xl font-bold">API</h3>
  <p class="w-full text-center">
    You can encrypt / decrypt data by sending a POST requests to a server.
    <br />
    Check the
    <a
      class="link link-info"
      href="https://github.com/Farfa7886/subwaySurfers-ezGUI/tree/main/server#api-reference"
      >documentation</a
    >
    to learn more
  </p>

  <!-- DIVIDER -->

  <!-- Open the modal using ID.showModal() method -->
  <dialog id="modal_act" class="modal modal-bottom sm:modal-middle">
    <form method="dialog" class="modal-backdrop">
      <button class="w-screen h-screen"></button>
    </form>
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="w-full flex justify-center mb-4 mt-4">
        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          <div class="mb-4 lg:mb-0 md:mb-4">
            <button
              class="btn mr-4"
              style="height: 140px"
              type="submit"
              @click="savei()"
              onclick="modal_act.close()"
            >
              <div>
                <svg
                  width="100px"
                  height="90px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="mb-3"
                >
                  <path
                    d="M8 4V16C8 17.1046 8.89543 18 10 18L18 18C19.1046 18 20 17.1046 20 16V7.24162C20 6.7034 19.7831 6.18789 19.3982 5.81161L16.0829 2.56999C15.7092 2.2046 15.2074 2 14.6847 2H10C8.89543 2 8 2.89543 8 4Z"
                    stroke="currentColor"
                    class="opacity-100"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16 18V20C16 21.1046 15.1046 22 14 22H6C4.89543 22 4 21.1046 4 20V9C4 7.89543 4.89543 7 6 7H8"
                    stroke="currentColor"
                    class="opacity-90"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Copy
              </div>
            </button>
          </div>
          <div>
            <button
              class="btn mr-4"
              style="height: 140px"
              onclick="modal_act.close()"
              @click="download()"
            >
              <div>
                <svg
                  fill="currentColor"
                  width="100px"
                  height="100px"
                  viewBox="-5 -5 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMinYMin"
                  class="jam jam-download"
                >
                  <path
                    d="M8 6.641l1.121-1.12a1 1 0 0 1 1.415 1.413L7.707 9.763a.997.997 0 0 1-1.414 0L3.464 6.934A1 1 0 1 1 4.88 5.52L6 6.641V1a1 1 0 1 1 2 0v5.641zM1 12h12a1 1 0 0 1 0 2H1a1 1 0 0 1 0-2z"
                  />
                </svg>
                Save file
              </div>
            </button>
          </div>
          <div>
            <button
              class="btn"
              style="height: 140px"
              onclick="modal_act.close()"
              @click="generateURL()"
            >
              <div>
                <svg
                  class="mb-5"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  height="80px"
                  width="100px"
                  viewBox="0 0 512 512"
                  xml:space="preserve"
                  stroke="currentColor"
                  fill="currentColor"
                >
                  <g stroke="currentColor">
                    <g stroke="currentColor">
                      <path
                        stroke="currentColor"
                        d="M512,241.7L273.643,3.343v156.152c-71.41,3.744-138.015,33.337-188.958,84.28C30.075,298.384,0,370.991,0,448.222v60.436
			l29.069-52.985c45.354-82.671,132.173-134.027,226.573-134.027c5.986,0,12.004,0.212,18.001,0.632v157.779L512,241.7z
			 M255.642,290.666c-84.543,0-163.661,36.792-217.939,98.885c26.634-114.177,129.256-199.483,251.429-199.483h15.489V78.131
			l163.568,163.568L304.621,405.267V294.531l-13.585-1.683C279.347,291.401,267.439,290.666,255.642,290.666z"
                      />
                    </g>
                  </g>
                </svg>

                Share
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </dialog>

  <input type="checkbox" id="modal_loading" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box">
      <div class="w-full flex justify-center">
        <p class="py-4">
          <span class="loading loading-spinner loading-lg"></span>
        </p>
      </div>
      <div class="w-full flex justify-center">
        <p class="py-4">Loading</p>
      </div>
    </div>
  </div>

  <dialog id="modal_share" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Success!</h3>
      <p class="mt-4">
        Your code:
        <kbd class="kbd kbd-sm" id="kbd-code">--</kbd>
      </p>
      <p class="">
        Your share url:
        <kbd class="kbd kbd-sm" id="kbd-url">--</kbd>
      </p>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn">Close</button>
        </form>
        <button class="btn btn-secondary" @click="copyShareURl()">
          Copy url
        </button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
/* Mobile */
@media only screen and (max-width: 1000px) {
  .textAreaE {
    height: 300px;
  }

  .jsonEditor {
    height: 65vh;
  }
}
/* Desktop */
@media only screen and (min-width: 1000px) {
  .textAreaE {
    height: 55vh;
  }

  .jsonEditor {
    height: 55vh;
  }
}
</style>
