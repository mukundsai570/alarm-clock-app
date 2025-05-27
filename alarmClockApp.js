import { LightningElement } from 'lwc';
import AlarmClockAssets from '@salesforce/resourceUrl/AlarmClockAssets'

export default class AlarmClockApp extends LightningElement {
    clockImage = AlarmClockAssets + '/AlarmClockAssets/clock.png';
    ringtone = new Audio(AlarmClockAssets + '/AlarmClockAssets/Clocksound.mp3')
    currentTime =''
    currentDate = ''
    hours = []
    minutes = []
    meridems = ['AM','PM']
    hoursSelected
    minSelected
    meridemSelected
    alarmTime
    isAlarmSet = false
    isAlarmTriggered = false

    get isFieldNotSelected(){
        return !(this.hoursSelected && this.minSelected && this.meridemSelected)
    }

    get shakeImage(){
        return this.isAlarmTriggered ? 'shake' : ''
    }

    
    connectedCallback(){
        this.createHoursOptions()
        this.createMinutesOptions()
        this.currentTimeHandler()
        this.currentDateHandler()
    }

    currentTimeHandler(){
        setInterval(()=>{
        let dateTime = new Date()
        let hour = dateTime.getHours()
        let min = dateTime.getMinutes()
        let sec = dateTime.getSeconds()
        let ampm = "AM"
        if(hour == 0){
            hour = 12
        }else if(hour === 12){
            ampm = "PM"
        }else if(hour >=12){
            hour = hour-12
            ampm = "PM"
        }
        hour = hour<10 ? "0"+hour : hour
        min = min<10 ? "0"+min : min
        sec = sec<10 ? "0"+sec : sec

        this.currentTime=`${hour}:${min}:${sec} ${ampm}`
        if(this.alarmTime === `${hour}:${min} ${ampm}`){
            console.log("alarm triggered!!!")
            this.isAlarmTriggered = true
            this.ringtone.play()
            this.ringtone.loop = true
        }
        },1000)

        
        }
        createHoursOptions(){
            for(let i=1;i<=12;i++){
                let val = i<10 ? "0"+i : i
                this.hours.push(val) 
        }
    }
        createMinutesOptions(){
            for(let i=0;i<=59;i++){
                let val = i<10 ? "0"+i : i
                this.minutes.push(val) 
        }
    }
    optionhandler(event){
        const {label,value} = event.detail
        if(label === "Hour(s)"){
            this.hoursSelected = value
        } else if(label === "Minute(s)"){
            this.minSelected = value
        } else if(label === "AM/PM"){
            this.meridemSelected = value
        }else{}

       // console.log("this.hoursSelected",this.hoursSelected)
        //console.log("this.minSelected",this.minSelected)
        //console.log("this.meridemSelected",this.meridemSelected)
    }

    currentDateHandler(){
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    this.currentDate = now.toLocaleDateString('en-US', options);
     }

    setAlarmHandler(){
        this.alarmTime = `${this.hoursSelected}:${this.minSelected} ${this.meridemSelected}`
        this.isAlarmSet = true

    }
    clearAlarmHandler(){
        this.alarmTime = ''
        this.isAlarmSet = false
        this.isAlarmTriggered = false
        this.ringtone.pause()
        const elements = this.template.querySelectorAll('c-clock-drop-down')
        Array.from(elements).forEach(element =>{
            element.reset("")
        })
       
    }
 }
