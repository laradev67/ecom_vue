
import {routes} from './routes';

const router=new VueRouter({
    routes,
});

import Notification from './Helpers/notification';
window.Notification=Notification
//import Sweet alert
import Swal from "sweetalert2";

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

window.Toast=Toast

// Initialize Vue
const app = new Vue({
    router,
    el:"#wrapper",
    data:{
        baseURL:data.getBaseURL(),
        adminId:data.getAdminId(),
        storageURL:data.getStorageURL(),

        try:0,
        notif:'',
    },
    created(){
        data.setAdmin({
            name:"Loading...",
        });
        this.getAdmin(this.adminId);
    },
    methods:{
        /**
         * Get Admin information
         * @param Int Admin Id
         * @return Object admin
         */
        getAdmin:function(adminId) {
            var vm=this;
            axios.get(this.baseURL+'api/v1/admin/'+adminId)
                .then(function (response) {
                    vm.try=0;
                    data.setAdmin(response.data);
                })
                .catch(function (error) {
                    util.log(error);
                    if(this.try<3){
                        this.try++;
                        this.getAdmin(adminId);
                    }
                    else{
                        util.notif("An error occurred, Please try to refresh",'error');
                    }
                })
        },
        logout:function () {
            axios.get(this.baseURL+'logout')
                .then( function(response) {
                    location.href = this.baseURL+"admin/login";
                })
                .catch( function(error) {
                    util.log(error);
                    util.notify('An error occured', 'error');
                });
        }
    },
    computed: {
        admin: function() {
            return data.admin;
        },
    }
})
