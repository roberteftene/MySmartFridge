<template>
  <div class="homeContainer">
    <DataView v-if="fridges.length > 0" :value="fridges" :layout="layoutMain" :paginator="true" :rows="1">
      <template #list="slotProps">
        <div class="p-col-12">
          <Card class="fridgeCard" key="slotProps.data.id">
            <template #title>
              <div class="cardTitle">
                {{ slotProps.data.fridgeName }}
              </div>
            </template>
            <template #content>
              <DataView
                :value="slotProps.data.items"
                :layout="layout"
                :paginator="true"
                :sortOrder="sortOrder"
                :sortField="sortField"
                :rows="6"
              >
                <template #header>
                  <div class="p-grid p-nogutter">
                    <div class="p-col-6" style="text-align: left">
                      <Dropdown
                        v-model="sortKey"
                        :options="sortOptions"
                        optionLabel="label"
                        placeholder="Sort By Price"
                        @change="onSortChange($event)"
                      />
                    </div>
                    <div class="p-col-6" style="text-align: right">
                      <DataViewLayoutOptions v-model="layout" />
                    </div>
                  </div>
                </template>
                <template #grid="item">
                  <div class="card-section">
                    <div class="p-col-12 p-md-6 listItemHeader">
                      <div class="itemName">{{ item.data.itemName }} {{ item.data.itemQuantity }}</div>
                      <div class="itemPrice">{{ item.data.itemPrice }} RON</div>
                    </div>
                    <div class="listItemSubheader">
                      <div class="itemPeriod">{{ item.data.buyDate }} / {{ item.data.expirationDate }}</div>
                    </div>
                    <div class="itemDescription">
                      {{ item.data.itemDescription }}
                    </div>
                    <div class="itemActions">
                      <Button icon="pi pi-pencil" label="" class="btnItemAction" style="padding: 2%" @click="openEditModal(item.data)" />
                      <Button icon="pi pi-file-excel" label="" class="btnItemAction" style="padding: 2%" @click="removeItem(item.data)" />
                    </div>
                  </div>
                </template>
              </DataView>
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
import Dropdown from "primevue/dropdown";

export default {
  name: "HomeView",
  components: {
    DataView,
    Card,
    Button,
    Dialog,
    Dropdown,
  },
  data() {
    return {
      userId: localStorage.getItem("userId"),
      userToken: localStorage.getItem("userToken"),
      fridges: [],
      layout: "grid",
      layoutMain: "list",
      displayModalAddItem: false,
      activeFridge: "",
      sortKey: null,
      sortOrder: null,
      sortField: null,
      sortOptions: [
        { label: "Price High to Low", value: "!itemPrice" },
        { label: "Price Low to High", value: "itemPrice" },
      ],
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
    onSortChange: function (event) {
      console.log(event)
      const value = event.value.value;
      const sortValue = event.value;
      if (value.indexOf("!") === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
        this.sortKey = sortValue;
      } else {
        this.sortOrder = 1;
        this.sortField = value;
        this.sortKey = sortValue;
      }
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
.homeContainer {
  width: 100%;
  background-color: #3773b8;
  padding: 2%;
  display: flex;
  justify-content: center;
  min-height: 100vh;
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
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
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
  border-radius: 30px !important;
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
  border-radius: 10px;
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

.p-dropdown {
  width: 14rem;
  font-weight: normal;
}

.card-section {
  width: 25%;
  margin: 20px;
  background-color: #1b4c85;
  padding: 2%;
  color: #fff;
  height: 40%;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  transition: all .2s ease-out;
}

.card-section:hover {
  transform: scale(1.1);
}

.p-dataview .p-dataview-content {
  background-color: #3773b8 !important;
}

.p-card-content .p-dataview {
  background-color: #fff;
}

.p-grid .grid-nogutter {
  background-color: #fff !important;
  justify-content: center;
  min-width: 100vh;
  min-height: 80vh;
}

.mainView {
  display: flex;
}

.p-paginator {
  margin-top: 50px;
  border-radius: 15px !important;
}
</style>
