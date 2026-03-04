import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appDestacaProxima]',
  standalone: true,
})
export class DestacaProxima implements OnInit {
  @Input() appDestacaProxima: Date | undefined;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    if (this.appDestacaProxima) {
      const ahora = new Date();
      const proximosCinco = new Date();
      proximosCinco.setDate(ahora.getDate() + 7);

      if (
        this.appDestacaProxima >= ahora &&
        this.appDestacaProxima <= proximosCinco
      ) {
        this.el.nativeElement.style.backgroundColor = '#fff3cd';
        this.el.nativeElement.style.color = '#000000';
        this.el.nativeElement.style.border = '2px solid #ffc107';
        this.el.nativeElement.style.padding = '8px';
        this.el.nativeElement.style.borderRadius = '4px';
      }
    }
  }
}
