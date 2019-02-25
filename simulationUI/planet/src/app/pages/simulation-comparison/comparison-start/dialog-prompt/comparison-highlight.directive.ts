import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appCompHighlight]',
})
export class ComparisonHighlightDirective {

    constructor(private el: ElementRef) { }

    @Input('appCompHighlight') highlightColor: string;

    @HostListener('click') onMouseClick() {
        this.highlight(this.highlightColor || 'red');
    }

    private highlight(color: string) {
        if (this.el.nativeElement.style.backgroundColor === color) {
            this.el.nativeElement.style.backgroundColor = 'white';
        } else {
            this.el.nativeElement.style.backgroundColor = color;
        }

    }
}
