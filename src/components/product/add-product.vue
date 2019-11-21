<template>
  <div id="add-product-form" v-if="isUserLogin" :class="{mobile: isMobileOnly}">
    <form autocomplete="off" @submit.prevent="addAction" method="POST">
      <div class="page-content">
        <div class="form-container">
          <!-- <input type="hidden" name="product_id" v-model="product_id" /> -->

          <div class="pos-discount-fields">
            <!-- sku unique -->
            <div class="control-group" :class="[this.errors.has('sku')? 'has-error' :'']">
              <label
                for="sku"
                class="required"
                v-text="$t('pos_product.menu_content.new_product.sku')"
              ></label>
              <input
                type="text"
                :class="isMobileOnly ? 'control' : 'form-control'"
                name="sku"
                v-validate="'required'"
                v-model="product.sku"
              />
              <span
                class="control-error"
                v-if="this.errors.has('sku')"
              >{{ this.errors.first('sku') }}</span>
            </div>

            <!-- product name -->
            <div class="control-group" :class="[this.errors.has('product_name')? 'has-error' :'']">
              <label
                for="product_name"
                class="required"
                v-text="$t('pos_product.menu_content.new_product.product_name')"
              ></label>
              <input
                type="text"
                :class="isMobileOnly ? 'control' : 'form-control'"
                name="product_name"
                v-validate="'required'"
                v-model="product.productName"
              />
              <span
                class="control-error"
                v-if="this.errors.has('product_name')"
              >{{ this.errors.first('product_name') }}</span>
            </div>

            <!-- price -->
            <div class="control-group" :class="[this.errors.has('price') ? 'has-error' : '']">
              <label
                for="price"
                class="required"
                v-text="$t('pos_product.menu_content.new_product.entry_price')"
              ></label>
              <input
                type="number"
                :class="isMobileOnly ? 'control' : 'form-control'"
                name="price"
                v-validate="'required|numeric'"
                v-model="product.price"
              />
              <span
                class="control-error"
                v-if="this.errors.has('price')"
              >{{ this.errors.first('price') }}</span>
            </div>

            <!-- purchase_price -->
            <div
              class="control-group"
              :class="[this.errors.has('purchase_price') ? 'has-error' : '']"
            >
              <label
                for="purchase_price"
                v-text="$t('pos_product.menu_content.new_product.entry_purchase_price')"
              ></label>
              <input
                type="number"
                :class="isMobileOnly ? 'control' : 'form-control'"
                name="purchase_price"
                v-validate="'numeric'"
                v-model="product.purchasePrice"
              />
              <span
                class="control-error"
                v-if="this.errors.has('purchase_price')"
              >{{ this.errors.first('purchase_price') }}</span>
            </div>

            <!-- qty -->
            <div class="control-group" :class="[this.errors.has('quantity') ? 'has-error' : '']">
              <label
                for="quantity"
                class="required"
                v-text="$t('pos_product.menu_content.new_product.entry_quantity')"
              ></label>
              <input
                type="number"
                :class="isMobileOnly ? 'control' : 'form-control'"
                name="quantity"
                v-validate="'required|numeric'"
                v-model="product.quantity"
              />
              <span
                class="control-error"
                v-if="this.errors.has('quantity')"
              >{{ this.errors.first('quantity') }}</span>
            </div>

            <div class="control-group" :class="[this.errors.has('low_stock') ? 'has-error' : '']">
              <label for="low_stock" v-text="$t('pos_product.menu_content.new_product.low_stock')"></label>
              <input
                type="number"
                :class="isMobileOnly ? 'control' : 'form-control'"
                name="low_stock"
                v-validate="'numeric'"
                v-model="product.lowStock"
              />
              <span
                class="control-error"
                v-if="this.errors.has('low_stock')"
              >{{ this.errors.first('low_stock') }}</span>
            </div>

            <div class="control-group" :class="[this.errors.has('weight') ? 'has-error' : '']">
              <label for="weight" v-text="$t('pos_product.menu_content.new_product.entry_weight')"></label>
              <input
                type="number"
                :class="isMobileOnly ? 'control' : 'form-control'"
                name="weight"
                v-validate="'numeric'"
                v-model="product.weight"
              />
              <span
                class="control-error"
                v-if="this.errors.has('weight')"
              >{{ this.errors.first('weight') }}</span>
            </div>

            <div class="control-group" :class="[this.errors.has('width') ? 'has-error' : '']">
              <label for="width" v-text="$t('pos_product.menu_content.new_product.entry_width')"></label>
              <input
                type="number"
                :class="isMobileOnly ? 'control' : 'form-control'"
                name="width"
                v-validate="'numeric'"
                v-model="product.width"
              />
              <span
                class="control-error"
                v-if="this.errors.has('width')"
              >{{ this.errors.first('width') }}</span>
            </div>

            <div class="control-group" :class="[this.errors.has('height') ? 'has-error' : '']">
              <label for="height" v-text="$t('pos_product.menu_content.new_product.entry_height')"></label>
              <input
                type="number"
                :class="isMobileOnly ? 'control' : 'form-control'"
                name="height"
                v-validate="'numeric'"
                v-model="product.height"
              />
              <span
                class="control-error"
                v-if="this.errors.has('height')"
              >{{ this.errors.first('height') }}</span>
            </div>

            <div class="control-group" :class="[this.errors.has('depth') ? 'has-error' : '']">
              <label for="depth" v-text="$t('pos_product.menu_content.new_product.entry_depth')"></label>
              <input
                type="number"
                :class="isMobileOnly ? 'control' : 'form-control'"
                name="depth"
                v-validate="'numeric'"
                v-model="product.depth"
              />
              <span
                class="control-error"
                v-if="this.errors.has('depth')"
              >{{ this.errors.first('depth') }}</span>
            </div>

            <div class="control-group" :class="[this.errors.has('categories') ? 'has-error' : '']">
              <label
                for="categories"
                class="required"
                v-text="$t('pos_product.menu_content.new_product.categories')"
              ></label>
              <tree ref="tree" :options="treeOpts" />
              <!-- <span
                class="control-error"
                v-if="this.errors.has('categories')"
              >{{ this.errors.first('categories') }}</span>-->
            </div>

            <div
              class="control-group croppa-group"
              :class="[this.errors.has('image') ? 'has-error' : '']"
            >
              <label
                for="image"
                class="croppa-label"
                v-text="$t('pos_product.menu_content.new_product.entry_product_image')"
              ></label>
              <croppa class="control-croppa" v-model="product.image">
                <img slot="initial" :src="product.imgPath" />
              </croppa>
            </div>

            <div class="pos-action container-submit text-center mt-2">
              <button
                class="btn btn-lg btn-pos-dark btn-primary"
                type="submit"
                :text="$t('pos_product.menu_content.new_product.button_add')"
              >{{ $t('pos_product.menu_content.new_product.button_add') }}</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { APP as getApp } from "@/store/getters";
