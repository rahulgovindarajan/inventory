'use strict';
const common = require('../helper/common.js');
var Messages = require('../helper/Messages.js');

module.exports.inventory = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let postData = JSON.parse(event.body);
    console.log("postData == " + JSON.stringify(postData));



    if (postData.purchase_country && postData.gloves && postData.mask) {
        let country = postData.purchase_country;
        let passport = postData.optional_passport_number;
        let gloves = postData.gloves;
        let mask = postData.mask;
        let uk_mask_storage = 100;
        let uk_gloves_storage = 100;
        let gr_mask_storage = 100;
        let gr_gloves_storage = 50;
        let uk_mask = 65;
        let uk_gloves = 100;
        let gr_mask = 100;
        let gr_gloves = 150;
        let shipping = 400;
        let passport_country = await common.passport(passport);
        let Amount = 0;
        let mask_sortage = 0, gloves_sortage = 0, shipping_units = 0;

        if (country === "UK") {
            if (gloves > uk_gloves_storage + gr_gloves_storage || mask > uk_mask_storage + gr_mask_storage) {
                return common.response(false, "Out of Stock", 0, null);
            } else if (uk_mask_storage >= mask && uk_gloves_storage >= gloves) {
                Amount = gloves * uk_gloves + mask * uk_mask;
                let result = {
                    "Bill_Amount": Amount,
                    "Mask_UK": uk_mask_storage - mask,
                    "Mask_Germany": gr_mask_storage,
                    "Gloves_UK": uk_gloves_storage - gloves,
                    "Gloves_Germany": gr_gloves_storage
                }
                return common.response(false, Messages.SUCCESS, 1, result);
            } else {
                if (uk_mask_storage < mask) {
                    Amount = Amount + uk_mask_storage * uk_mask;
                    mask_sortage = mask - uk_mask_storage;
                    Amount = Amount + mask_sortage * gr_mask;
                    shipping_units = shipping_units + mask_sortage;
                } else {
                    Amount = Amount + mask * uk_mask;
                }
                if (uk_gloves_storage < gloves) {
                    Amount = Amount + uk_gloves_storage * uk_gloves;
                    gloves_sortage = gloves - uk_gloves_storage;
                    Amount = Amount + gloves_sortage * gr_gloves;
                    shipping_units = shipping_units + gloves_sortage;
                } else {
                    Amount = Amount + gloves * uk_gloves;
                }

                if (shipping_units % 10) {
                    shipping_units = Math.floor(shipping_units / 10);
                    shipping_units = shipping_units + 1;
                } else {
                    shipping_units = Math.floor(shipping_units / 10);
                }
                if (passport_country === "UK") {
                    Amount = Amount + shipping_units * shipping;
                } else if (passport_country === "GR") {
                    shipping = shipping_units * shipping;
                    Amount = Amount + (shipping / 100 * 80);
                } else {
                    Amount = Amount + shipping_units * shipping;
                }

                let result = {
                    "Bill_Amount": Amount,
                    "Mask_UK": mask_sortage > 1 ? 0 : uk_mask_storage - mask,
                    "Mask_Germany": mask_sortage > 1 ? gr_mask_storage - mask_sortage : gr_mask_storage,
                    "Gloves_UK": gloves_sortage > 1 ? 0 : uk_gloves_storage - gloves,
                    "Gloves_Germany": gloves_sortage > 1 ? gr_gloves_storage - gloves_sortage : gr_gloves_storage
                }
                return common.response(false, Messages.SUCCESS, 1, result);
            }

        } else if (country === "Germany") {
            if (gloves > uk_gloves_storage + gr_gloves_storage || mask > uk_mask_storage + gr_mask_storage) {
                return common.response(false, "Out of Stock", 0, null);
            } else if (passport_country === "UK") {
                let buy_mask_gr = mask % 10;
                let buy_mask_uk = mask - buy_mask_gr;

                if (buy_mask_gr) {
                    Amount = Amount + buy_mask_gr * gr_mask;
                }
                if (buy_mask_uk) {
                    Amount = Amount + buy_mask_uk * uk_mask;
                    shipping_units = shipping_units + buy_mask_uk / 10;
                }

                let buy_gloves_gr = gloves % 10;
                let buy_gloves_uk = gloves - buy_gloves_gr;
                let parity = 0;
                parity = buy_gloves_gr > 6 ? 1 : 0; 
                if (parity === 1) {
                    buy_gloves_uk = buy_gloves_uk + buy_gloves_gr;
                    Amount = Amount + buy_gloves_uk * uk_gloves; 
                    shipping_units = shipping_units + buy_gloves_uk / 10;
                } if (parity === 0) {
                    Amount = Amount + buy_gloves_uk * uk_gloves;
                    shipping_units = shipping_units + buy_gloves_uk / 10;
                    Amount = Amount + buy_gloves_gr * gr_gloves;
                }
                shipping = shipping_units * shipping;
                Amount = Amount + (shipping / 100 * 80); 
                let result = {
                    "Bill_Amount": Amount,
                    "Mask_UK": buy_mask_uk > 1 ? uk_mask_storage - buy_mask_uk : uk_mask_storage,
                    "Mask_Germany": buy_mask_gr > 1 ? gr_mask_storage - buy_mask_gr : gr_mask_storage,
                    "Gloves_UK": uk_gloves_storage - buy_gloves_uk,
                    "Gloves_Germany": parity === 0 ? gr_gloves_storage - buy_gloves_gr : gr_gloves_storage
                }
                return common.response(false, Messages.Success, 1, result);
            } else if (passport_country === "GR" || !passport_country) {

                if (gr_mask_storage < mask) {
                    Amount = Amount + gr_mask_storage * gr_mask;
                    mask_sortage = mask - gr_mask_storage;
                    Amount = Amount + mask_sortage * uk_mask;
                    shipping_units = shipping_units + mask_sortage;
                } else {
                    Amount = Amount + mask * gr_mask;
                }

                let buy_gloves_gr = gloves % 10;
                let buy_gloves_uk = gloves - buy_gloves_gr;
                let parity = 0;
                parity = buy_gloves_gr > 8 ? 1 : 0; console.log(parity)
                if (parity === 1) {
                    buy_gloves_uk = buy_gloves_uk + buy_gloves_gr;
                    Amount = Amount + buy_gloves_uk * uk_gloves; console.log(buy_gloves_uk)
                    shipping_units = shipping_units + buy_gloves_uk / 10;
                } if (parity === 0) {
                    Amount = Amount + buy_gloves_uk * uk_gloves;
                    shipping_units = shipping_units + buy_gloves_uk / 10;
                    Amount = Amount + buy_gloves_gr * gr_gloves;
                }
                shipping = shipping_units * shipping;
                Amount = Amount + shipping ; 
                let result = {
                    "Bill_Amount": Amount,
                    "Mask_UK": mask_sortage > 1 ? uk_mask_storage - mask_sortage : uk_mask_storage,
                    "Mask_Germany": mask_sortage > 1 ? 0  : gr_mask_storage - mask,
                    "Gloves_UK": uk_gloves_storage - buy_gloves_uk,
                    "Gloves_Germany": parity === 0 ? gr_gloves_storage - buy_gloves_gr : gr_gloves_storage
                }
                return common.response(false, Messages.Success, 1, result);
            }
            return common.response(false, "INvalid country", 0, null);

        } else {
            return common.response(false, Messages.INVALID_INPUT, 0, null);

        }
    }
};
