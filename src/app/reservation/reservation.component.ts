import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  form = new FormGroup({
    start_date: new FormControl(undefined, [Validators.required]),
    end_date: new FormControl('', [Validators.required]),
    type: new FormControl(undefined, [Validators.required]),
    user_name: new FormControl(undefined, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
  });
  types_of_conference_rooms: any[] = [
    {code: 'C20', name: 'Conference room with 20 persons'},
    {code: 'C40', name: 'Conference room with 40 persons'},
  ]
  reservations: Array<reservation> = [];
  check_pass: boolean = false;
  reservation_obj: reservation = {start:'', end: '', type: '', name: ''};
  booked: reservation = {start:'', end: '', type: '', name: ''};
  @ViewChild('form_details') templateRef: TemplateRef<any> | undefined;
  @ViewChild('info') templateRefInfo: TemplateRef<any> | undefined;
  constructor(
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    // @ts-ignore
    this.reservations = JSON.parse(localStorage.getItem('reservations')) || '';
    this.loadReservations()
  }
  submit(){
    if(this.form.invalid){
      alert('Please fill in the form')
    }
    if(this.form.controls['start_date'].value > this.form.controls['end_date'].value){
      alert('Please choose an end date greater than the start date')
    }
    let type = this.types_of_conference_rooms.find((elt)=> elt.code === this.form.controls['type'].value)
     this.reservation_obj = {
      start: this.form.controls['start_date'].value,
      end: this.form.controls['end_date'].value,
      type: type.name,
      name: this.form.controls['user_name'].value
    }
    this.checkDates()
    if(this.reservations.length === 0){
      this.modalService.open(this.templateRef, { size: 'lg' })
    }else {
      if(this.check_pass){
        this.modalService.open(this.templateRef, { size: 'lg' })
      }else return
    }
  }

  checkDates(){
    this.reservations.forEach((elt)=>{
      const start = this.form.controls['start_date'].value;
      const end = this.form.controls['end_date'].value;
      const type = this.types_of_conference_rooms.find((elt)=> elt.code === this.form.controls['type'].value)
      if(type.name === elt.type){
        if((start > elt.start &&  start < elt.end) || start === elt.start || start === elt.end ){
          this.modalService.open(this.templateRefInfo)
          this.check_pass = false;
          this.booked = elt
        }else if((end > elt.start &&  end < elt.end) || end === elt.start || end === elt.end){
          this.modalService.open(this.templateRefInfo)
          this.check_pass = false;
          this.booked = elt
        }else this.check_pass = true;
      } else this.check_pass = true;
    })
  }

  saveReservation(data:reservation){
    this.reservations.push(data)
    localStorage.removeItem('reservations')
    localStorage.setItem('reservations', JSON.stringify(this.reservations));
    this.form.reset();
  }

  loadReservations(){
    // @ts-ignore
    const saved_reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    this.reservations = saved_reservations
  }
}

interface reservation {
  start: string;
  end: string;
  type: string;
  name: string;
}
