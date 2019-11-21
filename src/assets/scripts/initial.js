window.pos_logo_default = 'assets/images/Logo.svg'
//window.pos_logo_image       = @json(Storage::url(core()->getConfigData('pos.configuration.general.pos_logo')));
//window.pos_logo_result      = @json(core()->getConfigData('pos.configuration.general.pos_logo'));
window.search_option   = 0
window.hide_barcode    = 1
window.default_channel = {
   base_currency_id:2
  ,code:'default'
  ,created_at:null
  ,default_locale:{
     code:'en'
    ,created_at:null
    ,direction:'ltr'
    ,id:1
    ,name:'English'
    ,updated_at:null
  }
  ,default_locale_id:1
  ,description:''
  ,favicon:null
  ,footer_content:'<div class="list-container"><span class="list-heading">Quick Links</span><ul class="list-group"><li><a href="">About Us</a></li><li><a href="">Return Policy</a></li><li><a href="">Refund Policy</a></li><li><a href="">Terms and conditions</a></li><li><a href="">Terms of Use</a></li><li><a href="">Contact Us</a></li></ul></div><div class="list-container"><span class="list-heading">Connect With Us</span><ul class="list-group"><li><a href="#"><span class="icon icon-facebook"></span>Facebook </a></li><li><a href="#"><span class="icon icon-twitter"></span>Twitter</a></li><li><a href="#"><span class="icon icon-instagram"></span>Instagram</a></li><li><a href="#"> <span class="icon icon-google-plus"></span>Google+</a></li><li><a href="#"> <span class="icon icon-linkedin"></span>LinkedIn</a></li></ul></div>'
  ,home_page_content:'<p>@include("shop::home.slider") @include("shop::home.featured-products") @include("shop::home.new-products")</p><div class="banner-container"><div class="left-banner"><img src="https://s3-ap-southeast-1.amazonaws.com/cdn.uvdesk.com/website/1/201902045c581f9494b8a1.png" /></div><div class="right-banner"><img src="https://s3-ap-southeast-1.amazonaws.com/cdn.uvdesk.com/website/1/201902045c581fb045cf02.png" /> <img src="https://s3-ap-southeast-1.amazonaws.com/cdn.uvdesk.com/website/1/201902045c581fc352d803.png" /></div></div>'
  ,home_seo:'{"meta_title":"Posku", "meta_keywords":"posku point-of-sale", "meta_description":"Posku"}'
  ,hostname:''
  ,id:1
  ,logo:null
  ,name:'Default'
  ,root_category_id:1
  ,theme:'default'
  ,timezone:null
  ,updated_at:'2019-10-21 13:53:43'
}
window.pos_currencies = [
  {
     code:'USD'
    ,created_at:null
    ,id:1
    ,name:'US Dollar'
    ,updated_at:null
  }
  ,{
     code:'IDR'
    ,created_at:'2019-10-21 13:51:17'
    ,id:2
    ,name:'Rupiah'
    ,updated_at:'2019-10-21 13:51:17'
  }
]
window.pos_default_currency = {
   code:'IDR'
  ,created_at:'2019-10-21 13:51:17'
  ,id:2
  ,name:'Rupiah'
  ,updated_at:'2019-10-21 13:51:17'
}
window.base_currency = {
   code:'IDR'
  ,created_at:'2019-10-21 13:51:17'
  ,id:2
  ,name:'Rupiah'
  ,updated_at:'2019-10-21 13:51:17'
}
window.base_currency_code   = 'IDR'
window.base_currency_symbol = 'Rp'
window.pos_currency_code    = 'IDR'
window.pos_currency_symbol  = 'Rp'
window.pos_locales          = [
  {
     code:'en'
    ,created_at:null
    ,direction:'ltr'
    ,id:1
    ,name:'English'
    ,updated_at:null
  }
  ,{
     code:'id'
    ,created_at:'2019-10-28 20:30:08'
    ,direction:'ltr'
    ,id:2
    ,name:'Bahasa Indonesia'
    ,updated_at:'2019-10-28 20:30:08'
  }
]
window.pos_default_locale   = 'en'
window.channel_logo         = null
window.app_base_url         = 'http://localhost:8000'
window.base_dir_url         = '/'
window.flashMessages        = []