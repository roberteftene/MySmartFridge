<template>
  <div class="homeContainer">
    <DataView v-if="fridges.length > 0" :value="fridges" :layout="layout">
      <template #grid="slotProps">
        <div class="p-col-12" style="display: flex; justify-content: center">
          <Card class="fridgeCard" key="slotProps.data.id">
            <template #title>
              <div class="cardTitle">
                {{ slotProps.data.fridgeName }}
              </div>
            </template>
            <template #content>
              <div class="cardBody">
                <ul style="padding: 0% 1% 0% 1%; display: flex; flex-direction:column; align-items: center ">
                  <li class="itemsListContainer" v-for="item in slotProps.data.items" :key="item.id">
                    <div class="listItemHeader">
                      <div class="itemName">{{ item.itemName }} {{ item.itemQuantity }}</div>
                      <div class="itemPrice">{{ item.itemPrice }} RON</div>
                    </div>
                    <div class="listItemSubheader">
                      <div class="itemPeriod">{{ item.buyDate }} / {{ item.expirationDate }}</div>
                    </div>
                    <div class="itemDescription">
                      {{ item.itemDescription }}
                    </div>
                    <div class="itemActions">
                      <Button icon="pi pi-pencil" label="" class="btnItemAction" style="padding: 2%" @click="openEditModal(item)" />
                      <Button icon="pi pi-file-excel" label="" class="btnItemAction" style="padding: 2%" @click="removeItem(item)" />
                    </div>
                  </li>
                </ul>
              </div>
            </template>
            <template #footer>
              <div class="addBtnContainer">
                <Button
                  icon="pi pi-plus"
                  label="Add Item"
                  class="btnAction"
                  style="margin-left: 0.5em"
                  @click="openModal(slotProps.data)"
                />
              </div>
            </template>
          </Card>
        </div>
      </template>
    </DataView>
    <Dialog header="Add new item" :visible="displayModalAddItem" position="right" :modal="true">
      <p class="p-m-0">Fill the field below for adding a new item to your fridge!</p>
      <q-input class="formInput" label="Item name" v-model="newItemData.itemName" outlined type="text" />
      <q-input class="formInput" label="Item quantity" v-model="newItemData.itemQuantity" outlined type="text" />
      <q-input class="formInput" label="Item price (RON)" v-model="newItemData.itemPrice" outlined type="text" />
      <q-input class="formInput" hint="Purchase date" v-model="newItemData.buyDate" outlined type="date" />
      <q-input class="formInput" hint="Expiration date" v-model="newItemData.expirationDate" outlined type="date" />
      <q-input class="formInput" label="Item description" v-model="newItemData.itemDescription" outlined type="text" />
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" @click="closeModalAddItem" class="p-button-text" />
        <Button v-if="!isEdit" label="Add" icon="pi pi-check" @click="addItemHandler" autofocus />
        <Button v-if="isEdit" label="Update" icon="pi pi-check" @click="addItemHandler" autofocus />
      </template>
    </Dialog>
  </div>
</template>

<script>
import axios from "axios";
import DataView from "primevue/dataview";
import Card from "primevue/card";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import cogoToast from "cogo-toast";

