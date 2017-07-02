import * as moment from 'moment';

export class CreateMatchController
{
    static $inject = ['$scope', '$http', '$state', 'PATHS', 'LoginService', 'toaster', '$ionicLoading', 'Canchas'];

    public match:any = {
        date: new Date(),
        hour: new Date(moment('15:30','HH:mm')),
        id_cancha: null,
        address: '',
        address_lat:'',
        address_lng: '',
        game_level_from: '2.5',
        game_level_to: '2.5',
        type:'singles',
        sexo:'mixto'
    };
    public partner_club:any = '0';
    public address;
    public map;
    public market;
    public canchas;

    public stopSave = false;
    constructor($scope, private $http, private $state, private PATHS, private LoginService, private toaster, private $ionicLoading, Canchas){
        if(!LoginService.getUser().complete){
            $ionicLoading.hide();
            toaster.pop({type:'error', body:'Debe completar su perfil primero.'});
            $state.go('app.profile',{},{replace: true});
        }
        this.canchas = Canchas.data.canchas;
        this.map = { center: { latitude: -34.6038966, longitude: -58.3817433 }, zoom: 14 };
        console.log(new Date(moment('15:30','HH:mm a')));
    }

    public validateTime(){
        if(this.match.hour.getMinutes() != 0 && this.match.hour.getMinutes() != 30){
            this.toaster.pop({type:'info', body:'En la hora del partido, solo se admiten intervalos de 30 minutos.'});
            this.match.hour = new Date(moment('15:30','HH:mm'));
            return false;
        }

        return true;
    }

    public validateDateTime(){
        const now = new Date();
        if(this.match.date.getFullYear() == now.getFullYear() && this.match.date.getMonth() == now.getMonth()
            && this.match.date.getDate() == now.getDate() && this.match.hour < now){
            this.toaster.pop({type:'info', body:'La fecha y/o hora ya pasarón.'});
            this.match.hour = new Date(moment('15:30','HH:mm'));
            return false;
        }
        return true;
    }

    public changePartnerClub(){
        console.log('changePartnerClub');
        if(this.partner_club > 0){
            const cancha = this.canchas.find(c => c.id == this.partner_club);
            if(cancha){
                this.map.center.latitude= cancha.address_lat;
                this.map.center.longitude= cancha.address_lng;
                this.market = { latitude: cancha.address_lat, longitude: cancha.address_lng };
                this.match.id_cancha = this.partner_club;
                this.match.club_name = cancha.name;
                this.match.address = cancha.address;
                this.match.address_lat = cancha.address_lat;
                this.match.address_lng = cancha.address_lng;
            }
        }else{
            this.match.id_cancha = null;
            this.match.club_name = '';
            this.match.address = null;
            this.match.address_lat = null;
            this.match.address_lng = null;
        }
    }

    public changeAddress(){
        if(this.address.geometry && this.address.geometry.location){
            this.map.center.latitude= this.address.geometry.location.lat();
            this.map.center.longitude= this.address.geometry.location.lng();
            this.market = { latitude: this.address.geometry.location.lat(), longitude: this.address.geometry.location.lng() };
            this.match.address = this.address.formatted_address;
            this.match.address_lat = this.address.geometry.location.lat();
            this.match.address_lng = this.address.geometry.location.lng();
        }
    }

    public validateYears(){

        if(!this.match.years_from || !this.match.years_to){
           return;
        }

        if(this.match.years_from <= 17){
            this.toaster.pop({type:'info', body:'La "Edad desde" debe ser mayor a 17 años.'})
        }
        if(this.match.years_from > 100){
            this.toaster.pop({type:'info', body:'La "Edad desde" debe ser menor a 100 años.'})
        }
        if(this.match.years_from > this.match.years_to){
            this.toaster.pop({type:'info', body:'La "Edad desde" debe ser menor a la "Edad hasta".'})
        }
    }

    public save(form){
        if(!this.validateTime()){
           return;
        }

        if(!this.validateDateTime()){
           return;
        }

        const vm = this;
        if(form.$valid && this.match.years_from > 17 && this.match.years_to<100 && this.match.years_from<=this.match.years_to && !this.stopSave){
            this.$ionicLoading.show({
                template: `<ion-spinner class="tc-spinner"></ion-spinner>`,
                hideOnStateChange: true,
                showBackdrop: true,
            });
            this.stopSave = !this.stopSave;
            this.match.hour = this.match.hour.toLocaleTimeString();
            this.$http.post(this.PATHS.api + '/match', this.match).then(function(resp){
                vm.$ionicLoading.hide();
                if(resp.data.success){
                    vm.$state.go('app.suggested_players', {match_id:resp.data.match_id});
                }
            });
        }else{
          if (this.match.years_from<=17) {
            this.toaster.pop({type:'info', body:'La edad del jugador debe ser apartir de los 18.'});
          } else {
            this.toaster.pop({type:'info', body:'Debe completar todos los datos.'});
          }
        }
    }
}

angular.module('CreateMatch')
        .controller('CreateMatchController', ['$scope', '$http', '$state', 'PATHS', 'LoginService', 'toaster', '$ionicLoading', 'Canchas', CreateMatchController]);
