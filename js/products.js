let productModal=null;
let delProductModal=null
const url='https://vue3-course-api.hexschool.io';
const api_path='peiying';

import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';
import pagination from './pagination.js'
const app=createApp({

    //區域註冊
    components:{
        pagination
    },
    data(){
        return{
            isNew:false,
            pagination:{},
            products:[],
            tempProduct:{
                imagesUrl:[]
            }
        }
    },
    methods: {
        check(){
            const apiUrl=`${url}/v2/api/user/check`;
            axios.post(apiUrl).then(res=>{
                
                this.getProducts()
            })
            .catch(err=>{
                console.dir(err)
                window.location='index.html'
            })
        },
        getProducts(page=1){
            const apiUrl=`${url}/v2/api/${api_path}/admin/products/?page=${page}`
            axios.get(apiUrl).then(res=>{
                this.pagination=res.data.pagination
                this.products=res.data.products
                console.log(this.products)
            })
            .catch(err=>{
                console.dir(err)
            })
        },
        openModal(state,item){
            if(state==='new'){
                this.tempProduct={
                    imagesUrl:[]
                };
                this.isNew=true;
                productModal.show();

            }else if(state==='edit'){
                this.tempProduct={...item};
                this.isNew=false;
                productModal.show();

            }else if(state==='delete'){
                this.tempProduct={...item};
                delProductModal.show();
            }

        },
        
        
        

    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
            });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
            });

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        
        this.check()
        
        
    },
    
})
//全域元件
app.component('productModal',{
    props:['tempProduct','isNew'],
    template:`#templateForProductModal`,
    methods:{
        updata(){
            let apiUrl=`${url}/v2/api/${api_path}/admin/product`;
            let http='post';
            if(!this.isNew){
                apiUrl=`${url}/v2/api/${api_path}/admin/product/${this.tempProduct.id}`
                http='put'
            }
            axios[http](apiUrl,{data:this.tempProduct})
            .then(res=>{
                console.log(res)
                //全域元件無法觸發外層方法
                //this.getProducts();
                this.$emit('get-products')
                productModal.hide();
            })
            .catch(err=>{
                console.dir(err)
            })

        },
        creatImg(){
            this.tempProduct.imagesUrl=[];
            this.tempProduct.imagesUrl.push('');
        },
    }
});

app.component('delProductModal', {
    template: '#delProductModal',
    props: ['item'],
    methods:{
        delProduct(){
            const apiUrl=`${url}/v2/api/${api_path}/admin/product/${this.tempProduct.id}`
            axios.delete(apiUrl)
            .then(res=>{
                console.log(res.data)
                delProductModal.hide();
                alert(res.data.message)
                this.$emit('update');
            })
            .catch(err=>{
                console.dir(err)
            })
        }
    }
})

app.mount('#app')