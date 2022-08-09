/*
 * @Descripttion:
 * @version:
 * @Author: ared
 * @Date: 2022-06-01 17:23:09
 * @LastEditors: ared
 * @LastEditTime: 2022-06-28 10:28:52
 */
import { getUrl } from '@/chrome'
import { deep } from '@/lib'
export const mediaImgMap = {
  facebook: getUrl('images/social-media/im-facebook@2x.png'),
  youtube: getUrl('images/social-media/im-youtube@2x.png'),
  twitter: getUrl('images/social-media/im-twiter@2x.png'),
  instagram: getUrl('images/social-media/im-ins@2x.png'),
  pinterest: getUrl('images/social-media/im-pin@2x.png'),
}
export const productsDesIcon = {
  price: getUrl('images/products/price.png'),
  data: getUrl('images/products/data.png'),
  qrcode: getUrl('images/products/qrcode.png'),
  time: getUrl('images/products/time.png'),
  rank: getUrl('images/products/trophy.png'),
}
export const emailReg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/
export const passwordReg = /^[^\s]{6,}$/

// 适用于shopify站点的导出
export const exportDataHandle = prods => {
  console.log(prods, 'prods 所有商品=======')
  const exportData = prods.map(item => {
    const variantOptions = item.variants.map((variant, index) => {
      let optionsObj = item.options.reduce((acc, cur, curIdx) => {
        return (acc = {
          ...acc,
          [`Option${curIdx + 1} Name`]: cur.name,
          [`Option${curIdx + 1} Value`]: variant[`option${curIdx + 1}`],
        })
      }, {})
      if (index === 0) {
        return {
          Handle: item.handle,
          Title: item.title,
          ['Body (HTML)']: item.body_html,
          Vendor: item.vendor,
          Type: item.product_type,
          Tags: Array.isArray(item.tags) ? item.tags.join() : item.tags,
          Published: false,
          ...{
            ['Option1 Name']: null,
            ['Option1 Value']: null,
            ['Option2 Name']: null,
            ['Option2 Value']: null,
            ['Option3 Name']: null,
            ['Option3 Value']: null,
            ...optionsObj,
          },
          ['Variant Sku']: variant.sku,
          ['Variant Grams']: variant.grams,
          ['Variant Inventory Tracker']: null,
          ['Variant Inventory Qty']: null,
          ['Variant Inventory Policy']: 'deny',
          ['Variant Fulfillment Service']: 'manual',
          ['Variant Price']: variant.price,
          ['Variant Compare At Price']: variant.compare_at_price,
          ['Variant Requires Shipping']: variant.requires_shipping,
          ['Variant Taxable']: variant.taxable,
          ['Variant Barcode']: null,
          ['Image Src']: item.images[index]?.src ?? item.images[0],
          ['Image Position']: item?.images?.length === 0 ? null : variant.position,
          ['Image Alt Text']: null,
          ['Gift Card']: false,
          ['SEO Title']: null,
          ['Google Shopping / Google Product Category']: null,
          ['Google Shopping / Gender']: null,
          ['Google Shopping / Age Group']: null,
          ['Google Shopping / MPN']: null,
          ['Google Shopping / AdWords Grouping']: null,
          ['Google Shopping / AdWords Labels']: null,
          ['Google Shopping / Condition']: null,
          ['Google Shopping / Custom Product']: null,
          ['Google Shopping / Custom Label 0']: null,
          ['Google Shopping / Custom Label 1']: null,
          ['Google Shopping / Custom Label 2']: null,
          ['Google Shopping / Custom Label 3']: null,
          ['Google Shopping / Custom Label 4']: null,
          ['Variant Image']: null,
          ['Variant Weight Unit']: null,
          ['Variant Tax Code']: null,
          ['Cost per item']: null,
          ['Status']: 'draft',
        }
      }
      return {
        Handle: item.handle,
        Title: null,
        ['Body (HTML)']: null,
        Vendor: null,
        Type: null,
        Tags: null,
        Published: null,
        ...{
          ['Option1 Name']: null,
          ['Option1 Value']: null,
          ['Option2 Name']: null,
          ['Option2 Value']: null,
          ['Option3 Name']: null,
          ['Option3 Value']: null,
          ...optionsObj,
        },
        ['Variant Sku']: variant.sku,
        ['Variant Grams']: variant.grams,
        ['Variant Inventory Tracker']: null,
        ['Variant Inventory Qty']: null,
        ['Variant Inventory Policy']: 'deny',
        ['Variant Fulfillment Service']: 'manual',
        ['Variant Price']: variant.price,
        ['Variant Compare At Price']: variant.compare_at_price,
        ['Variant Requires Shipping']: variant.requires_shipping,
        ['Variant Taxable']: variant.taxable,
        ['Variant Barcode']: null,
        ['Image Src']: item.images[index]?.src ?? item.images[0]?.src,
        ['Image Position']: item?.images?.length === 0 ? null : variant.position,
        ['Image Alt Text']: null,
        ['Gift Card']: null,
        ['SEO Title']: null,
        ['Google Shopping / Google Product Category']: null,
        ['Google Shopping / Gender']: null,
        ['Google Shopping / Age Group']: null,
        ['Google Shopping / MPN']: null,
        ['Google Shopping / AdWords Grouping']: null,
        ['Google Shopping / AdWords Labels']: null,
        ['Google Shopping / Condition']: null,
        ['Google Shopping / Custom Product']: null,
        ['Google Shopping / Custom Label 0']: null,
        ['Google Shopping / Custom Label 1']: null,
        ['Google Shopping / Custom Label 2']: null,
        ['Google Shopping / Custom Label 3']: null,
        ['Google Shopping / Custom Label 4']: null,
        ['Variant Image']: null,
        ['Variant Weight Unit']: null,
        ['Variant Tax Code']: null,
        ['Cost per item']: null,
        ['Status']: 'draft',
      }
    })
    return variantOptions
  })
  // 扁平化数组
  return [].concat(...exportData)
}
