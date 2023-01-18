import { Injectable } from "@angular/core";
import { ListeCodifService } from "../liste-codif-service/liste-codif.service";

@Injectable({
  providedIn: "root",
})
export class ParamsAppService {
  key = "paramsApp";

  constructor(private listeCodifService: ListeCodifService) {}

  get() {
    return new Promise((resolve, reject) => {
      let params = localStorage.getItem(this.key);
      if (params) {
        resolve(JSON.parse(params));
      } else {
        this.listeCodifService.get_parametrages_app().subscribe((res: any) => {
          params = res;
          this.set(params);
          resolve(params);
        });
      }
    });
  }

  set(data: any) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  remove() {
    localStorage.removeItem(this.key);
  }
}
