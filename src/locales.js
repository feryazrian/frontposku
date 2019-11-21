/*eslint-disable*/

export const messages = {
    en: {
        general:{
            and:'and'
        },
        pos_login: {
            title: 'Pos Login',
            username: 'User Name',
            password: 'Password',
            remember_password: 'Remember Password',
            button_title: 'Log In',
            forgot_passward: 'Forgot Password?',
            footer_note: 'A Product Of <a href="{url}" target="_blank">WEBKUL</a>',
            invalid_creds: 'Warning: Please check your credentials and try again!',
            unauth_user: 'Warning: You are not pos authorized user, please contact to admin!',
            registerLink: 'Do not have an account?'
        },
        pos_register:{
            title: 'Pos Register',
            mainTitle: 'Register',
            name: 'Name',
            address: 'Address',
            state: 'State',
            city: 'City',
            postcode: 'Postal Code',
            button_title: 'Register',
            first_name: 'First Name',
            last_name: 'Last Name',
            email: 'Email',
            phone: 'Phone',
            identifier:'Your email or phone number',
            password: 'Password',
            minute:'minutes',
            confirm_password: 'Confirm Password',
            registrationCode: 'Registration Code',
            buttonCreateOTP: 'Next',
            buttonVerifyOTP: 'Verify',
            subtitles: [ 'Already have an acoount?', 'Sign in' ],
            verificationCode: 'Verification Code',
            emailVerificationSubtitle1: 'Verification code has sent to your email',
            emailVerificationSubtitle2: 'Please check and enter the code before the time expires',
            phoneVerificationSubtitle1: 'Verification code has sent to your phone',
            phoneVerificationSubtitle2: 'Please check and enter the last 4-digits before the time expires',
            agreement:'By register, I agree to the',
            term:'Terms & Conditions',
            privacy:'Privacy Policy'
        },
        pos_view: {
            title: 'Pos System',
            error_offline_mode: 'Warning: Currently you are in offline mode!',
            error_offline_action: 'Warning: You can not perform this action in offline mode!',
            online_mode: 'Success: You have successfully entered in online mode!',
            offline_mode: 'Warning: You have successfully entered in offline mode!',
            licenceModal:{
               title:'Upgrade Licence'
              ,placeholderLicence:'Your Licence'
              ,submitText:'Activation'
            }
        },
        pos_activation:{
            title:'Activation | POSKU'
            ,licenceModal:{
               title:'Upgrade Licence'
              ,placeholderLicence:'Your Licence'
              ,submitText:'Activation'
            }
        },
        pos_home: {
            title: 'Pos System',
            navtop: {
                heading: 'Point Of Sale',
                search_placeholder: 'Search product by Name, SKU',
                btn_search: 'Search',
                offline_mode: 'Offline Mode',
                refresh: 'Refresh',
                entry_product_search: 'Search Product',
                search_barcode_placeholder: 'Search Product Through Barcode',
                cashier: 'Cashier',
                add_custom_product: 'Add Custom Product',
                entry_product_name: 'Product Name',
                entry_price: 'Price',
                entry_quantity: 'Quantity',
                entry_product_image: 'Product Image',
                button_cart: 'Add To Cart',
                success_add_to_cart: 'Success: Custom product added to current cart successfully!',
                add_custom_product_tooltip: 'Add Custom Product',
                reset_data_tooltip: 'Reset Pos Data',
                offline_mode_tooltip: 'Switch To Offline/Online Mode',
                logout_tooltip: 'Logout User',
            },
            navleft: {
                help: 'Help',
                logout: 'Logout',
                view_outlet: 'View Outlet'
            },
            navbottom: {
                pay_now: 'Pay Now'
            },
            pos_categories: {
                all: 'All',
                selected: 'Select Category'
            },
            pos_products: {
                product_variation: 'Product Variations',
                product_discount_tooltip: 'Info: This product is on discount.',
                product_variation_tooltip: 'Info: This product contains variations.',
                warning_select_product_variation: 'Please select above options first.',
                success_add_to_cart: 'Success: Product added to cart successfully!',
                btn_done: 'Done',
                error: {
                    no_product: 'Warning: No product found under this category.',
                    no_barcode_provided: 'Warning: provide barcode to search the product!',
                    no_barcode_product: 'Warning: No product found in this outlet related to provided barcode.',
                    no_quantity: 'Warning: The quantity for this product is not available.',
                }
            },
            pos_cart: {
                cart_details: 'Cart Details',
                text_with: 'with',
                text_unit: 'Unit(s)',
                text_per_unit: 'per unit',
                delete_current_cart: 'Delete Current Cart',
                button_customer: 'Customer',
                button_pay: 'Pay',
                button_pay_now: 'Pay Now',
                button_hold: ' Hold',
                text_cart_empty: 'Current cart is empty!',
                apply_discount: 'Apply Discount To Cart',
                entry_available_discount: 'Choose Discount',
                entry_select_discount: '-- Select Discount --',
                button_apply_discount: 'Apply Discount',
                hold_order_note: 'Order Note',
                entry_order_note: 'Provide Order Note',
                placeholder_note: 'Enter note for order..',
                button_hold_order: 'Hold Order',
                button_cancel: 'Cancel',
                success_hold_cart: 'Success: Current cart has been added to the hold list successfully!',
                text_error: 'Error',
                text_confirm: 'Confirm',
                text_confirm_msg: 'Confirm: This process will generate an order depending upon the status Online or Offline. Do you still wanna do it.?',
                text_cancel: 'Cancel',
                text_sub_total: 'Sub Total',
                text_discount: 'Discount',
                text_tax_total: 'Tax Total',
                text_home_delivery: 'Home Delivery',
                text_grand_total: 'Grand Total',
                text_customer: 'Customer',
                text_choose_customer: 'Choose Customer',
                error: {
                    error_plus_cart: 'Warning: You can not add cart more than {cart_count} !',
                    error_cart_empty: 'Warning: Current cart is empty!',
                    error_customer_empty: 'Warning: You have to select customer first for this order!',
                    text_amount_error: 'Warning: Entered amount cannot be paid!',
                    error_no_cart: 'Warning: There is no cart available, try again!',
                    error_no_product: 'Warning: There is no product added to the current cart, try again!',
                    error_no_customer: 'Warning: No customer selected for the current cart, try again!',
                    error_select_all_attributes: 'Warning: Please selcted all product attributes!',
                }
            }
        },
        pos_add_custom_product: {
            header: 'Add Products',
            title: 'Pos Add Custom Products'
        },
        pos_add_customer: {
            header: 'Add Customer',
            title: 'Pos Add Customer'
        },
        pos_cart_details: {
            header: 'Cart Details',
            title: 'Cart Details'
        },
        pos_view_outlet: {
            header: 'View Outlet Profile',
            title: 'View Outlet',
            label_outlet_name: 'Outlet Name',
            label_outlet_address: 'Outlet Address',
            label_outlet_state: 'Outlet State',
            label_outlet_country: 'Outlet Country',
            label_outlet_postcode: 'Outlet Postcode'
        },
        pos_payment: {
            header: 'Payment',
            title: 'Pos Payment',
            heading_title: 'Payment',
            heading_order_print: 'Print Invoice',
            text_total_amount_due: 'Total Amount Due',
            label_payment_method: 'Payment Method',
            vertical_menu: {
                text_cash: ' Cash Payment',
                text_credit: ' Credit Payment',
            },
            pos_cash: {
                text_total: 'Total',
                text_tendered: 'Tendered',
                text_change: 'Change',
                placeholder_order_comment: 'Add order note here...',
                button_confirm_pay: '  Confirm Payment',
            },
            btn_print: 'Print',
            btn_skip: 'Skip',
            success_offline_order: 'Success: Order has been placed in Offline Mode successfully!',
            text_order_success: 'Success: Your Order has been placed successfully!',
        },
        pos_payment_cash: {
            header: 'Payment',
            title: 'Cash Payment',
        },
        pos_payment_credit: {
            header: 'Payment',
            title: 'Credit Payment',
        },
        pos_sales: {
            title: 'Pos Sales',
            top_menu: {
                sales_history: 'Sale History',
                hold_sale: 'Hold Sale',
                offline_sale: 'Offline Sale',
            },
            menu_content: {
                sales_history: {
                    placeholder_search: 'Search by order id',
                    text_order_id: 'Order ID',
                    text_order_date: 'Order Date',
                    text_customer_info: 'Customer Detail',
                    text_order_note: 'Order Note',
                    button_print_invoice: 'Print Invoice',
                    button_send_invoice: 'Send Invoice',
                    text_order_summary: 'Order Summary',
                    text_units: ' Unit(s)',
                    text_per_unit: ' per unit',
                    text_sub_total: 'Sub Total',
                    text_discount: 'Discount (-)',
                    text_taxes: 'Taxes (+)',
                    text_grand_total: 'Total',
                    text_mode_cash: 'Cash Payment',
                    text_mode_card: 'Card Payment',
                    text_balance: 'Balance',
                    text_cust: 'Cust'
                },
                hold_sales: {
                    text_note: ' Note',
                    text_hold_product_details: 'Hold Products Details',
                    button_cart: ' Add To Cart',
                    button_delete: ' Remove',
                    success_remove_hold: 'Success: The current cart has been deleted successfully!',
                    success_move_cart: 'Success: The selected hold cart has been moved to the current cart successfully!',
                    no_hold_order: 'Warning: There is no hold order available!',
                },
                offline_sales: {
                    no_offline_order: 'Warning: There is no offline order found!',
                    btn_all_sync: 'Sync All Offline Order(s)',
                    sync_all_order: 'Synchronize All Offline Order(s)',
                }
            },
            error: {
                no_order_record: 'Warning: No Order Found!',
            }
        },
        pos_sales_history: {
            header: 'Sales',
            title: 'Sales History'
        },
        pos_sales_hold: {
            header: 'Sales',
            title: 'Hold Order'
        },
        pos_sales_offline: {
            header: 'Sales',
            title: 'Offline Sale'
        },
        pos_sale_order_summary: {
            header: 'Order Summary',
            title: 'Order Summary'
        },
        pos_hold_sale_detail: {
            header: 'Hold Sale Detail',
            title: 'Hold Sales'
        },
        pos_offline_sale_detail: {
            header: 'Offline Sale Detail',
            title: 'Offline Sales',
            text_order_id: 'Order ID',
            text_order_ref_id: 'Order Ref ID',
            text_order_date: 'Order Date',
            text_customer_detail: 'Customer Detail',
            text_note: 'Note'
        },
        pos_customer: {
            header: 'Customer',
            title: 'Pos Customer',
            top_menu: {
                title: 'Customers',
            },
            menu_content: {
                search_area: {
                    placeholder_search: 'Search Customer By Name',
                },
                add_customer: ' Add Customer',
                edit_customer: ' Edit Customer',
                customer_detail: 'Customer Detail',
                success_customer_cart: 'Success: Customer has been selected for checkout!',
                success_customer_already_cart: 'Success: This Customer already selected for checkout!',
                success_customer_remove: 'Success: Cart customer removed successfully!',
                button_select_customer: 'Select Customer',
                text_edit: ' Edit',
                text_remove: ' Remove',
                text_detail: ' Detail',
                entry_firstname: 'First Name',
                entry_lastname: 'Last Name',
                entry_email: 'Email',
                entry_phone: 'Phone',
                entry_gender: 'Gender',
                entry_male: 'Male',
                entry_female: 'Female',
                entry_dob: 'Date Of Birth',
                entry_customer_group: 'Customer Group',
                button_save: 'Save',
                button_select: 'Select'
            },
            error: {
                no_customer_record: 'Warning: No Customer Found!',
                no_customer_selected: 'Warning: Currently no customer is selected!',
            }
        },
        pos_cashier: {            
            title: 'Pos Cashier',
            top_menu: {
                close_counter: 'Close Counter',
                today_cash: 'Today Cash',
                sales_history: 'Sales History'
            },
            menu_content: {
                text_opening_amount: 'Drawer Opening Amount',
                entry_amount: 'Opening Amount',
                entry_remark: 'Remarks',
                button_open_store: 'Open Store',
                close_counter: {
                    text_drawer_amount: 'Drawer Amount Details',
                    text_counted_amount: 'Counted Drawer Amount',
                    text_closing_details: 'Closing Drawer Details',
                    text_open_amount: 'Opening Amount',
                    text_total_cash: 'Today\'s Total Cash Amount',
                    text_current_drawer_sale: 'Current Drawer Sale',
                    text_expected_amount: 'Expected Amount In Drawer',
                    text_amount: 'Amount ({currency})',
                    text_remark: 'Remark',
                    text_remark_placeholder: 'Comment regarding cash balance..',
                    text_difference: 'Difference between Opening and Current Drawer Sale Amount',
                    button_close_drawer: 'Close Drawer',
                }
            },
            sale_details: {
                title: 'Sale Details',
                base_grant_total: 'Total'
            }
        },
        pos_cashier_closecounter: {
            header: 'Cashier',
            title: 'Close Counter'
        },
        pos_cashier_todaycash: {
            header: 'Cashier',
            title: 'Today Cash'
        },
        pos_cashier_saleshistory: {
            header: 'Cashier',
            title: 'Sales History'
        },
        pos_reports: {
            title: 'Pos Reports'
        },
        pos_product: {
            title: 'Pos Product',
            top_menu: {
                low_stock: 'Low Stock Product',
                // request_list: 'Requested Products',
                request_list: 'List Products',
                setting: 'Setting'
            },
            menu_content: {
                low_stock: {
                    text_left: ' Left',
                    text_request_product: 'Request Product',
                    request_product: 'Add Product for Stock Request',
                    entry_required_qty: 'Required Quantity',
                    entry_required_price: 'Required Price',
                    entry_required_modal: 'Modal',
                    entry_request_to_supplier: 'Request To Supplier',
                    entry_select: 'Select Supplier',
                    text_qty: ' Qty',
                    entry_supplier_name: 'Supplier Name',
                    entry_comment: 'Comment',
                    button_add: 'Update Product',
                    button_send: 'Send Request'
                },
                request_list: {
                    column_id: 'Id',
                    column_name: 'Product Name',
                    column_qty: 'Qty',
                    column_supplier: 'Supplier',
                    column_comment: 'Comment',
                    column_date: 'Date',
                    column_status: 'Status',
                    no_record_found: 'No Request Found',
                    action_pending: 'Pending',
                    action_complete: 'Complete',
                    action_decline: 'Decline',
                },

                new_product: {
                    add_product: 'Add Product',
                    sku: 'SKU',
                    product_name: 'Product Name',
                    entry_price: 'Price',
                    entry_purchase_price: 'Purchase Price',
                    entry_quantity: 'Quantity',
                    low_stock: 'Low Stock',
                    entry_weight: 'Weight',
                    entry_width: 'Width',
                    entry_height: 'Height',
                    entry_depth: 'Depth',
                    categories: 'Categories',
                    entry_product_image: 'Product Image',
                    button_add: 'Add Product',
                    success_add_to_cart: 'Success: Custom product added to current cart successfully!',
                    categories_error_message: 'The categories field is required'
                },

                setting: {
                    entry_product_setting: 'Pos Product Setting',
                    entry_low_stock: 'Minimum Unit of Quantity for Low Stock Product',
                    button_done: 'Done'
                }
            },
            error: {
                no_lowstock_product: 'Warning: There is no low stock product!'
            }
        },
        pos_product_low_stock: {
            header: 'Product',
            title: 'Low Stock Products'
        },
        pos_product_requested: {
            header: 'Product',
            title: 'Requested Products',
            placeholder_search: 'Search Requested-Product By Name'
        },
        pos_product_setting: {
            header: 'Product',
            title: 'Product Setting'
        },
        pos_setting: {
            title: 'Pos Setting',
            top_menu: {
                discount: 'Loyalty Discount',
                taxes: 'Taxes',
                basic_settings: 'Basic Settings',
                profile_setting: 'Profile Setting'
            },
            menu_content: {
                discount: {
                    text_discount: 'Discount Form',
                    add_discount: 'Add Discount',
                    edit_discount: 'Edit Discount',
                    entry_offer_name: 'Offer Name',
                    offer_name: 'Enter Offer Name',
                    entry_from_price: 'From Price',
                    entry_to_price: 'To Price',
                    entry_discount_type: 'Discount Type',
                    entry_discount_value: 'Value',
                    entry_fix: 'Fixed',
                    entry_percentage: 'Percentage',
                    button_done: 'Done',
                    text_range: 'Range',
                    text_to: 'To',
                },
                tax: {
                    text_tax: 'Tax Form',
                    add_tax: 'Add Tax',
                    edit_tax: 'Edit Tax',
                    button_done: 'Done'
                },
                basic: {
                    entry_select_locale: 'Select Locale',
                    entry_select_currency: 'Select Currency'
                },
                profile: {
                    entry_user_profile: 'User Profile Setting',
                    entry_firstname: 'First Name',
                    entry_lastname: 'Last Name',
                    entry_username: 'Username',
                    entry_email: 'Account E-mail',
                    entry_phone: 'Phone',
                    entry_pre_password: 'Previous Password',
                    entry_new_password: 'New Password',
                    entry_confirm_password: 'Confirm Password',
                    entry_avatar: 'Avatar',
                    button_done: 'Done'
                }
            },
            error: {
                required_fromprice: 'Warning: Fill from-price field!',
                required_toprice: 'Warning: Fill to-price field!',
                grather_fromprice: 'Warning: from-price can not greater than to-price',
                no_discount: 'Warning: No discount available!',
                no_taxes: 'Warning: No taxes available!'
            }
        },
        pos_setting_discount: {
            header: 'Settings',
            title: 'Pos Discount'
        },
        pos_setting_taxes: {
            title: 'Pos Taxes'
        },
        pos_setting_basic: {
            header: 'Settings',
            title: 'Pos Basic Setting'
        },
        pos_setting_profile: {
            header: 'Settings',
            title: 'Pos Profile'
        },
        pos_help: {
            header: 'Help',
            title: 'Help',
            faqs: 'FAQs'
        }
    },
    ar: {
        pos_login: {
            title: 'موقف تسجيل الدخول',
            username: 'اسم المستخدم',
            password: 'كلمه السر',
            remember_password: 'تذكر كلمة المرور',
            button_title: 'تسجيل الدخول',
            forgot_passward: 'هل نسيت كلمة المرور؟',
            footer_note: 'منتج من <a href="{url}" target="_blank"> WEBKUL </a>',
            invalid_creds: 'تحذير: يرجى التحقق من بيانات الاعتماد والمحاولة مرة أخرى!',
            unauth_user: 'تحذير: أنت لست مستخدمًا معتمدًا ، يرجى الاتصال بالمشرف!'
        },
        pos_view: {
            title: 'نظام نقاط البيع',
            error_offline_mode: 'تحذير: أنت حاليًا في وضع عدم الاتصال!',
            error_offline_action: 'تحذير: لا يمكنك تنفيذ هذا الإجراء في وضع عدم الاتصال!',
        },
        pos_home: {
            title: 'نظام نقاط البيع',
            navtop: {
                heading: 'نقطة البيع',
                search_placeholder: 'بحث المنتج حسب الاسم ، سكو',
                btn_search: 'بحث',
                entry_product_search: 'بحث المنتج',
                search_barcode_placeholder: 'البحث عن المنتج من خلال الباركود ..',
                cashier: 'أمين الصندوق',
                add_custom_product: 'إضافة منتج مخصص',
                entry_product_name: 'اسم المنتج',
                entry_price: 'السعر',
                entry_quantity: 'كمية',
                button_cart: 'أضف إلى السلة',
                success_add_to_cart: 'نجاح: تم إضافة منتج مخصص إلى العربة الحالية بنجاح!',
                add_custom_product_tooltip: 'إضافة منتج مخصص',
                reset_data_tooltip: 'إعادة تعيين بيانات نقاط البيع',
                offline_mode_tooltip: 'التبديل إلى وضع عدم الاتصال / عبر الإنترنت',
                logout_tooltip: 'تسجيل خروج المستخدم',
            },
            pos_categories: {
                all: 'الكل',
                selected: 'اختر الفئة'
            },
            pos_products: {
                product_variation: 'الاختلافات المنتج',
                product_discount_tooltip: 'معلومات: هذا المنتج هو على الخصم.',
                product_variation_tooltip: 'معلومات: هذا المنتج يحتوي على الاختلافات.',
                warning_select_product_variation: 'يرجى اختيار الخيارات أعلاه أولا.',
                btn_done: 'فعله',
                error: {
                    no_product: 'تحذير: لا يوجد منتج موجود تحت هذا التصنيف.',
                    no_barcode_provided: 'تحذير: قم بتوفير الباركود للبحث في المنتج!',
                    no_barcode_product: 'تحذير: لا يوجد منتج موجود في هذا المنفذ يتعلق بالباركود المقدم.',
                }
            },
            pos_cart: {
                cart_details: 'تفاصيل العربة',
                text_with: 'مع',
                text_unit: 'وحدة (ق)',
                text_per_unit: 'لكل وحدة',
                delete_current_cart: 'حذف العربة الحالية',
                button_customer: 'زبون',
                button_pay: 'دفع',
                button_hold: ' معلق',
                text_cart_empty: 'العربة الحالية فارغة!',
                apply_discount: 'تطبيق الخصم على العربة',
                entry_available_discount: 'اختيار الخصم',
                entry_select_discount: '- اختر الخصم -',
                button_apply_discount: 'تطبيق الخصم',
                hold_order_note: 'طلب ملاحظة',
                entry_order_note: 'تقديم مذكرة النظام',
                placeholder_note: 'أدخل ملاحظة للطلب ..',
                button_hold_order: 'عقد النظام',
                button_cancel: 'إلغاء',
                success_hold_cart: 'النجاح: تمت إضافة السلة الحالية إلى قائمة الانتظار بنجاح!',
                text_error: 'خطأ',
                text_confirm: 'تؤكد',
                text_confirm_msg: 'تأكيد: ستنشئ هذه العملية طلبًا اعتمادًا على الحالة عبر الإنترنت أو دون اتصال هل ما زلت تريد أن تفعل ذلك؟',
                text_cancel: 'إلغاء',
                text_sub_total: 'المجموع الفرعي',
                text_discount: 'خصم',
                text_tax_total: 'مجموع الضرائب',
                text_home_delivery: 'توصيل منزلي',
                text_grand_total: 'المجموع الكلي',
                error: {
                    error_plus_cart: 'تحذير: لا يمكنك إضافة سلة التسوق أكثر من {cart_count}!',
                    error_cart_empty: 'تحذير: العربة الحالية فارغة!',
                    error_customer_empty: 'تحذير: يجب عليك تحديد العميل أولاً لهذا الطلب!',
                    text_amount_error: 'تحذير: لا يمكن دفع المبلغ المدخل!',
                    error_no_cart: 'تحذير: لا يوجد عربة متوفرة ، حاول مرة أخرى!',
                    error_no_product: 'تحذير: لا يوجد منتج مضاف إلى السلة الحالية ، أعد المحاولة!',
                    error_no_customer: 'تحذير: لم يتم اختيار عميل للسلة الحالية ، حاول مرة أخرى!',

                }
            }
        },
        pos_payment: {
            title: 'الدفع بوس',
            heading_title: 'دفع',
            heading_order_print: 'فاتورة طباعة',
            vertical_menu: {
                text_cash: ' دفع نقدا',
                text_credit: ' دفعة ائتمانية',
            },
            pos_cash: {
                text_total: 'مجموع',
                text_tendered: 'مناقصة',
                text_change: 'يتغيرون',
                placeholder_order_comment: 'إضافة ملاحظة الطلب هنا ...',
                button_confirm_pay: '  تأكيد الدفع',
            },
            btn_print: 'طباعة',
            btn_skip: 'تخطى',
            success_offline_order: 'النجاح: تم وضع الطلب في وضع عدم الاتصال بنجاح!',
            text_order_success: 'النجاح: تم وضع طلبك بنجاح!',
        },
        pos_payment_cash: {
            title: 'دفع نقدا',
        },
        pos_payment_credit: {
            title: 'دفعة ائتمانية',
        },
        pos_sales: {
            title: 'نقاط البيع المبيعات',
            top_menu: {
                sales_history: 'بيع التاريخ',
                hold_sale: 'عقد بيع',
                offline_sale: 'بيع حاليا',
            },
            menu_content: {
                sales_history: {
                    placeholder_search: 'البحث عن طريق معرف الطلب',
                    text_order_id: 'رقم التعريف الخاص بالطلب',
                    text_order_date: 'تاريخ الطلب',
                    text_customer_info: 'تفاصيل العملاء',
                    text_order_note: 'طلب ملاحظة',
                    button_print_invoice: 'فاتورة طباعة',
                    text_order_summary: 'ملخص الطلب',
                    text_units: 'وحدة (ق)',
                    text_per_unit: ' لكل وحدة',
                    text_sub_total: 'المجموع الفرعي',
                    text_discount: 'خصم (-)',
                    text_taxes: 'الضرائب (+)',
                    text_grand_total: 'مجموع',
                    text_mode_cash: 'دفع نقدا',
                    text_mode_card: 'بطاقه ائتمان',
                    text_balance: 'توازن',
                },
                hold_sales: {
                    text_note: 'ملحوظة',
                    text_hold_product_details: 'عقد تفاصيل المنتجات',
                    button_cart: 'أضف إلى السلة',
                    button_delete: 'إزالة',
                    success_remove_hold: 'النجاح: تم حذف العربة الحالية بنجاح!',
                    success_move_cart: 'النجاح: تم نقل عربة الانتظار المحددة إلى العربة الحالية بنجاح!',
                    no_hold_order: 'تحذير: لا يوجد أمر تعليق متاح!',
                },
                offline_sales: {
                    no_offline_order: 'تحذير: لا يوجد طلب غير متصل!',
                    btn_all_sync: 'مزامنة جميع الطلبات غير المتصلة',
                }
            },
            error: {
                no_order_record: 'تحذير: لم يتم العثور على أي طلب!',
            }
        },
        pos_sales_history: {
            title: 'تاريخ المبيعات'
        },
        pos_sales_hold: {
            title: 'عقد النظام'
        },
        pos_sales_offline: {
            title: 'بيع حاليا'
        },
        pos_customer: {
            title: 'نقاط البيع العملاء',
            top_menu: {
                title: 'الزبائن',
            },
            menu_content: {
                search_area: {
                    placeholder_search: 'بحث العملاء حسب الاسم',
                },
                add_customer: 'إضافة العملاء',
                edit_customer: 'تحرير العملاء',
                success_customer_cart: 'النجاح: تم اختيار الزبون للخروج!',
                success_customer_already_cart: 'النجاح: تم تحديد هذا العميل بالفعل لإجراء عملية السحب!',
                success_customer_remove: 'النجاح: تمت إزالة عميل عربة التسوق بنجاح!',
                button_select_customer: 'اختيار العملاء',
                text_edit: ' تصحيح',
                text_remove: ' إزالة',
                entry_firstname: 'الاسم الاول',
                entry_lastname: 'الكنية',
                entry_email: 'البريد الإلكتروني',
                entry_gender: 'جنس',
                entry_male: 'الذكر',
                entry_female: 'إناثا',
                entry_dob: 'تاريخ الولادة',
                entry_customer_group: 'مجموعة العملاء',
                button_save: 'حفظ',
            },
            error: {
                no_customer_record: 'تحذير: لا يوجد عميل!',
                no_customer_selected: 'تحذير: حاليًا لم يتم اختيار أي عميل!',
            }
        },
        pos_cashier: {
            title: 'نقاط البيع الصراف',
            top_menu: {
                close_counter: 'إغلاق العداد',
                today_cash: 'اليوم النقدية',
                sales_history: 'تاريخ المبيعات'
            },
            menu_content: {
                text_opening_amount: 'فتح درج المبلغ',
                entry_amount: 'فتح المبلغ',
                entry_remark: 'ملاحظات',
                button_open_store: 'افتح المتجر',
                close_counter: {
                    text_drawer_amount: 'تفاصيل مقدار الدرج',
                    text_counted_amount: 'عد درج المبلغ',
                    text_closing_details: 'إغلاق تفاصيل الدرج',
                    text_open_amount: 'فتح المبلغ',
                    text_total_cash: 'إجمالي النقد اليوم',
                    text_current_drawer_sale: 'بيع الدرج الحالي',
                    text_expected_amount: 'المبلغ المتوقع في الدرج',
                    text_amount: 'كمية ({currency})',
                    text_remark: 'تعليق',
                    text_remark_placeholder: 'تعليق بخصوص الرصيد النقدي ..',
                    text_difference: 'الفرق بين مبلغ الفتح ومبلغ بيع الدرج الحالي',
                    button_close_drawer: 'إغلاق الدرج',
                }
            }
        },
        pos_cashier_closecounter: {
            title: 'إغلاق العداد'
        },
        pos_cashier_todaycash: {
            title: 'اليوم النقدية'
        },
        pos_cashier_saleshistory: {
            title: 'تاريخ المبيعات'
        },
        pos_reports: {
            title: 'تقارير نقاط البيع'
        },
        pos_product: {
            title: 'نقاط البيع المنتج',
            top_menu: {
                low_stock: 'انخفاض المخزون المنتج',
                request_list: 'المنتجات المطلوبة',
                setting: 'ضبط'
            },
            menu_content: {
                low_stock: {
                    text_left: ' اليسار',
                    text_request_product: 'طلب المنتج',
                    request_product: 'إضافة منتج لطلب الأسهم',
                    entry_required_qty: 'الكمية المطلوبة',
                    entry_request_to_supplier: 'طلب المورد',
                    entry_select: 'حدد المورد',
                    text_qty: ' الكمية',
                    entry_supplier_name: 'اسم المورد',
                    entry_comment: 'تعليق',
                    button_add: 'أضف إلى القائمة',
                    button_send: 'ارسل طلب'
                },
                request_list: {
                    column_id: 'هوية شخصية',
                    column_name: 'اسم المنتج',
                    column_qty: 'الكمية',
                    column_supplier: 'المورد',
                    column_comment: 'تعليق',
                    column_date: 'تاريخ',
                    column_status: 'الحالة',
                    no_record_found: 'لم يتم العثور على طلب',
                    action_pending: 'قيد الانتظار',
                    action_complete: 'اكتمال',
                    action_decline: 'انخفاض',
                },
                setting: {
                    entry_product_setting: 'وضع المنتج نقاط البيع',
                    entry_low_stock: 'وحدة الحد الأدنى من الكمية للمنتجات منخفضة المخزون',
                    button_done: 'فعله'
                }
            },
            error: {
                no_lowstock_product: 'تحذير: لا يوجد منتج ذو مخزون منخفض!'
            }
        },
        pos_product_low_stock: {
            title: 'منتجات الأسهم منخفضة'
        },
        pos_product_requested: {
            title: 'المنتجات المطلوبة',
            placeholder_search: 'بحث المنتج المطلوب حسب الاسم'
        },
        pos_product_setting: {
            title: 'إعداد المنتج'
        },
        pos_setting: {
            title: 'وضع نقاط البيع',
            top_menu: {
                discount: 'خصم الولاء',
                taxes: 'الضرائب',
                basic_setting: 'الإعداد الأساسي',
                profile_setting: 'إعداد الملف الشخصي'
            },
            menu_content: {
                discount: {
                    text_discount: 'نموذج الخصم',
                    add_discount: 'إضافة الخصم',
                    edit_discount: 'تحرير الخصم',
                    entry_offer_name: 'اسم العرض',
                    entry_from_price: 'من السعر',
                    entry_to_price: 'إلى السعر',
                    entry_discount_type: 'نوع الخصم',
                    entry_discount_value: 'القيمة',
                    entry_fix: 'ثابت',
                    entry_percentage: 'النسبة المئوية',
                    button_done: 'فعله',
                    text_range: 'نطاق',
                    text_to: 'إلى',
                },
                tax: {
                    text_tax: 'نموذج الضرائب',
                    add_tax: 'إضافة الضريبة',
                    edit_tax: 'تحرير الضريبة',
                    button_done: 'فعله'
                },
                basic: {
                    entry_select_locale: 'اختر لغة',
                    entry_select_currency: 'اختر العملة'
                },
                profile: {
                    entry_user_profile: 'إعداد ملف تعريف المستخدم',
                    entry_firstname: 'الاسم الاول',
                    entry_lastname: 'الكنية',
                    entry_username: 'اسم المستخدم',
                    entry_email: 'حساب البريد الإلكتروني',
                    entry_pre_password: 'كلمة المرور السابقة',
                    entry_new_password: 'كلمة السر الجديدة',
                    entry_confirm_password: 'تأكيد كلمة المرور',
                    button_done: 'فعله'
                }
            },
            error: {
                required_fromprice: 'تحذير: ملء حقل السعر!',
                required_toprice: 'تحذير: ملء حقل السعر!',
                grather_fromprice: 'تحذير: من السعر لا يمكن أن يكون أكبر من السعر',
                no_discount: 'تحذير: لا يوجد خصم متاح!',
                no_taxes: 'تحذير: لا توجد ضرائب متاحة!'
            }
        },
        pos_setting_discount: {
            title: 'نقاط البيع'
        },
        pos_setting_taxes: {
            title: 'ضرائب البيع'
        },
        pos_setting_basic: {
            title: 'وضع الإعداد الأساسي'
        },
        pos_setting_profile: {
            title: 'موقف الملف الشخصي'
        }
    }
}