import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
  DoCheck,
  SimpleChanges
} from "@angular/core";
import { FormControl } from "@angular/forms";
@Component({
  selector: 'ms-select-autocomplete-code',
  templateUrl: './select-autocomplete-code.component.html',
  styleUrls: ['./select-autocomplete-code.component.scss']
})
export class SelectAutocompleteCodeComponent implements OnChanges {
  @Input() formControl: FormControl = new FormControl();
  @Input('required') required: boolean;
  @Input('nomInput') nomInput: any;
  @Input('smartList') smartList: any;
  @Input('disabled') disabled: boolean = false;
  @Input('flag_obligatoire') flag_obligatoire: any;
  @Input('isRequiredOptional') isRequiredOptional: boolean = false;
  @Input('showEmptyValue') showEmptyValue: boolean = true;

  @Output() optionSelected: EventEmitter<any> = new EventEmitter();
  @Output() optionSelectedModif: EventEmitter<any> = new EventEmitter();
  
  filteredOptions: Array<any> = [];
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    this.getListCode()
    if (changes.smartList)
    this.onChangeModif()

    if (this.disabled)
      this.formControl.disable();
    else
      this.formControl.enable();
    if (!this.formControl.value)
      this.formControl.setValue(null);
  }

  getListCode() {
    this.filteredOptions = this.smartList;
  }

  filterItem(value) {
    this.filteredOptions = this.smartList.filter(
      item => item.libelle_codification.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }

  onSelectionItem(item) {    
    this.optionSelected.emit(item);
  }

  onChangeModif() {
    if (this.formControl.value) {
      const item = this.smartList.filter(
        item => String(item.code_codification).toLowerCase().indexOf(String(this.formControl.value).toLowerCase()) > -1
      )
      if(item[0])
      this.optionSelectedModif.emit(item[0]);
    }
  }

}
