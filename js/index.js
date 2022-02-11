import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';
const app={
    data(){
        return{
            user:{
                username:'',
                password:''
            }
        }
    },
    methods:{
        signin(){
            axios.post('https://vue3-course-api.hexschool.io/v2/admin/signin',this.user)
            .then(res=>{
                console.log(res)
                const {expired, token}=res.data
                document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;
                window.location='products.html'

            })
            .catch(err=>{
                console.dir(err)
            })
        }
    }
}

createApp(app).mount('#app');