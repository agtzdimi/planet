import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

@Component({
    selector: 'ngx-param-header',
    styleUrls: ['./param-header.component.scss'],
    templateUrl: './param-header.component.html',
})
export class ParamHeaderComponent implements OnDestroy {
    private alive = true;

    @Output() periodChange = new EventEmitter<string>();

    @Input() type: string;

    @Input() types: string[];
    currentTheme: string;

    constructor(private themeService: NbThemeService) {
        this.themeService.getJsTheme()
            .pipe(takeWhile(() => this.alive))
            .subscribe(theme => {
                this.currentTheme = theme.name;
            });
    }

    changePeriod(period: string): void {
        this.type = period;
        this.periodChange.emit(period);
    }

    ngOnDestroy() {
        this.alive = false;
    }
}