import { getCategories } from "@/api/categories";
import { addProducts } from "@/api/product";

window.jQuery = window.$ = require("jquery");

export default {
  props: ["localObject"],
  data() {
    return {
      user_id: null,
      product: {
        sku: null,
        productName: null,
        price: null,
        purchasePrice: null,
        quantity: 1,
        lowStock: null,
        weight: null,
        width: null,
        height: null,
        depth: null,
        image: null,
        imgPath: "",
        category: null
      },
      posCategories: null,
      treeOpts: {
        checkbox: true,
        fetchData: () => {
          if (!this.$root.offline) {
            // return this.$http.get("/api/pos/categories")
            return getCategories()
              .then(res => {
                this.posCategories = res.data.categories;
                this.localObject.pos_categories = this.posCategories;
                // console.log("res-categories", this.getTreeData(res.data.categories));
                console.log("res-categories", res.data.categories);
                return this.getTreeData(res.data.categories);
              })
              .catch(err => {
                console.error(err);
              });
          } else {
            if (Object.keys(this.localObject.pos_categories).length > 0) {
              this.posCategories = this.localObject.pos_categories;
              return this.getTreeData(this.posCategories);
            }
          }
        }
      }
    };
  },
  computed: {
    isUserLogin() {
      this.checkUserLogin();
      return this.user_id;
    },
    isMobileOnly() {
      return this.$store.getters[getApp.ISMOBILEONLY];
    }
  },
  methods: {
    checkUserLogin() {
      if (this.localObject.pos_cashier.id) {
        this.user_id = this.localObject.pos_cashier.id;
      }
    },
    getTreeData(categories) {
      let rslt = [];
      
      // closure
      function subArrayMap(subArr, rsltArr) {
        for (let i = 0; i < subArr.length; i++) {
          if (subArr[i].children && subArr[i].children.length > 0) {
            let arrIndex =
              rsltArr.push({
                id: subArr[i].id,
                text: subArr[i].name,
                children: []
              }) - 1;
            subArrayMap(subArr[i].children, rsltArr[arrIndex].children);
          } else {
            rsltArr.push({ id: subArr[i].id, text: subArr[i].name });
          }
        }
      }

      //closure
      function arrayMap(arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children && arr[i].children.length > 0) {
            let arrIndex =
              rslt.push({ 
                id: arr[i].id, 
                text: arr[i].name, 
                children: [] 
              }) - 1;
            subArrayMap(arr[i].children, rslt[arrIndex].children);
            // console.log(rslt)
          } else {
            rslt.push({ id: arr[i].id, text: arr[i].name });
          }
        }
      }

      arrayMap(categories);
      return rslt;
    },
    addAction() {
      this.pos_offline = this.$root.$root.offline;
      if (this.pos_offline) {
        window.flashMessages = [
          {
            type: "alert-error",
            message: "Warning: You can not perform this action in offline mode!"
          }
        ];
        this.$root.addFlashMessages();
      } else {
        this.$validator.validateAll().then(result => {
          if (result) {
            this.$root.toggleButtonDisable(false);
            const $ = this;
            let fd = new FormData();
            fd.append("sku", $.product.sku);
            fd.append("product_name", $.product.productName);
            fd.append("price", $.product.price);
            fd.append("quantity", $.product.quantity);
            if ($.product.image.getChosenFile()) {
              fd.append("image", $.product.image.getChosenFile());
            }

            let dataChecked = [];
            if (this.$refs.tree.checked(true).length > 0) {
              const treeChecked = this.$refs.tree.checked(true);
              dataChecked = treeChecked.map(value => value.id);
              // console.log("dataChecked", Array.isArray(dataChecked));
              // console.log("dataChecked", dataChecked);
              // .map((value, index, array) => value.id)
              // fd.append("category_ids", dataChecked)
            }
            fd.append("category_ids", JSON.stringify(dataChecked));

            if ($.product.purchasePrice)
              fd.append("purchase_price", $.product.purchasePrice);
            if ($.product.lowStock) fd.append("low_stock", $.product.lowStock);
            if ($.product.weight) fd.append("weight", $.product.weight);
            if ($.product.height) fd.append("height", $.product.height);
            if ($.product.width) fd.append("width", $.product.width);
            if ($.product.depth) fd.append("depth", $.product.depth);

            console.log('fd', fd)

            // this.$http.post("/api/pos/auth/add-product", fd)
            addProducts(fd)
              .then(response => {
                if (!response.data.status) {
                  window.flashMessages = [
                    { type: "alert-error", message: response.data.message }
                  ];
                  this.$root.addFlashMessages();
                  this.$root.toggleButtonDisable(false);
                } else {
                  window.flashMessages = [
                    { type: "alert-success", message: response.data.message }
                  ];
                  this.$root.addFlashMessages();
                  this.$root.hideCommonModal("addProduct");
                  this.$root.toggleButtonDisable(false);

                  // this.$router.push({ name: response.data.route });
                  EventBus.$emit("getUserProducts");
                }
              })
              .catch(() => this.$root.toggleButtonDisable(false));
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/form.scss";
@import "@/assets/styles/grid.scss";

#add-product-form {
  .control-group {
    label {
      color: #6c757d;
    }
    .control {
      border: none;
      border-radius: 0;
      border-bottom: 1px solid #ced4da;

      &:hover {
        border-color: #ced4da !important;
      }

      &:focus {
        border-color: #28b318 !important;
      }
    }
  }
  .btn.btn-lg {
    padding: 8px 80px;
    font-size: 1rem;
  }

  .croppa-group {
    .croppa-label {
      display: block;
    }
    .croppa-control {
      width: auto;
      height: 7rem;
    }
  }

  .container-submit {
    padding-top: 0rem;

    &:disabled {
      background-color: #ccc;
    }
  }
}
</style>