export default {
  name: "HomeView",
  components: {
    DataView,
    Card,
    Button,
    Dialog,
  },
  data() {
    return {
      userId: localStorage.getItem("userId"),
      userToken: localStorage.getItem("userToken"),
      fridges: [],
      layout: "grid",
      displayModalAddItem: false,
      activeFridge: "",
      newItemData: {
        itemName: "",
        itemQuantity: "",
        itemPrice: "",
        buyDate: "",
        expirationDate: "",
        itemDescription: "",
      },
      isEdit: false,
      activeItemId: "",
    };
  },

  mounted() {
    let userIdLogged = localStorage.getItem("userId");
    try {
      axios.get(process.env.VUE_APP_URL + "/fridges/" + userIdLogged).then((res) => {
        console.log(res.data.fridges);
        this.fridges = res.data.fridges;
      });
    } catch (err) {
      console.log("Error during retrieving fridges: " + err.message);
    }
  },
  methods: {
    openModal: function (fridgeData) {
      this.mode = "Add";
      this.displayModalAddItem = true;
      this.activeFridge = fridgeData.id;
      this.isEdit = false;
    },
    openEditModal: function (itemData) {
      this.displayModalAddItem = true;
      this.newItemData = {
        itemName: itemData.itemName,
        itemQuantity: itemData.itemQuantity,
        itemPrice: itemData.itemPrice,
        buyDate: itemData.buyDate,
        expirationDate: itemData.expirationDate,
        itemDescription: itemData.itemDescription,
      };
      this.isEdit = true;
      this.activeItemId = itemData.id;
    },
    closeModalAddItem: function () {
      this.displayModalAddItem = false;
      this.newItemData = {
        itemName: "",
        itemQuantity: "",
        itemPrice: "",
        buyDate: "",
        expirationDate: "",
        itemDescription: "",
      };
    },
    validateFormData: function () {
      let isValid = false;
      if (
        this.newItemData.itemName === "" ||
        this.newItemData.itemQuantity === "" ||
        this.newItemData.itemPrice === "" ||
        this.newItemData.buyDate === "" ||
        this.newItemData.expirationDate === "" ||
        this.newItemData.itemDescription === ""
      ) {
        cogoToast.error("All fields should be filled in.");
      } else {
        isValid = true;
      }
      return isValid;
    },
    removeItem: function (itemData) {
      axios
        .delete(process.env.VUE_APP_URL + "/items/delete/" + itemData.id, {
          headers: {
            Authorization: `Bearer ${this.userToken}`,
          },
        })
        .then(() => {
          cogoToast.success("Removed!");
          location.reload();
        })
        .catch((err) => {
          console.log("Error during removing item: " + err);
          cogoToast.error("Something went wrong!");
        });
    },
    addItemHandler: function () {
      if (this.userId === null || this.userToken === null) {
        cogoToast.error("Session expired! Pleas log in again!");
        return;
      }
      if (this.validateFormData()) {
        if (this.isEdit) {
          axios
            .put(process.env.VUE_APP_URL + "/items/update/" + this.activeItemId, this.newItemData, {
              headers: {
                Authorization: `Bearer ${this.userToken}`,
              },
            })
            .then(() => {
              cogoToast.success("Item updated!");
              this.closeModalAddItem();
              location.reload();
            })
            .catch((err) => {
              console.log("Error during updating item: " + err);
              cogoToast.error("Something went wrong!");
            });
        } else {
          axios
            .post(process.env.VUE_APP_URL + "/items/create/" + this.activeFridge + "/" + this.userId, this.newItemData, {
              headers: {
                Authorization: `Bearer ${this.userToken}`,
              },
            })
            .then(() => {
              cogoToast.success("Item added!");
              location.reload();
              this.closeModalAddItem();
            })
            .catch((err) => {
              console.log("Error during adding item: " + err);
              cogoToast.error("Something went wrong!");
            });
        }
      }
    },
  },
};
</script>

<style>
.p-dataview-content {
  background-color: #3773b8 !important;
}
.homeContainer {
  width: 100%;
  min-height: 100vh;
  background-color: #3773b8;
  padding: 2%;
  display: flex;
  flex-direction: column;
}

.cardTitle {
  width: 100%;
  background-color: #64686b;
  padding: 3%;
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 18px;
}
.cardBody {
}

.addBtnContainer {
  padding: 3%;
}

.addBtnContainer .p-button {
  background-color: #3773b8 !important;
}

.p-card .p-card-body {
  padding: 0rem !important;
}

.fridgeCard {
  width: 70%;
  background-color: white;
  margin-top: 3%;
}

.addBtnContainer :hover {
  cursor: pointer;
  transform: scale(1.1);
}

.btnAction .pi {
  margin-right: 10px;
  font-weight: bold;
  font-size: 14px;
}

.formInput {
  margin-top: 20px;
}

.itemsListContainer {
  margin-bottom: 20px;
  list-style: none;
  background-color: #1b4c85;
  padding: 2%;
  color: #fff;
  width: 45%;
}

.listItemHeader {
  display: flex;
  justify-content: space-between;
}

.itemName {
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.itemPeriod {
  margin-bottom: 15px;
  font-size: 12px;
}

.itemPrice {
  font-weight: bold;
  color: #fff;
  font-size: 20px;
}

.itemDescription {
  font-size: 14px;
  margin-bottom: 15px;
}

.btnItemAction {
  font-size: 5px !important;
  margin: 5px !important;
  background-color: #64686b !important;
}

.btnItemAction .pi {
  font-size: 12px;
}
</style>
